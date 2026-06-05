import { NextResponse } from "next/server";

import { verifyBookingConfirmToken } from "@/lib/booking/booking-confirm-token";
import { confirmBooking } from "@/lib/booking/bookings-store";
import { sendBookingConfirmationEmails } from "@/lib/booking/consultation-notifications";
import { getBookingTimezone } from "@/lib/booking/env";
import { getDb } from "@/lib/booking/db";
import { formatConsultationSlotSpanish } from "@/lib/booking/consultation-email";

export const dynamic = "force-dynamic";

function confirmPageHtml(opts: {
  title: string;
  message: string;
  ok: boolean;
}): string {
  const accent = opts.ok ? "#967e66" : "#6a4128";
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${opts.title}</title>
</head>
<body style="margin:0;padding:32px 20px;background:#251105;color:#f2ebe3;font-family:Georgia,serif;">
  <div style="max-width:520px;margin:0 auto;background:#f2ebe3;color:#251105;border:1px solid ${accent};border-radius:16px;padding:32px 28px;">
    <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#967e66;font-family:sans-serif;">Fanny Torres da Silva</p>
    <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;color:#251105;">${opts.title}</h1>
    <p style="margin:0;font-size:16px;line-height:1.65;color:#3d2316;">${opts.message}</p>
  </div>
</body>
</html>`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const e = searchParams.get("e");
  const sig = searchParams.get("sig");

  if (!id || !e || !sig) {
    return new NextResponse(
      confirmPageHtml({
        ok: false,
        title: "Enlace no válido",
        message: "Faltan parámetros en el enlace de confirmación.",
      }),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const exp = Number(e);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) {
    return new NextResponse(
      confirmPageHtml({
        ok: false,
        title: "Enlace expirado",
        message:
          "Este enlace de confirmación ya no es válido. Revisa la solicitud más reciente en tu correo o confirma manualmente desde el panel.",
      }),
      { status: 410, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  if (!verifyBookingConfirmToken(id, exp, sig)) {
    return new NextResponse(
      confirmPageHtml({
        ok: false,
        title: "Enlace no autorizado",
        message: "No pudimos verificar este enlace de confirmación.",
      }),
      { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const sql = getDb();
  if (!sql) {
    return new NextResponse(
      confirmPageHtml({
        ok: false,
        title: "Error del servidor",
        message: "No se pudo conectar con la base de datos.",
      }),
      { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const organizerEmail = process.env.BOOKING_ORGANIZER_EMAIL?.trim();
  if (!organizerEmail) {
    return new NextResponse(
      confirmPageHtml({
        ok: false,
        title: "Configuración incompleta",
        message: "BOOKING_ORGANIZER_EMAIL no está configurado.",
      }),
      { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const result = await confirmBooking(sql, id);

  if (!result.ok) {
    if (result.reason === "already_confirmed") {
      return new NextResponse(
        confirmPageHtml({
          ok: true,
          title: "Reserva ya confirmada",
          message:
            "Esta solicitud ya había sido confirmada anteriormente. La persona debería haber recibido su correo de confirmación.",
        }),
        { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
      );
    }
    return new NextResponse(
      confirmPageHtml({
        ok: false,
        title: "Reserva no encontrada",
        message:
          "No encontramos esta solicitud o ya no está pendiente de confirmación.",
      }),
      { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const tz = getBookingTimezone();
  const timeHm = result.row.start_hm.trim().slice(0, 5);
  const dateTimeLine = formatConsultationSlotSpanish(
    result.row.booked_on,
    timeHm,
    tz,
    result.row.modality,
  );

  const { guestEmailSent } = await sendBookingConfirmationEmails({
    row: result.row,
    timezone: tz,
    organizerEmail,
  });

  const emailNote = guestEmailSent
    ? "Se envió el correo de confirmación a la persona con los detalles y el calendario."
    : "La reserva quedó confirmada, pero no se pudo enviar el correo a la persona. Revisa la configuración de Resend.";

  return new NextResponse(
    confirmPageHtml({
      ok: true,
      title: "Reserva confirmada",
      message: `Confirmaste la consulta de <strong>${result.row.guest_name}</strong> para el ${dateTimeLine}. ${emailNote}`,
    }),
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
