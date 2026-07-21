import { NextResponse } from "next/server"
import { applyMercadoPagoPaymentNotification } from "@/lib/commerce/payments"
import { getDefaultMpCountry } from "@/lib/payments/env"
import { isMpCountry, type MpCountry } from "@/lib/payments/types"
import {
  verifyMpWebhookSignature,
  type MpWebhookBody,
} from "@/lib/payments/webhook"

export const runtime = "nodejs"

function resolveCountry(request: Request): MpCountry {
  const { searchParams } = new URL(request.url)
  const raw = (searchParams.get("country") || "").toUpperCase()
  if (raw && isMpCountry(raw)) return raw
  return getDefaultMpCountry()
}

/**
 * Mercado Pago webhook receiver.
 * Verifies signature, and for payment topics fetches the payment and marks orders paid.
 */
export async function POST(request: Request) {
  const country = resolveCountry(request)
  const url = new URL(request.url)
  const dataId =
    url.searchParams.get("data.id") ||
    url.searchParams.get("id") ||
    null

  const verified = verifyMpWebhookSignature(country, {
    xSignature: request.headers.get("x-signature"),
    xRequestId: request.headers.get("x-request-id"),
    dataId,
  })

  if (!verified.ok) {
    console.warn("[payments/webhook] signature rejected", {
      country,
      reason: verified.reason,
    })
    return NextResponse.json(
      { ok: false, error: "invalid_signature", reason: verified.reason },
      { status: verified.status },
    )
  }

  let body: MpWebhookBody = {}
  try {
    body = (await request.json()) as MpWebhookBody
  } catch {
    // Some MP probes send empty bodies; still ACK after signature OK.
  }

  const resourceId = body.data?.id || dataId
  const topic = body.type || url.searchParams.get("type") || ""

  let orderId: string | null = null
  let invoiceId: string | null = null
  let paymentStatus: string | undefined

  if (resourceId && (topic === "payment" || body.action?.startsWith("payment"))) {
    try {
      const result = await applyMercadoPagoPaymentNotification({
        country,
        paymentId: String(resourceId),
      })
      orderId = result.order?.id ?? null
      invoiceId = result.sessionInvoice?.id ?? null
      paymentStatus = result.paymentStatus
    } catch (err) {
      // ACK anyway so MP does not hammer retries on transient/smoke IDs.
      console.warn("[payments/webhook] payment lookup failed", {
        country,
        resourceId,
        message: err instanceof Error ? err.message : String(err),
      })
    }
  }

  console.info("[payments/webhook] accepted", {
    country,
    type: topic || body.type,
    action: body.action,
    live_mode: body.live_mode,
    resourceId,
    orderId,
    invoiceId,
    paymentStatus,
    requestId: request.headers.get("x-request-id"),
  })

  return NextResponse.json({
    ok: true,
    country,
    type: topic || body.type || null,
    resourceId: resourceId ?? null,
    orderId,
    invoiceId,
    paymentStatus: paymentStatus ?? null,
  })
}

/** Health probe for local tunnels / MP panel URL checks. */
export async function GET(request: Request) {
  const country = resolveCountry(request)
  return NextResponse.json({
    ok: true,
    service: "mercadopago-webhook",
    country,
    note: "POST notifications with x-signature; SumUp deferred.",
  })
}
