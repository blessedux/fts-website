import type { BookingRow } from "@/lib/booking/bookings-store";
import { buildBookingConfirmUrl } from "@/lib/booking/booking-confirm-token";
import {
  buildGuestConsultationEmailVars,
  buildGuestRequestPendingEmailVars,
  buildOrganizerBookingRequestEmailVars,
  buildResendConsultationVariables,
  formatConsultationSlotSpanish,
  renderConsultationEmailEs,
  type ConsultationEmailVars,
} from "@/lib/booking/consultation-email";
import { getPublicSiteUrl, getSocialUrlsForEmail } from "@/lib/booking/env";
import { buildGoogleCalendarUrl } from "@/lib/booking/google-calendar-link";
import { buildConsultationIcs } from "@/lib/booking/ics";
import {
  canSignIcsDownloadLinks,
  icsDownloadExpirySeconds,
  signIcsDownloadToken,
} from "@/lib/booking/ics-download-token";
import { pushIcloudCalendarEvent } from "@/lib/booking/icloud-caldav";

async function sendResendEmail(
  apiKey: string,
  payload: Record<string, unknown>,
): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("[consultation-email] Resend error", res.status, errText);
    return false;
  }
  return true;
}

async function sendConsultationEmail(opts: {
  to: string[];
  from: string;
  subject: string;
  text: string;
  html?: string;
  icsBody?: string;
  apiKey: string;
  templateId?: string;
  templateVars?: ReturnType<typeof buildResendConsultationVariables>;
}): Promise<boolean> {
  const payload: Record<string, unknown> = {
    from: opts.from,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
  };

  if (opts.templateId && opts.templateVars) {
    payload.template = { id: opts.templateId, variables: opts.templateVars };
  } else if (opts.html) {
    payload.html = opts.html;
  }

  if (opts.icsBody) {
    payload.attachments = [
      {
        filename: "consulta.ics",
        content: Buffer.from(opts.icsBody, "utf8").toString("base64"),
      },
    ];
  }

  return sendResendEmail(opts.apiKey, payload);
}

export function buildIcsForBooking(input: {
  row: BookingRow;
  organizerEmail: string;
  timezone: string;
  siteUrl: string;
}): string {
  const timeHm = input.row.start_hm.trim().slice(0, 5);
  const summary = `Consulta inicial — ${input.row.guest_name}`;
  const descParts = [
    `Guest: ${input.row.guest_name} <${input.row.guest_email}>`,
    `Phone: ${input.row.guest_phone}`,
    `Modality: ${input.row.modality === "presencial" ? "Presencial" : "Online"}`,
    input.row.notes?.trim() ? `Notes: ${input.row.notes}` : "",
    "",
    `Booked via ${input.siteUrl}`,
  ].filter(Boolean);

  return buildConsultationIcs({
    uid: input.row.ics_uid,
    date: input.row.booked_on,
    time: timeHm,
    timezone: input.timezone,
    summary,
    description: descParts.join("\\n"),
    organizerEmail: input.organizerEmail,
    attendeeName: input.row.guest_name,
    attendeeEmail: input.row.guest_email,
    durationMinutes: input.row.duration_minutes,
    calendarMethod: "REQUEST",
  });
}

function buildGoogleUrlForBooking(
  row: BookingRow,
  timezone: string,
  siteUrl: string,
): string {
  const timeHm = row.start_hm.trim().slice(0, 5);
  return buildGoogleCalendarUrl({
    title: `Consulta inicial — ${row.guest_name}`,
    details: [
      `Invitada/o: ${row.guest_name} (${row.guest_email})`,
      `Teléfono: ${row.guest_phone}`,
      `Modalidad: ${row.modality === "presencial" ? "Presencial" : "Online"}`,
      row.notes?.trim() ? `Notas: ${row.notes}` : "",
      "",
      `Reserva vía ${siteUrl}`,
    ]
      .filter(Boolean)
      .join("\n"),
    dateYmd: row.booked_on,
    timeHm,
    durationMinutes: row.duration_minutes,
    timezone,
  });
}

function icsDownloadUrlForBooking(
  bookingId: string,
  siteUrl: string,
): string | null {
  if (!canSignIcsDownloadLinks()) return null;
  const expUnix = Math.floor(Date.now() / 1000) + icsDownloadExpirySeconds();
  const sig = signIcsDownloadToken(bookingId, expUnix);
  return `${siteUrl}/api/booking-ics?id=${encodeURIComponent(bookingId)}&e=${expUnix}&sig=${sig}`;
}

async function dispatchEmail(
  vars: ConsultationEmailVars,
  opts: {
    to: string[];
    subject: string;
    text: string;
    icsBody?: string;
    resendKey: string;
    resendFrom: string;
    templateId?: string;
  },
): Promise<boolean> {
  let html: string | undefined;
  try {
    html = renderConsultationEmailEs(vars);
  } catch (e) {
    console.error("[consultation-email] HTML render failed", e);
  }

  return sendConsultationEmail({
    apiKey: opts.resendKey,
    from: opts.resendFrom,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html,
    icsBody: opts.icsBody,
    templateId: opts.templateId,
    templateVars: opts.templateId
      ? buildResendConsultationVariables(vars)
      : undefined,
  });
}

