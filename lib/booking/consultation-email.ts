import { readFileSync } from "fs";
import { join } from "path";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

let cachedTemplate: string | null = null;

function loadConsultationTemplateEs(): string {
  if (cachedTemplate) return cachedTemplate;
  const path = join(
    process.cwd(),
    "lib/email-templates/consultation-confirmation-es.html",
  );
  cachedTemplate = readFileSync(path, "utf8");
  return cachedTemplate;
}

const RESEND_PLACEHOLDER = (key: string) => `{{{${key}}}}`;

function ampersandForHtmlAttr(url: string): string {
  return url.replace(/&/g, "&amp;");
}

const btnPrimaryStyle =
  "display:block;padding:14px 16px;text-align:center;background-color:#967e66;background-image:linear-gradient(165deg,#967e66 0%,#6a4128 55%,#3d2316 100%);color:#f2ebe3!important;text-decoration:none;border-radius:10px;font-size:14px;font-weight:600;line-height:1.35;border:1px solid #967e66;";

const btnSecondaryStyle =
  "display:block;padding:14px 12px;text-align:center;background-color:#f2ebe3;color:#3d2316!important;text-decoration:none;border-radius:10px;font-size:14px;font-weight:600;line-height:1.3;border:1px solid #967e66;";

const btnSecondaryPillStyle =
  "display:block;padding:14px 12px;text-align:center;background-color:#e8dfd4;color:#6a4128!important;border-radius:10px;font-size:13px;font-weight:600;line-height:1.35;border:1px solid #c4b5a6;";

const emailSocialBtnStyle =
  "display:inline-block;width:48px;height:48px;border-radius:50%;background-color:#251105;text-decoration:none;border:1px solid #967e66;";

const EMAIL_ICON_INSTAGRAM = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f2ebe3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" role="img" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`;

const EMAIL_ICON_YOUTUBE = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f2ebe3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" role="img" aria-hidden="true"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>`;

const EMAIL_ICON_WEB = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f2ebe3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" role="img" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`;

function emailSocialIconLink(
  href: string,
  title: string,
  iconSvg: string,
): string {
  return `<td style="padding:0 10px;">
    <a href="${ampersandForHtmlAttr(href)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(title)}" style="${emailSocialBtnStyle}">
      <table role="presentation" width="48" height="48" cellspacing="0" cellpadding="0" style="width:48px;height:48px;">
        <tr>
          <td align="center" valign="middle" style="width:48px;height:48px;line-height:0;">
            ${iconSvg}
          </td>
        </tr>
      </table>
    </a>
  </td>`;
}

