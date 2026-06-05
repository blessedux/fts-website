/**
 * Booking configuration for FTS (Fanny Torres da Silva).
 *
 * ## Supabase Postgres
 * `DATABASE_URL` — Transaction pooler URI (port 6543) from Supabase → Project Settings → Database.
 * Shape: `postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require`
 *
 * ## Slot grid (all env-driven, defaults in parentheses)
 * - `BOOKING_SLOT_START_HOUR` (9) — First slot start hour
 * - `BOOKING_SLOT_END_HOUR` (18) — Window end, exclusive (so last slot at 17:xx for 60-min steps)
 * - `BOOKING_SLOT_STEP_MINUTES` (60) — Minutes between slot starts
 * - `BOOKING_MEETING_DURATION_MINUTES` (60) — Duration used in ICS + CalDAV events
 * - `BOOKING_WORK_DAYS` (1,2,3,4,5) — Comma-separated ISO weekday numbers (1=Mon…7=Sun)
 * - `BOOKING_MIN_DAYS_AHEAD` (2) — Minimum days in advance to book
 * - `BOOKING_MAX_DAYS_AHEAD` (42) — Maximum days ahead the window shows
 * - `BOOKING_TIMEZONE` (America/Santiago) — IANA timezone for all date math and ICS
 *
 * ## Blocking
 * - `BOOKING_BLOCKED_DATES` — Comma-separated YYYY-MM-DD (whole-day blocks)
 * - `BOOKING_BUSY_SLOTS_JSON` — `{ "YYYY-MM-DD": ["HH:mm", ...] }` extra busy slots
 *
 * ## Organizer / ICS
 * - `BOOKING_ORGANIZER_EMAIL` — Required; receives new booking requests (confirm link)
 * - `BOOKING_ICS_UID_HOST` — Optional FQDN for ICS UID (default: bookings.{BOOKING_PUBLIC_BASE_URL host})
 * - `BOOKING_ICS_DOWNLOAD_SECRET` — ≥16-char secret for signed .ics links + admin confirm links
 *
 * ## Email (Resend)
 * - `RESEND_API_KEY` + `RESEND_FROM_EMAIL` — Transactional email delivery
 * - `RESEND_MEETING_CONFIRMATION_TEMPLATE_ID` — Optional Resend template id
 * - `BOOKING_PUBLIC_BASE_URL` — Public origin for links in emails (no trailing slash)
 *
 * ## Social (optional, used in email footer)
 * - `BOOKING_SOCIAL_INSTAGRAM_URL`
 * - `BOOKING_SOCIAL_YOUTUBE_URL`
 * - `BOOKING_SOCIAL_WEB_URL`
 *
 * ## iCloud CalDAV (optional)
 * - `BOOKING_ICLOUD_CALDAV_ENABLED=true`
 * - `ICLOUD_APPLE_ID`, `ICLOUD_APP_SPECIFIC_PASSWORD`
 * - `ICLOUD_CALDAV_CALENDAR_NAME` or `ICLOUD_CALDAV_CALENDAR_URL`
 */

function parseEnvInt(key: string, fallback: number): number {
  const v = process.env[key]?.trim();
  if (!v) return fallback;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function getSlotStartHour(): number {
  return parseEnvInt("BOOKING_SLOT_START_HOUR", 9);
}

export function getSlotEndHour(): number {
  return parseEnvInt("BOOKING_SLOT_END_HOUR", 18);
}

export function getSlotStepMinutes(): number {
  return parseEnvInt("BOOKING_SLOT_STEP_MINUTES", 60);
}

export function getMeetingDurationMinutes(): number {
  return parseEnvInt("BOOKING_MEETING_DURATION_MINUTES", 60);
}

export function getWorkDays(): number[] {
  const raw = process.env.BOOKING_WORK_DAYS?.trim();
  if (!raw) return [1, 2, 3, 4, 5];
  const days = raw
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= 7);
  return days.length > 0 ? days : [1, 2, 3, 4, 5];
}

export function getMinDaysAhead(): number {
  return parseEnvInt("BOOKING_MIN_DAYS_AHEAD", 2);
}

export function getMaxDaysAhead(): number {
  return parseEnvInt("BOOKING_MAX_DAYS_AHEAD", 42);
}

export function getBookingTimezone(): string {
  const z = process.env.BOOKING_TIMEZONE?.trim();
  return z && z.length > 0 ? z : "America/Santiago";
}

export function parseBlockedDates(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^\d{4}-\d{2}-\d{2}$/.test(s));
}

/**
 * Per-weekday slot overrides (ISO weekday: 1=Mon … 7=Sun).
 * When a weekday key is present, its slot list replaces the default getTimeSlots() grid for that day.
 *
 * Example — Thursdays 10:00–12:00, Fridays 09:00–11:00:
 * BOOKING_WEEKDAY_SLOT_OVERRIDES={"4":["10:00","11:00","12:00"],"5":["09:00","10:00","11:00"]}
 */
export function getWeekdaySlotOverrides(): Record<number, string[]> {
  const raw = process.env.BOOKING_WEEKDAY_SLOT_OVERRIDES?.trim();
  if (!raw) return {};
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<number, string[]> = {};
    for (const [k, v] of Object.entries(o)) {
      const wd = parseInt(k, 10);
      if (!Number.isFinite(wd) || wd < 1 || wd > 7) continue;
      if (!Array.isArray(v)) continue;
      const slots = v.filter(
        (s): s is string =>
          typeof s === "string" && /^\d{2}:\d{2}$/.test(s),
      );
      if (slots.length > 0) out[wd] = slots;
    }
    return out;
  } catch {
    return {};
  }
}

export function parseBusySlotsJson(
  raw: string | undefined,
): Record<string, string[]> {
  if (!raw?.trim()) return {};
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(o)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) continue;
      if (Array.isArray(v)) out[k] = v.map((x) => String(x));
    }
    return out;
  } catch {
    return {};
  }
}

export function getPublicSiteUrl(): string {
  const fromEnv = process.env.BOOKING_PUBLIC_BASE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function getSocialUrlsForEmail(): {
  instagram: string;
  youtube: string;
  web: string;
} {
  return {
    instagram:
      process.env.BOOKING_SOCIAL_INSTAGRAM_URL?.trim() ||
      "https://www.instagram.com/fannytorresilva/",
    youtube:
      process.env.BOOKING_SOCIAL_YOUTUBE_URL?.trim() ||
      "https://www.youtube.com/@FannyTorresdasilva",
    web:
      process.env.BOOKING_SOCIAL_WEB_URL?.trim() ||
      "https://fannytorresilva.com/",
  };
}
