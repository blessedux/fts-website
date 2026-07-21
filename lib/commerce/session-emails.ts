import { getPublicSiteUrl, getSocialUrlsForEmail } from "@/lib/booking/env"
import { buildEmailSocialFooterBlock } from "@/lib/booking/consultation-email"
import type { SessionInvoice } from "@/lib/commerce/session-invoices"
import { updateSessionInvoice } from "@/lib/commerce/session-invoices"

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
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    console.error("[session-email] Resend error", res.status, errText)
    return false
  }
  return true
}

function getResendCreds(): { apiKey: string; from: string } | null {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_FROM_EMAIL?.trim()
  if (!apiKey || !from) return null
  return { apiKey, from }
}

function money(invoice: SessionInvoice): string {
  return `$${invoice.total.toLocaleString("es-CL")} ${invoice.currency}`
}

function shellEmail(input: {
  preheader: string
  headline: string
  bodyHtml: string
}): string {
  const siteUrl = getPublicSiteUrl()
  const social = getSocialUrlsForEmail()
  const socialFooter = buildEmailSocialFooterBlock(social)
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" />
<title>${escapeHtml(input.headline)}</title>
<!-- preheader: ${escapeHtml(input.preheader)} -->
</head>
<body style="margin:0;padding:0;background:#f2ebe3;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(input.preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f2ebe3;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;background:#fffdf9;border:1px solid #c4b5a6;border-radius:12px;" cellspacing="0" cellpadding="0">
        <tr><td style="padding:28px 28px 8px;font-family:Georgia,'Times New Roman',serif;color:#3d2316;">
          <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#967e66;">Fanny Torres Silva</p>
          <h1 style="margin:0 0 18px;font-size:26px;font-weight:500;line-height:1.25;color:#3d2316;">${escapeHtml(input.headline)}</h1>
          ${input.bodyHtml}
        </td></tr>
        <tr><td style="padding:8px 28px 28px;font-family:Georgia,'Times New Roman',serif;">
          <p style="margin:0 0 16px;font-size:13px;line-height:1.5;color:#967e66;">
            <a href="${escapeAttr(siteUrl)}" style="color:#6a4128;text-decoration:underline;">${escapeHtml(siteUrl.replace(/^https?:\/\//, ""))}</a>
          </p>
          ${socialFooter}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

/** Email the client a Mercado Pago checkout link after the session. */
export async function sendSessionCheckoutEmail(
  invoice: SessionInvoice,
): Promise<boolean> {
  const creds = getResendCreds()
  const checkoutUrl = invoice.initPoint
  if (!creds || !checkoutUrl) {
    console.warn("[session-email] skip checkout email — missing Resend or initPoint")
    return false
  }

  const subject = `Pago de tu sesión · Fanny Torres Silva`
  const text = [
    `Hola ${invoice.clientName},`,
    "",
    "Gracias por la sesión. Cuando quieras, puedes pagar con este enlace seguro de Mercado Pago:",
    checkoutUrl,
    "",
    `Monto: ${money(invoice)}`,
    "",
    "No es necesario pagar antes de la sesión; este enlace es solo para el cobro posterior.",
    "",
    `Referencia: ${invoice.id}`,
  ].join("\n")

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#6a4128;">Hola ${escapeHtml(invoice.clientName)},</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#6a4128;">
      Gracias por la sesión. Puedes pagar de forma segura con Mercado Pago:
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
      <tr><td align="center">
        <a href="${escapeAttr(checkoutUrl)}"
           style="display:inline-block;padding:14px 22px;background-color:#6a4128;color:#f2ebe3!important;text-decoration:none;border-radius:10px;font-size:14px;font-weight:600;">
          Pagar ${escapeHtml(money(invoice))}
        </a>
      </td></tr>
    </table>
    <p style="margin:0 0 10px;font-size:14px;line-height:1.55;color:#6a4128;">
      Este cobro es <strong>después</strong> de la sesión. No se requiere pago anticipado.
    </p>
    <p style="margin:0;font-size:13px;color:#967e66;">Referencia: ${escapeHtml(invoice.id)}</p>
  `

  const ok = await sendResendEmail(creds.apiKey, {
    from: creds.from,
    to: [invoice.clientEmail],
    subject,
    text,
    html: shellEmail({
      preheader: `Paga tu sesión · ${money(invoice)}`,
      headline: "Pago de tu sesión",
      bodyHtml,
    }),
  })

  if (ok) {
    await updateSessionInvoice(invoice.id, {
      checkoutEmailSentAt: new Date().toISOString(),
    })
  }
  return ok
}

/** Short confirmation that payment was approved. */
export async function sendSessionConfirmationEmail(
  invoice: SessionInvoice,
): Promise<boolean> {
  const creds = getResendCreds()
  if (!creds) {
    console.warn("[session-email] skip confirmation — missing Resend env")
    return false
  }

  const subject = `Pago confirmado · Sesión · Fanny Torres Silva`
  const text = [
    `Hola ${invoice.clientName},`,
    "",
    "Confirmamos que recibimos tu pago de la sesión. ¡Gracias!",
    "",
    `Monto: ${money(invoice)}`,
    `Referencia: ${invoice.id}`,
    "",
    "En un momento recibirás el comprobante detallado.",
  ].join("\n")

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#6a4128;">Hola ${escapeHtml(invoice.clientName)},</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#6a4128;">
      Confirmamos que recibimos tu pago de la sesión. <strong>¡Gracias!</strong>
    </p>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.55;color:#3d2316;">
      Monto: <strong>${escapeHtml(money(invoice))}</strong>
    </p>
    <p style="margin:0;font-size:13px;color:#967e66;">Referencia: ${escapeHtml(invoice.id)}</p>
    <p style="margin:16px 0 0;font-size:14px;line-height:1.55;color:#6a4128;">
      Enseguida te enviamos el comprobante detallado.
    </p>
  `

  return sendResendEmail(creds.apiKey, {
    from: creds.from,
    to: [invoice.clientEmail],
    subject,
    text,
    html: shellEmail({
      preheader: "Tu pago de sesión fue confirmado",
      headline: "Pago confirmado",
      bodyHtml,
    }),
  })
}

/** Detailed receipt / comprobante after approved payment. */
export async function sendSessionReceiptEmail(
  invoice: SessionInvoice,
): Promise<boolean> {
  const creds = getResendCreds()
  if (!creds) {
    console.warn("[session-email] skip receipt — missing Resend env")
    return false
  }

  const subject = `Comprobante de pago · Sesión · Fanny Torres Silva`
  const text = [
    `Hola ${invoice.clientName},`,
    "",
    "Este mensaje es tu comprobante de pago.",
    "",
    `Concepto: ${invoice.title}`,
    `Monto: ${money(invoice)}`,
    `Estado: pagado`,
    invoice.paidAt ? `Fecha: ${invoice.paidAt}` : "",
    invoice.mpPaymentId ? `ID pago MP: ${invoice.mpPaymentId}` : "",
    `Referencia: ${invoice.id}`,
    "",
    "Gracias por confiar en este espacio.",
  ]
    .filter(Boolean)
    .join("\n")

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#6a4128;">Hola ${escapeHtml(invoice.clientName)},</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#6a4128;">
      Este correo es tu <strong>comprobante</strong> de pago.
    </p>
    <table role="presentation" cellpadding="8" cellspacing="0" style="margin:0 0 16px;font-size:14px;color:#3d2316;width:100%;border-collapse:collapse;">
      <tr style="border-bottom:1px solid #e8dfd4;"><td style="color:#967e66;">Concepto</td><td><strong>${escapeHtml(invoice.title)}</strong></td></tr>
      <tr style="border-bottom:1px solid #e8dfd4;"><td style="color:#967e66;">Monto</td><td><strong>${escapeHtml(money(invoice))}</strong></td></tr>
      <tr style="border-bottom:1px solid #e8dfd4;"><td style="color:#967e66;">Estado</td><td>Pagado</td></tr>
      ${invoice.paidAt ? `<tr style="border-bottom:1px solid #e8dfd4;"><td style="color:#967e66;">Fecha</td><td>${escapeHtml(invoice.paidAt)}</td></tr>` : ""}
      ${invoice.mpPaymentId ? `<tr style="border-bottom:1px solid #e8dfd4;"><td style="color:#967e66;">ID pago</td><td>${escapeHtml(invoice.mpPaymentId)}</td></tr>` : ""}
      <tr><td style="color:#967e66;">Referencia</td><td>${escapeHtml(invoice.id)}</td></tr>
    </table>
    <p style="margin:0;font-size:15px;line-height:1.55;color:#6a4128;">Gracias por confiar en este espacio.</p>
  `

  const ok = await sendResendEmail(creds.apiKey, {
    from: creds.from,
    to: [invoice.clientEmail],
    subject,
    text,
    html: shellEmail({
      preheader: `Comprobante · ${money(invoice)}`,
      headline: "Comprobante de pago",
      bodyHtml,
    }),
  })

  if (ok) {
    await updateSessionInvoice(invoice.id, {
      receiptEmailSentAt: new Date().toISOString(),
    })
  }
  return ok
}

/**
 * After payment approved: confirmation email, then receipt.
 * Idempotent for receipt via receiptEmailSentAt.
 */
export async function sendSessionPaidEmails(
  invoice: SessionInvoice,
): Promise<{ confirmationSent: boolean; receiptSent: boolean }> {
  if (invoice.receiptEmailSentAt) {
    return { confirmationSent: false, receiptSent: false }
  }

  const confirmationSent = await sendSessionConfirmationEmail(invoice)
  const receiptSent = await sendSessionReceiptEmail(invoice)
  return { confirmationSent, receiptSent }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/'/g, "&#39;")
}
