import { DateTime } from "luxon";

import {
  getBookingTimezone,
  getMaxDaysAhead,
  getMinDaysAhead,
  getWeekdaySlotOverrides,
  getWorkDays,
} from "@/lib/booking/env";
import { getSlotCount, getTimeSlots } from "@/lib/booking/time-slots";

export function mergeBusyMaps(
  a: Record<string, string[]>,
  b: Record<string, string[]>,
): Record<string, string[]> {
  const out: Record<string, string[]> = { ...a };
  for (const [day, slots] of Object.entries(b)) {
    out[day] = [...new Set([...(out[day] ?? []), ...slots])];
  }
  return out;
}

/**
 * Build the base available-slots map for the range.
 * Only includes work days that fall within [today+minDaysAhead, today+maxDaysAhead]
 * and are not in blockedDates. All available slots equal the configured time grid.
 */
/**
 * Build the base available-slots map for the range.
 * Only includes work days that fall within [today+minDaysAhead, today+maxDaysAhead]
 * and are not in blockedDates.
 *
 * Per-weekday overrides (BOOKING_WEEKDAY_SLOT_OVERRIDES) take precedence over
 * the default uniform grid from getTimeSlots(), enabling different hours per day
 * (e.g. Thursday 10:00–12:00, Friday 09:00–11:00).
 */
export function buildBaseAvailableSlotsByDate(
  rangeStartYmd: string,
  rangeEndYmd: string,
  blockedDates: Set<string>,
): Record<string, string[]> {
  const defaultSlots = getTimeSlots();
  const weekdayOverrides = getWeekdaySlotOverrides();
  const workDays = new Set(getWorkDays());
  const tz = getBookingTimezone();
  const minDays = getMinDaysAhead();
  const maxDays = getMaxDaysAhead();

  const today = DateTime.now().setZone(tz).startOf("day");
  const earliest = today.plus({ days: minDays });
  const latest = today.plus({ days: maxDays });

  const out: Record<string, string[]> = {};
  let d = DateTime.fromISO(rangeStartYmd);
  const end = DateTime.fromISO(rangeEndYmd);
  if (!d.isValid || !end.isValid) return out;

  while (d <= end) {
    const ymd = d.toISODate()!;
    const wd = d.weekday; // 1=Mon … 7=Sun (Luxon ISO weekday)
    if (
      workDays.has(wd) &&
      !blockedDates.has(ymd) &&
      d >= earliest &&
      d <= latest
    ) {
      // Use weekday-specific slots if configured, otherwise fall back to default grid
      const slots = weekdayOverrides[wd] ?? defaultSlots;
      out[ymd] = [...slots];
    }
    d = d.plus({ days: 1 });
  }
  return out;
}

export function subtractBusyFromAvailable(
  available: Record<string, string[]>,
  busy: Record<string, string[]>,
): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const [day, slots] of Object.entries(available)) {
    const busySet = new Set(busy[day] ?? []);
    const next = slots.filter((s) => !busySet.has(s));
    if (next.length > 0) out[day] = next;
  }
  return out;
}

export function dayFullyBooked(
  ymd: string,
  busyByDate: Record<string, string[]>,
): boolean {
  const busy = busyByDate[ymd] ?? [];
  return busy.length >= getSlotCount();
}