export function buildEmailSocialFooterBlock(input: {
  instagram: string;
  youtube: string;
  web: string;
}): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto;">
    <tr>
      ${emailSocialIconLink(input.instagram, "Instagram", EMAIL_ICON_INSTAGRAM)}
      ${emailSocialIconLink(input.youtube, "YouTube", EMAIL_ICON_YOUTUBE)}
      ${emailSocialIconLink(input.web, "Sitio web", EMAIL_ICON_WEB)}
    </tr>
  </table>`;
}

export function buildIcsSecondaryCellHtml(
  icsDownloadUrl: string | null,
): string {
  return icsDownloadUrl
    ? `<a href="${ampersandForHtmlAttr(icsDownloadUrl)}" style="${btnSecondaryStyle}">Descargar .ics (Apple / Outlook)</a>`
    : `<span style="${btnSecondaryPillStyle}">Archivo .ics en este correo (adjunto)</span>`;
}

export function buildCalendarBlockHtml(input: {
  googleCalendarUrl: string;
  icsDownloadUrl: string | null;
}): string {
  const icsCell = buildIcsSecondaryCellHtml(input.icsDownloadUrl);
  return `
              <p style="margin:0 0 20px;font-size:15px;line-height:1.55;color:#6a4128;">Puedes añadir el evento a tu calendario con uno de estos enlaces:</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:8px;">
                <tr>
                  <td width="50%" valign="top" style="padding:6px 6px 6px 0;">
                    <a href="${ampersandForHtmlAttr(input.googleCalendarUrl)}" target="_blank" rel="noopener noreferrer" style="${btnPrimaryStyle}">Google Calendar</a>
                  </td>
                  <td width="50%" valign="top" style="padding:6px 0 6px 6px;">
                    ${icsCell}
                  </td>
                </tr>
              </table>
              <p style="margin:18px 0 0;font-size:13px;line-height:1.55;color:#967e66;">Si el archivo .ics no se descarga, revisa también el adjunto <strong style="color:#6a4128;">consulta.ics</strong> de este correo.</p>`;
}

export function buildConfirmActionBlockHtml(confirmUrl: string): string {
  return `
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:28px 0 8px;">
                <tr>
                  <td align="center">
                    <a href="${ampersandForHtmlAttr(confirmUrl)}" target="_blank" rel="noopener noreferrer" style="${btnPrimaryStyle}">Confirmar esta reserva</a>
                  </td>
                </tr>
              </table>
              <p style="margin:12px 0 0;font-size:13px;line-height:1.55;color:#967e66;text-align:center;">Al confirmar, la persona recibirá un correo con los detalles finales y el evento en su calendario.</p>`;
}

export function formatConsultationSlotSpanish(
  dateYmd: string,
  timeHm: string,
  timezone: string,
  modality: string,
): string {
  const [y, mo, d] = dateYmd.split("-").map(Number);
  const dt = new Date(y, mo - 1, d, 12, 0, 0);
  const datePart = dt.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const modalityLabel =
    modality === "presencial" ? "Presencial" : "Online";
  return `${datePart} · ${timeHm} (${timezone}) · ${modalityLabel}`;
}

export type ConsultationEmailVars = {
  preheader: string;
  headline: string;
  bodyLine1: string;
  bodyLine2: string;
  dateTimeLine: string;
  calendarBlock: string;
  actionBlock: string;
  footerNote: string;
  siteUrl: string;
  socialInstagram: string;
  socialYoutube: string;
  socialWeb: string;
};

export const RESEND_CONSULTATION_VARIABLE_KEYS = [
  "PREHEADER",
  "HEADLINE",
  "BODY_LINE_1",
  "BODY_LINE_2",
  "DATE_TIME_LINE",
  "CALENDAR_BLOCK",
  "ACTION_BLOCK",
  "FOOTER_NOTE",
  "SITE_URL",
  "SOCIAL_FOOTER_BLOCK",
  "SOCIAL_INSTAGRAM_URL",
  "SOCIAL_YOUTUBE_URL",
  "SOCIAL_WEB_URL",
] as const;

export type ResendConsultationVariableKey =
  (typeof RESEND_CONSULTATION_VARIABLE_KEYS)[number];

export function buildResendConsultationVariables(
  vars: ConsultationEmailVars,
): Record<ResendConsultationVariableKey, string> {
  return {
    PREHEADER: escapeHtml(vars.preheader),
    HEADLINE: escapeHtml(vars.headline),
    BODY_LINE_1: vars.bodyLine1,
    BODY_LINE_2: vars.bodyLine2,
    DATE_TIME_LINE: escapeHtml(vars.dateTimeLine),
    CALENDAR_BLOCK: vars.calendarBlock,
    ACTION_BLOCK: vars.actionBlock,
    FOOTER_NOTE: vars.footerNote,
    SITE_URL: escapeHtml(vars.siteUrl),
    SOCIAL_FOOTER_BLOCK: buildEmailSocialFooterBlock({
      instagram: vars.socialInstagram,
      youtube: vars.socialYoutube,
      web: vars.socialWeb,
    }),
    SOCIAL_INSTAGRAM_URL: ampersandForHtmlAttr(vars.socialInstagram),
    SOCIAL_YOUTUBE_URL: ampersandForHtmlAttr(vars.socialYoutube),
    SOCIAL_WEB_URL: ampersandForHtmlAttr(vars.socialWeb),
  };
}

/** Guest — solicitud recibida, pendiente de confirmación (Spanish). */
export function buildGuestRequestPendingEmailVars(input: {
  guestName: string;
  dateTimeLine: string;
  siteUrl: string;
  socialInstagram: string;
  socialYoutube: string;
  socialWeb: string;
}): ConsultationEmailVars {
  const n = escapeHtml(input.guestName);
  return {
    preheader: `Solicitud recibida — ${input.dateTimeLine}`.slice(0, 140),
    headline: "Hemos recibido tu solicitud",
    bodyLine1: `Hola ${n},`,
    bodyLine2:
      "Gracias por contactarnos. Tu solicitud de consulta ha sido registrada correctamente.<br /><br />" +
      "En este momento está <strong>pendiente de confirmación</strong>. Te avisaremos por correo en cuanto quede confirmada, con la fecha, el horario y las indicaciones para asistir.<br /><br />" +
      "Cuando recibas la confirmación, por favor <strong>llega puntual</strong> a tu sesión. Valoramos mucho tu tiempo y el nuestro.<br /><br />" +
      "Gracias por confiar en este espacio de trabajo interior.",
    dateTimeLine: input.dateTimeLine,
    calendarBlock: "",
    actionBlock: "",
    footerNote:
      '<p style="margin:20px 0 0;font-size:13px;line-height:1.55;color:#967e66;">Este correo no implica confirmación de la cita. Espera nuestro siguiente mensaje antes de agendar el evento en tu calendario.</p>',
    siteUrl: input.siteUrl,
    socialInstagram: input.socialInstagram,
    socialYoutube: input.socialYoutube,
    socialWeb: input.socialWeb,
  };
}

/** Guest — consulta confirmada (Spanish). */
export function buildGuestConsultationEmailVars(input: {
  guestName: string;
  dateTimeLine: string;
  googleCalendarUrl: string;
  icsDownloadUrl: string | null;
  siteUrl: string;
  socialInstagram: string;
  socialYoutube: string;
  socialWeb: string;
}): ConsultationEmailVars {
  const n = escapeHtml(input.guestName);
  return {
    preheader: `Consulta confirmada — ${input.dateTimeLine}`.slice(0, 140),
    headline: "Tu consulta está confirmada",
    bodyLine1: `Hola ${n},`,
    bodyLine2:
      "Tu consulta ha sido <strong>confirmada</strong>. Nos vemos pronto para comenzar este proceso.<br /><br />" +
      "Por favor <strong>llega puntual</strong> a tu sesión. Si surge algún imprevisto, avísanos con anticipación.",
    dateTimeLine: input.dateTimeLine,
    calendarBlock: buildCalendarBlockHtml({
      googleCalendarUrl: input.googleCalendarUrl,
      icsDownloadUrl: input.icsDownloadUrl,
    }),
    actionBlock: "",
    footerNote: "",
    siteUrl: input.siteUrl,
    socialInstagram: input.socialInstagram,
    socialYoutube: input.socialYoutube,
    socialWeb: input.socialWeb,
  };
}

/** Organizer — nueva solicitud pendiente (Spanish). */
export function buildOrganizerBookingRequestEmailVars(input: {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  modality: string;
  notes: string | null;
  dateTimeLine: string;
  confirmUrl: string | null;
  siteUrl: string;
  socialInstagram: string;
  socialYoutube: string;
  socialWeb: string;
}): ConsultationEmailVars {
  const name = escapeHtml(input.guestName);
  const em = escapeHtml(input.guestEmail);
  const modalityLabel =
    input.modality === "presencial" ? "Presencial" : "Online";
  const parts = [
    `${name} · ${em}`,
    `Teléfono: ${escapeHtml(input.guestPhone)}`,
    `Modalidad: ${modalityLabel}`,
    input.notes?.trim() ? `Notas: ${escapeHtml(input.notes.trim())}` : null,
  ].filter(Boolean);

  return {
    preheader:
      `Nueva solicitud — ${input.guestName} · ${input.dateTimeLine}`.slice(
        0,
        140,
      ),
    headline: "Nueva solicitud de consulta",
    bodyLine1:
      "Hay una nueva solicitud de consulta en el sitio. Revisa los datos y confirma la reserva para que la persona reciba su correo de confirmación.",
    bodyLine2: parts.join("<br />"),
    dateTimeLine: input.dateTimeLine,
    calendarBlock: "",
    actionBlock: input.confirmUrl
      ? buildConfirmActionBlockHtml(input.confirmUrl)
      : "",
    footerNote: input.confirmUrl
      ? ""
      : '<p style="margin:20px 0 0;font-size:13px;line-height:1.55;color:#967e66;">Configura BOOKING_ICS_DOWNLOAD_SECRET para habilitar el enlace de confirmación en este correo.</p>',
    siteUrl: input.siteUrl,
    socialInstagram: input.socialInstagram,
    socialYoutube: input.socialYoutube,
    socialWeb: input.socialWeb,
  };
}

function applyPlaceholders(
  html: string,
  map: Record<string, string>,
): string {
  let out = html;
  for (const [key, value] of Object.entries(map)) {
    out = out.split(RESEND_PLACEHOLDER(key)).join(value);
  }
  return out;
}

/** Renders the local HTML email (same markup uploaded to Resend). */
export function renderConsultationEmailEs(
  vars: ConsultationEmailVars,
): string {
  const html = loadConsultationTemplateEs();
  const v = buildResendConsultationVariables(vars);
  return applyPlaceholders(html, {
    PREHEADER: v.PREHEADER,
    HEADLINE: v.HEADLINE,
    BODY_LINE_1: v.BODY_LINE_1,
    BODY_LINE_2: v.BODY_LINE_2,
    DATE_TIME_LINE: v.DATE_TIME_LINE,
    CALENDAR_BLOCK: v.CALENDAR_BLOCK,
    ACTION_BLOCK: v.ACTION_BLOCK,
    FOOTER_NOTE: v.FOOTER_NOTE,
    SITE_URL: v.SITE_URL,
    SOCIAL_FOOTER_BLOCK: v.SOCIAL_FOOTER_BLOCK,
    SOCIAL_INSTAGRAM_URL: v.SOCIAL_INSTAGRAM_URL,
    SOCIAL_YOUTUBE_URL: v.SOCIAL_YOUTUBE_URL,
    SOCIAL_WEB_URL: v.SOCIAL_WEB_URL,
  });
}