/** After a new pending booking: admin first, then guest request-received email. */
export async function sendBookingRequestEmails(input: {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  modality: string;
  notes: string | null;
  date: string;
  time: string;
  timezone: string;
  organizerEmail: string;
}): Promise<{ adminEmailSent: boolean; guestEmailSent: boolean }> {
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const resendFrom = process.env.RESEND_FROM_EMAIL?.trim();
  if (!resendKey || !resendFrom) {
    return { adminEmailSent: false, guestEmailSent: false };
  }

  const siteUrl = getPublicSiteUrl();
  const social = getSocialUrlsForEmail();
  const templateId = process.env.RESEND_MEETING_CONFIRMATION_TEMPLATE_ID?.trim();
  const dateTimeLine = formatConsultationSlotSpanish(
    input.date,
    input.time,
    input.timezone,
    input.modality,
  );
  const confirmUrl = buildBookingConfirmUrl(siteUrl, input.bookingId);

  const organizerVars = buildOrganizerBookingRequestEmailVars({
    guestName: input.guestName,
    guestEmail: input.guestEmail,
    guestPhone: input.guestPhone,
    modality: input.modality,
    notes: input.notes,
    dateTimeLine,
    confirmUrl,
    siteUrl,
    socialInstagram: social.instagram,
    socialYoutube: social.youtube,
    socialWeb: social.web,
  });

  const guestVars = buildGuestRequestPendingEmailVars({
    guestName: input.guestName,
    dateTimeLine,
    siteUrl,
    socialInstagram: social.instagram,
    socialYoutube: social.youtube,
    socialWeb: social.web,
  });

  const orgText = [
    "Nueva solicitud de consulta",
    dateTimeLine,
    `${input.guestName} <${input.guestEmail}>`,
    `Teléfono: ${input.guestPhone}`,
    `Modalidad: ${input.modality === "presencial" ? "Presencial" : "Online"}`,
    input.notes?.trim() ? `Notas: ${input.notes}` : "",
    "",
    confirmUrl ? `Confirmar reserva:\n${confirmUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const guestText = [
    "Hemos recibido tu solicitud de consulta.",
    dateTimeLine,
    "",
    "Tu solicitud está pendiente de confirmación. Te avisaremos por correo cuando quede confirmada.",
    "Por favor espera nuestro siguiente mensaje antes de agendar el evento en tu calendario.",
    "Gracias por confiar en este espacio.",
  ].join("\n");

  const adminEmailSent = await dispatchEmail(organizerVars, {
    to: [input.organizerEmail],
    subject: `Nueva solicitud · ${input.guestName} · ${input.date} ${input.time}`,
    text: orgText,
    resendKey,
    resendFrom,
    templateId,
  });

  const guestEmailSent = await dispatchEmail(guestVars, {
    to: [input.guestEmail],
    subject: `Solicitud recibida · ${input.date} ${input.time}`,
    text: guestText,
    resendKey,
    resendFrom,
    templateId,
  });

  return { adminEmailSent, guestEmailSent };
}

/** After admin confirms: guest confirmation + calendar + optional iCloud push. */
export async function sendBookingConfirmationEmails(input: {
  row: BookingRow;
  timezone: string;
  organizerEmail: string;
}): Promise<{ guestEmailSent: boolean; icloudPushed: boolean }> {
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const resendFrom = process.env.RESEND_FROM_EMAIL?.trim();
  const siteUrl = getPublicSiteUrl();
  const social = getSocialUrlsForEmail();
  const templateId = process.env.RESEND_MEETING_CONFIRMATION_TEMPLATE_ID?.trim();
  const timeHm = input.row.start_hm.trim().slice(0, 5);

  const dateTimeLine = formatConsultationSlotSpanish(
    input.row.booked_on,
    timeHm,
    input.timezone,
    input.row.modality,
  );

  const googleCalendarUrl = buildGoogleUrlForBooking(
    input.row,
    input.timezone,
    siteUrl,
  );
  const icsDownloadUrl = icsDownloadUrlForBooking(input.row.id, siteUrl);
  const icsBody = buildIcsForBooking({
    row: input.row,
    organizerEmail: input.organizerEmail,
    timezone: input.timezone,
    siteUrl,
  });

  const push = await pushIcloudCalendarEvent({
    icsBody,
    filenameBase: input.row.ics_uid,
  });

  let guestEmailSent = false;
  if (resendKey && resendFrom) {
    const guestVars = buildGuestConsultationEmailVars({
      guestName: input.row.guest_name,
      dateTimeLine,
      googleCalendarUrl,
      icsDownloadUrl,
      siteUrl,
      socialInstagram: social.instagram,
      socialYoutube: social.youtube,
      socialWeb: social.web,
    });

    const guestText = [
      "Tu consulta está confirmada.",
      dateTimeLine,
      "",
      "Por favor llega puntual a tu sesión.",
      "",
      "Google Calendar:",
      googleCalendarUrl,
      icsDownloadUrl ? `\nDescarga .ics:\n${icsDownloadUrl}` : "",
      "",
      "También adjuntamos consulta.ics.",
    ]
      .filter(Boolean)
      .join("\n");

    guestEmailSent = await dispatchEmail(guestVars, {
      to: [input.row.guest_email],
      subject: `Consulta confirmada · ${input.row.booked_on} ${timeHm}`,
      text: guestText,
      icsBody,
      resendKey,
      resendFrom,
      templateId,
    });
  }

  return { guestEmailSent, icloudPushed: push.ok };
}
