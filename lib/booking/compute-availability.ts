import {
  getBookingTimezone,
  parseBlockedDates,
  parseBusySlotsJson,
} from "@/lib/booking/env";
import { listBusySlotsInRange } from "@/lib/booking/bookings-store";
import { getDb, hasDatabase } from "@/lib/booking/db";
import type { CaldavFetchDebug, CaldavFetchMeta } from "@/lib/booking/icloud-caldav";
import {
  fetchIcloudBusyByDate,
  isIcloudCaldavEnabled,
} from "@/lib/booking/icloud-caldav";
import {
  fetchGoogleCalendarBusyByDate,
  isGoogleCalendarEnabled,
} from "@/lib/booking/google-calendar";
import {
  buildBaseAvailableSlotsByDate,
  mergeBusyMaps,
  subtractBusyFromAvailable,
} from "@/lib/booking/native-availability";

function sumSlotStarts(map: Record<string, string[]>): number {
  return Object.values(map).reduce((n, arr) => n + arr.length, 0);
}

export type AvailabilityDebug = {
  range: { from: string; to: string };
  baseWeekdays: number;
  baseOpenSlotStarts: number;
  envBusySlotStarts: number;
  busyAfterDbSlotStarts: number;
  caldavBusyDays: number;
  caldavBusySlotStarts: number;
  mergedBusySlotStarts: number;
  openSlotStartsAfterSubtract: number;
  caldav?: CaldavFetchDebug;
};

export type ComputeAvailabilityResult = {
  timezone: string;
  availableSlotsByDate: Record<string, string[]>;
  blockedDates: string[];
  databaseConfigured: boolean;
  databaseConnected: boolean;
  caldavConfigured: boolean;
  caldavOk: boolean;
  caldavError?: string;
  caldavMeta?: CaldavFetchMeta;
  googleCalendarConfigured: boolean;
  googleCalendarOk: boolean;
  googleCalendarError?: string;
  debug?: AvailabilityDebug;
};

/**
 * Single source of truth for slot grid + Postgres + env busy/blocked + iCloud CalDAV.
 * Used by GET /api/booking-availability and POST /api/book-consultation validation.
 */
export async function computeAvailability(opts: {
  fromYmd: string;
  toYmd: string;
  debug?: boolean;
}): Promise<ComputeAvailabilityResult> {
  const { fromYmd: from, toYmd: to } = opts;
  const debugMode = opts.debug === true && process.env.NODE_ENV !== "production";

  const blockedDatesArr = parseBlockedDates(process.env.BOOKING_BLOCKED_DATES);
  const blockedSet = new Set(blockedDatesArr);
  const envBusy = parseBusySlotsJson(process.env.BOOKING_BUSY_SLOTS_JSON);
  const timezone = getBookingTimezone();

  const base = buildBaseAvailableSlotsByDate(from, to, blockedSet);
  let combinedBusy = { ...envBusy };
  let combinedBusyAfterDb = combinedBusy;

  const sql = getDb();
  const databaseConfigured = hasDatabase();
  let databaseConnected = false;

  if (!databaseConfigured) {
    console.warn(
      "[booking-availability] DATABASE_URL is not set. Add it in Vercel → Environment Variables, then redeploy.",
    );
  } else if (sql) {
    try {
      const dbBusy = await listBusySlotsInRange(sql, from, to);
      combinedBusy = mergeBusyMaps(combinedBusy, dbBusy);
      combinedBusyAfterDb = combinedBusy;
      databaseConnected = true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[booking-availability] DB query failed:", msg);
      if (/relation ["']bookings["'] does not exist/i.test(msg)) {
        console.error(
          "[booking-availability] Apply migrations/001_fts_bookings.sql to this database.",
        );
      }
      if (/tenant\/user.*not found/i.test(msg)) {
        console.error(
          "[booking-availability] DATABASE_URL pooler username wrong — use Transaction pooler URI (postgres.<PROJECT_REF>, port 6543).",
        );
      }
      databaseConnected = false;
    }
  }

  const caldav = await fetchIcloudBusyByDate({
    fromYmd: from,
    toYmd: to,
    bookingTimezone: timezone,
    debug: debugMode,
  });

  if (caldav.ok && Object.keys(caldav.busyByDate).length > 0) {
    combinedBusy = mergeBusyMaps(combinedBusy, caldav.busyByDate);
  }

  // Google Calendar — primary busy-time source when configured
  const gcal = await fetchGoogleCalendarBusyByDate({
    fromYmd: from,
    toYmd: to,
    bookingTimezone: timezone,
  });

  if (gcal.ok && Object.keys(gcal.busyByDate).length > 0) {
    combinedBusy = mergeBusyMaps(combinedBusy, gcal.busyByDate);
  }

  const availableSlotsByDate = subtractBusyFromAvailable(base, combinedBusy);

  const result: ComputeAvailabilityResult = {
    timezone,
    availableSlotsByDate,
    blockedDates: blockedDatesArr,
    databaseConfigured,
    databaseConnected,
    caldavConfigured: isIcloudCaldavEnabled(),
    caldavOk: caldav.ok,
    caldavError: caldav.ok ? undefined : caldav.error,
    caldavMeta: caldav.ok ? caldav.caldavMeta : undefined,
    googleCalendarConfigured: isGoogleCalendarEnabled(),
    googleCalendarOk: gcal.ok,
    googleCalendarError: gcal.ok ? undefined : gcal.error,
  };

  if (debugMode) {
    result.debug = {
      range: { from, to },
      baseWeekdays: Object.keys(base).length,
      baseOpenSlotStarts: sumSlotStarts(base),
      envBusySlotStarts: sumSlotStarts(envBusy),
      busyAfterDbSlotStarts: sumSlotStarts(combinedBusyAfterDb),
      caldavBusyDays: Object.keys(caldav.busyByDate).length,
      caldavBusySlotStarts: sumSlotStarts(caldav.busyByDate),
      mergedBusySlotStarts: sumSlotStarts(combinedBusy),
      openSlotStartsAfterSubtract: sumSlotStarts(availableSlotsByDate),
      caldav:
        caldav.ok && "caldavDebug" in caldav && caldav.caldavDebug
          ? caldav.caldavDebug
          : undefined,
    };
  }

  return result;
}
