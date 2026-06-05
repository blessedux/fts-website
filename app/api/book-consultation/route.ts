import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";

import {
  getBookingTimezone,
  getMeetingDurationMinutes,
  getPublicSiteUrl,
  parseBlockedDates,
  parseBusySlotsJson,
} from "@/lib/booking/env";
import { getTimeSlots } from "@/lib/booking/time-slots";
import { computeAvailability } from "@/lib/booking/compute-availability";
import { createBooking } from "@/lib/booking/bookings-store";
import { getDb, hasDatabase } from "@/lib/booking/db";
import { sendBookingRequestEmails } from "@/lib/booking/consultation-notifications";
import { pushGoogleCalendarEvent } from "@/lib/booking/google-calendar";

export const dynamic = "force-dynamic";

type Body = {
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  modality: string;
  notes?: string;
  locale?: string;
};

function isSlotBlockedLocally(date: string, time: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return true;
  if (!/^\d{2}:\d{2}$/.test(time)) return true;
  const blockedDates = parseBlockedDates(process.env.BOOKING_BLOCKED_DATES);
  if (blockedDates.includes(date)) return true;
  const busy = parseBusySlotsJson(process.env.BOOKING_BUSY_SLOTS_JSON);
  const taken = busy[date] ?? [];
  return taken.includes(time);
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const { date, time, name, email, phone, modality } = body;
  if (
    !date ||
    !time ||
    !name?.trim() ||
    !email?.trim() ||
    !phone?.trim() ||
    !modality
  ) {
    return NextResponse.json(
      { ok: false, error: "missing_fields" },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400 },
    );
  }

  if (!["presencial", "online"].includes(modality)) {
    return NextResponse.json(
      { ok: false, error: "invalid_modality" },
      { status: 400 },
    );
  }

  if (isSlotBlockedLocally(date, time)) {
    return NextResponse.json(
      { ok: false, error: "slot_unavailable" },
      { status: 409 },
    );
  }

  const timeSlots = getTimeSlots();
  if (!timeSlots.includes(time)) {
    return NextResponse.json(
      { ok: false, error: "invalid_slot" },
      { status: 400 },
    );
  }

  const liveAvail = await computeAvailability({
    fromYmd: date,
    toYmd: date,
    debug: false,
  });
  const allowedStarts = liveAvail.availableSlotsByDate[date] ?? [];
  if (!allowedStarts.includes(time)) {
    return NextResponse.json(
      { ok: false, error: "slot_unavailable" },
      { status: 409 },
    );
  }

  const tz = getBookingTimezone();
  const durationMinutes = getMeetingDurationMinutes();
  const organizerEmail = process.env.BOOKING_ORGANIZER_EMAIL?.trim();
  const uidHostRaw =
    process.env.BOOKING_ICS_UID_HOST?.trim() ||
    new URL(getPublicSiteUrl()).hostname;
  const uidHost = uidHostRaw || "bookings.fts";

  const sql = getDb();
  if (!hasDatabase() || !sql) {
    return NextResponse.json(
      { ok: false, error: "database_not_configured" },
      { status: 503 },
    );
  }
  if (!organizerEmail) {
    return NextResponse.json(
      { ok: false, error: "organizer_not_configured" },
      { status: 503 },
    );
  }

  const persistedIcsUid = `${randomUUID()}@${uidHost}`;
  const insert = await createBooking(sql, {
    booked_on: date,
    start_hm: time,
    duration_minutes: durationMinutes,
    guest_name: name.trim(),
    guest_email: email.trim(),
    guest_phone: phone.trim(),
    modality,
    notes: body.notes?.trim() || null,
    ics_uid: persistedIcsUid,
  });

  if (!insert.ok) {
    return NextResponse.json(
      { ok: false, error: "slot_unavailable" },
      { status: 409 },
    );
  }

  const bookingId = String(insert.id);

  console.info("[book-consultation]", {
    date,
    time,
    name: name.trim(),
    email: email.trim(),
    modality,
    status: "pending",
    locale: body.locale,
  });

  // Push event to Google Calendar (fire-and-forget — booking is already saved to DB)
  const [startH, startM] = time.split(":").map(Number);
  const startIso = `${date}T${String(startH).padStart(2, "0")}:${String(startM).padStart(2, "0")}:00`;
  const endDt = DateTime.fromISO(startIso, { zone: tz }).plus({
    minutes: durationMinutes,
  });
  const endIso = endDt.toFormat("yyyy-MM-dd'T'HH:mm:ss");

  const gcalPush = await pushGoogleCalendarEvent({
    summary: `Consulta — ${name.trim()}`,
    description: [
      `Cliente: ${name.trim()}`,
      `Email: ${email.trim()}`,
      `Teléfono: ${phone.trim()}`,
      `Modalidad: ${modality}`,
      body.notes?.trim() ? `Notas: ${body.notes.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    startIso,
    endIso,
    timezone: tz,
  });

  if (!gcalPush.ok) {
    console.warn("[book-consultation] Google Calendar push failed:", gcalPush.error);
  }

  const { adminEmailSent, guestEmailSent } = await sendBookingRequestEmails({
    bookingId,
    guestName: name.trim(),
    guestEmail: email.trim(),
    guestPhone: phone.trim(),
    modality,
    notes: body.notes?.trim() || null,
    date,
    time,
    timezone: tz,
    organizerEmail,
  });

  return NextResponse.json({
    ok: true,
    bookingId,
    status: "pending",
    adminEmailSent,
    guestEmailSent,
  });
}
