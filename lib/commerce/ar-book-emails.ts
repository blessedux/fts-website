import type { ArBookRequest } from "@/lib/commerce/ar-book-request"
import { markArBookRequestAdminEmailed } from "@/lib/commerce/ar-book-request"

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
    console.error("[ar-book-email] Resend error", res.status, errText)
    return false
  }
  return true
}

/**
 * Notify admin that an Argentina buyer tried to purchase the book
 * while online ARS checkout is unavailable.
 */
export async function sendArBookRequestAdminEmail(
  request: ArBookRequest,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_FROM_EMAIL?.trim()
  const admin =
    process.env.BOOKING_ORGANIZER_EMAIL?.trim() ||
    process.env.ADMIN_NOTIFY_EMAIL?.trim()

  if (!apiKey || !from || !admin) {
    console.warn(
      "[ar-book-email] skip admin notify — missing RESEND_* or BOOKING_ORGANIZER_EMAIL",
    )
    return false
  }

  const { buyer } = request
  const money = `$${request.total.toLocaleString("es-AR")} ${request.currency}`
  const subject = `[AR] Solicitud de compra de libro · ${buyer.name}`
  const text = [
    "Un comprador en Argentina intentó pagar el libro online.",
    "El checkout en ARS aún no está habilitado (credenciales Mercado Pago AR pendientes).",
    "Contactar al cliente directamente para coordinar el pago.",
    "",
    `Producto: ${request.productName}`,
    `Cantidad: ${request.quantity}`,
    `Total: ${money}`,
    "",
    "Datos del cliente:",
    `  Nombre: ${buyer.name}`,
    `  Email: ${buyer.email}`,
    `  Teléfono: ${buyer.phone}`,
    buyer.address ? `  Dirección: ${buyer.address}` : "",
    buyer.region ? `  Provincia/región: ${buyer.region}` : "",
    buyer.comuna ? `  Localidad/comuna: ${buyer.comuna}` : "",
    "",
    `Referencia: ${request.id}`,
    `Fecha: ${request.createdAt}`,
  ]
    .filter(Boolean)
    .join("\n")

  const html = `
    <div style="font-family:Georgia,serif;color:#3d2316;line-height:1.5;max-width:560px">
      <p style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#967e66;">Argentina · libro</p>
      <h1 style="font-size:22px;font-weight:500;margin:8px 0 16px;">Solicitud de compra (ARS offline)</h1>
      <p>Un comprador en Argentina intentó pagar el libro online. El checkout en ARS <strong>aún no está habilitado</strong>.</p>
      <p><strong>Contactar al cliente directamente</strong> para coordinar el pago.</p>
      <table cellpadding="6" style="margin:16px 0;font-size:14px;width:100%">
        <tr><td>Producto</td><td><strong>${escapeHtml(request.productName)}</strong></td></tr>
        <tr><td>Cantidad</td><td>${request.quantity}</td></tr>
        <tr><td>Total</td><td><strong>${escapeHtml(money)}</strong></td></tr>
        <tr><td>Nombre</td><td>${escapeHtml(buyer.name)}</td></tr>
        <tr><td>Email</td><td><a href="mailto:${escapeAttr(buyer.email)}">${escapeHtml(buyer.email)}</a></td></tr>
        <tr><td>Teléfono</td><td>${escapeHtml(buyer.phone)}</td></tr>
        ${buyer.address ? `<tr><td>Dirección</td><td>${escapeHtml(buyer.address)}</td></tr>` : ""}
        ${buyer.region ? `<tr><td>Provincia</td><td>${escapeHtml(buyer.region)}</td></tr>` : ""}
        ${buyer.comuna ? `<tr><td>Localidad</td><td>${escapeHtml(buyer.comuna)}</td></tr>` : ""}
        <tr><td>Referencia</td><td>${escapeHtml(request.id)}</td></tr>
      </table>
    </div>
  `

  const ok = await sendResendEmail(apiKey, {
    from,
    to: [admin],
    reply_to: buyer.email,
    subject,
    text,
    html,
  })

  if (ok) await markArBookRequestAdminEmailed(request.id)
  return ok
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
