import { NextResponse } from "next/server";

import { getBookingTimezone, getPublicSiteUrl } from "@/lib/booking/env";
import { getBookingById } from "@/lib/booking/bookings-store";
import { getDb } from "@/lib/booking/db";
import { buildConsultationIcs } from "@/lib/booking/ics";
import { verifyIcsDownloadToken } from "@/lib/booking/ics-download-token";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const e = searchParams.get("e");
  const sig = searchParams.get("sig");

  if (!id || !e || !sig) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const exp = Number(e);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) {
    return NextResponse.json({ error: "expired" }, { status: 410 });
  }

  if (!verifyIcsDownloadToken(id, exp, sig)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ error: "server" }, { status: 503 });
  }

  const row = await getBookingById(sql, id);
  if (!row || row.status !== "confirmed") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const organizerEmail = process.env.BOOKING_ORGANIZER_EMAIL?.trim();
  if (!organizerEmail) {
    return NextResponse.json({ error: "server" }, { status: 503 });
  }

  const tz = getBookingTimezone();
  const siteUrl = getPublicSiteUrl();
  const timeHm = row.start_hm.trim().slice(0, 5);
  if (!/^\d{2}:\d{2}$/.test(timeHm)) {
    return NextResponse.json({ error: "invalid" }, { status: 500 });
  }

  const summary = `Consulta inicial — ${row.guest_name}`;
  const descParts = [
    `Guest: ${row.guest_name} <${row.guest_email}>`,
    `Phone: ${row.guest_phone}`,
    `Modality: ${row.modality === "presencial" ? "Presencial" : "Online"}`,
    row.notes?.trim() ? `Notes: ${row.notes}` : "",
    "",
    `Booked via ${siteUrl}`,
  ].filter(Boolean);

  let icsBody: string;
  try {
    icsBody = buildConsultationIcs({
      uid: row.ics_uid,
      date: row.booked_on,
      time: timeHm,
      timezone: tz,
      summary,
      description: descParts.join("\\n"),
      organizerEmail,
      attendeeName: row.guest_name,
      attendeeEmail: row.guest_email,
      durationMinutes: row.duration_minutes,
      calendarMethod: "REQUEST",
    });
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 500 });
  }

  return new NextResponse(icsBody, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="consulta-inicial.ics"',
      "Cache-Control": "no-store",
    },
  });
}
