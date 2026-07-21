/**
 * Mercado Pago configuration for FTS Commerce & payments v1.
 *
 * Provider: Mercado Pago only (AR + CL). SumUp is explicitly deferred.
 *
 * ## Required secrets (sandbox at minimum)
 * - `MP_ACCESS_TOKEN_AR` — Test/prod access token for the Argentina seller
 * - `MP_ACCESS_TOKEN_CL` — Test/prod access token for the Chile seller
 * - `MP_WEBHOOK_SECRET_AR` — Webhook secret from Your integrations → Webhooks (AR app)
 * - `MP_WEBHOOK_SECRET_CL` — Webhook secret from Your integrations → Webhooks (CL app)
 *
 * ## Optional
 * - `MP_ACCESS_TOKEN` — Fallback single token (local smoke only; prefer per-country)
 * - `MP_WEBHOOK_SECRET` — Fallback single webhook secret
 * - `MP_DEFAULT_COUNTRY` — `AR` | `CL` (default `CL`)
 * - `BOOKING_PUBLIC_BASE_URL` / `VERCEL_URL` — Used to build `notification_url` + back URLs
 *
 * ## Local
 * Copy `.env.example` → `.env.local`, fill sandbox tokens, then:
 *   npm run payments:smoke
 *
 * Point each MP app webhook URL at:
 *   {PUBLIC_BASE}/api/payments/webhook?country=AR
 *   {PUBLIC_BASE}/api/payments/webhook?country=CL
 * (use ngrok/cloudflare tunnel for local delivery)
 */

import { getPublicSiteUrl } from "@/lib/booking/env"
import { isMpCountry, type MpCountry } from "@/lib/payments/types"

function trimEnv(key: string): string | undefined {
  const v = process.env[key]?.trim()
  return v && v.length > 0 ? v : undefined
}

export function getDefaultMpCountry(): MpCountry {
  const raw = trimEnv("MP_DEFAULT_COUNTRY")?.toUpperCase()
  if (raw && isMpCountry(raw)) return raw
  return "CL"
}

export function getMpAccessToken(country: MpCountry): string | undefined {
  const perCountry = trimEnv(`MP_ACCESS_TOKEN_${country}`)
  if (perCountry) return perCountry
  return trimEnv("MP_ACCESS_TOKEN") ?? trimEnv("MERCADO_PAGO_ACCESS_TOKEN")
}

export function getMpWebhookSecret(country: MpCountry): string | undefined {
  const perCountry = trimEnv(`MP_WEBHOOK_SECRET_${country}`)
  if (perCountry) return perCountry
  return trimEnv("MP_WEBHOOK_SECRET")
}

export function requireMpAccessToken(country: MpCountry): string {
  const token = getMpAccessToken(country)
  if (!token) {
    throw new Error(
      `Missing Mercado Pago access token for ${country}. Set MP_ACCESS_TOKEN_${country} (or MP_ACCESS_TOKEN) in the environment.`,
    )
  }
  return token
}

export function requireMpWebhookSecret(country: MpCountry): string {
  const secret = getMpWebhookSecret(country)
  if (!secret) {
    throw new Error(
      `Missing Mercado Pago webhook secret for ${country}. Set MP_WEBHOOK_SECRET_${country} (or MP_WEBHOOK_SECRET) in the environment.`,
    )
  }
  return secret
}

export function getPaymentsPublicBaseUrl(): string {
  return getPublicSiteUrl()
}

export function getConfiguredMpCountries(): MpCountry[] {
  const countries: MpCountry[] = []
  if (getMpAccessToken("AR")) countries.push("AR")
  if (getMpAccessToken("CL")) countries.push("CL")
  return countries
}

/**
 * Online Mercado Pago checkout for a country.
 * AR requires a dedicated `MP_ACCESS_TOKEN_AR` (no shared fallback) so Chile
 * credentials never accidentally enable ARS Checkout Pro.
 */
export function isOnlineCheckoutEnabled(country: MpCountry): boolean {
  if (country === "AR") {
    return Boolean(trimEnv("MP_ACCESS_TOKEN_AR"))
  }
  return Boolean(getMpAccessToken("CL"))
}
