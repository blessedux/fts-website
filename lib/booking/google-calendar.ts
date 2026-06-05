import { DateTime } from "luxon";
import { google, type calendar_v3 } from "googleapis";

import {
  getBookingTimezone,
  getMeetingDurationMinutes,
  getWeekdaySlotOverrides,
} from "@/lib/booking/env";
import { getTimeSlots } from "@/lib/booking/time-slots";

// ─── Configuration ────────────────────────────────────────────────────────────

export function isGoogleCalendarEnabled(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim() &&
    process.env.GOOGLE_CALENDAR_ID?.trim()
  );
}

function parseServiceAccountCredentials() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON!.trim();
  // Accept plain JSON or base64-encoded JSON (useful for Vercel env vars)
  try {
    return JSON.parse(raw);
  } catch {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
  }
}

function makeAuth(scopes: string[]) {
  return new google.auth.GoogleAuth({
    credentials: parseServiceAccountCredentials(),
    scopes,
  });
}

// ─── Freebusy → slot-based busy map ──────────────────────────────────────────

function freebusyIntervalsToBusySlots(
  intervals: Array<{ start?: string | null; end?: string | null }>,
  fromYmd: string,
  toYmd: string,
  bookingTimezone: string,
): Record<string, string[]> {
  const defaultSlots = getTimeSlots();
  const weekdayOverrides = getWeekdaySlotOverrides();
  const meetingDuration = getMeetingDurationMinutes();
  const busyByDate: Record<string, Set<string>> = {};

  let d = DateTime.fromISO(fromYmd, { zone: bookingTimezone });
  const end = DateTime.fromISO(toYmd, { zone: bookingTimezone });

  while (d <= end) {
    const ymd = d.toISODate()!;
    const wd = d.weekday; // 1=Mon … 7=Sun
    // Only check slots that are actually configured for this weekday
    const slots = weekdayOverrides[wd] ?? defaultSlots;

    for (const hm of slots) {
      const slotStart = DateTime.fromISO(`${ymd}T${hm}:00`, {
        zone: bookingTimezone,
      });
      const slotEnd = slotStart.plus({ minutes: meetingDuration });

      for (const interval of intervals) {
        if (!interval.start || !interval.end) continue;
        const busyStart = DateTime.fromISO(interval.start).setZone(
          bookingTimezone,
        );
        const busyEnd = DateTime.fromISO(interval.end).setZone(bookingTimezone);
        // Overlap: slotStart < busyEnd AND slotEnd > busyStart
        if (slotStart < busyEnd && slotEnd > busyStart) {
          (busyByDate[ymd] ??= new Set()).add(hm);
          break;
        }
      }
    }
    d = d.plus({ days: 1 });
  }

  const out: Record<string, string[]> = {};
  for (const [date, set] of Object.entries(busyByDate)) {
    out[date] = [...set].sort();
  }
  return out;
}

// ─── Read busy times (Freebusy API) ──────────────────────────────────────────

export async function fetchGoogleCalendarBusyByDate(opts: {
  fromYmd: string;
  toYmd: string;
  bookingTimezone: string;
}): Promise<
  | { ok: true; busyByDate: Record<string, string[]> }
  | { ok: false; busyByDate: Record<string, never>; error: string }
> {
  if (!isGoogleCalendarEnabled()) return { ok: true, busyByDate: {} };

  try {
    const auth = makeAuth([
      "https://www.googleapis.com/auth/calendar.readonly",
    ]);
    const cal = google.calendar({ version: "v3", auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID!.trim();
    const tz = opts.bookingTimezone;

    const timeMin = DateTime.fromISO(opts.fromYmd, { zone: tz })
      .startOf("day")
      .toISO()!;
    const timeMax = DateTime.fromISO(opts.toYmd, { zone: tz })
      .endOf("day")
      .toISO()!;

    const { data } = await cal.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: tz,
        items: [{ id: calendarId }],
      },
    });

    const intervals = data.calendars?.[calendarId]?.busy ?? [];
    const busyByDate = freebusyIntervalsToBusySlots(
      intervals,
      opts.fromYmd,
      opts.toYmd,
      tz,
    );

    return { ok: true, busyByDate };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "google_calendar_error";
    console.warn("[google-calendar] freebusy query failed:", msg);
    return { ok: false, busyByDate: {}, error: msg };
  }
}

// ─── Push a new booking event ─────────────────────────────────────────────────

export async function pushGoogleCalendarEvent(opts: {
  summary: string;
  description: string;
  /** ISO datetime string in bookingTimezone, e.g. "2026-06-12T10:00:00" */
  startIso: string;
  endIso: string;
  timezone: string;
}): Promise<{ ok: true; eventId: string } | { ok: false; error: string }> {
  if (!isGoogleCalendarEnabled()) return { ok: false, error: "disabled" };

  try {
    // Writing events requires the full calendar scope
    const auth = makeAuth(["https://www.googleapis.com/auth/calendar"]);
    const cal = google.calendar({ version: "v3", auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID!.trim();

    const event: calendar_v3.Schema$Event = {
      summary: opts.summary,
      description: opts.description,
      start: { dateTime: opts.startIso, timeZone: opts.timezone },
      end: { dateTime: opts.endIso, timeZone: opts.timezone },
    };

    const { data } = await cal.events.insert({
      calendarId,
      requestBody: event,
    });

    return { ok: true, eventId: data.id ?? "" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "google_calendar_write_error";
    console.warn("[google-calendar] push event failed:", msg);
    return { ok: false, error: msg };
  }
}
