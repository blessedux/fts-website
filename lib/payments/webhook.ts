import {
  InvalidWebhookSignatureError,
  WebhookSignatureValidator,
} from "mercadopago"
import { requireMpWebhookSecret } from "@/lib/payments/env"
import type { MpCountry } from "@/lib/payments/types"

export type WebhookHeaders = {
  xSignature: string | null
  xRequestId: string | null
  dataId: string | null
}

export type WebhookVerifyResult =
  | { ok: true }
  | {
      ok: false
      reason: string
      status: 401 | 500
    }

/**
 * Verifies a Mercado Pago webhook using the per-country secret from
 * Your integrations → Webhooks.
 */
export function verifyMpWebhookSignature(
  country: MpCountry,
  headers: WebhookHeaders,
): WebhookVerifyResult {
  let secret: string
  try {
    secret = requireMpWebhookSecret(country)
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "Missing webhook secret",
      status: 500,
    }
  }

  try {
    WebhookSignatureValidator.validate({
      xSignature: headers.xSignature,
      xRequestId: headers.xRequestId,
      dataId: headers.dataId,
      secret,
      toleranceSeconds: 300,
    })
    return { ok: true }
  } catch (err) {
    if (err instanceof InvalidWebhookSignatureError) {
      return { ok: false, reason: err.reason, status: 401 }
    }
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "Webhook validation failed",
      status: 401,
    }
  }
}

export type MpWebhookBody = {
  id?: number | string
  live_mode?: boolean
  type?: string
  action?: string
  data?: { id?: string }
  user_id?: string | number
  date_created?: string
  api_version?: string
}
