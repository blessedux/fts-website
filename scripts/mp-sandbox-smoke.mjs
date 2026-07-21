#!/usr/bin/env node
/**
 * Mercado Pago sandbox smoke check (FTS ticket #1).
 *
 * Loads `.env.local` / `.env` and:
 *  1) GET /users/me for each configured country (AR / CL)
 *  2) Creates a tiny Checkout Pro preference (optional API call)
 *  3) Signs a fake webhook and POSTs it to the local webhook route
 *
 * Usage:
 *   npm run payments:smoke
 *   npm run payments:smoke -- --country CL
 *   npm run payments:smoke -- --skip-preference
 *   npm run payments:smoke -- --skip-webhook
 *
 * Requires the Next.js dev server for the webhook step:
 *   npm run dev -- --port <port matching BOOKING_PUBLIC_BASE_URL>
 */

import { createHmac } from "node:crypto"
import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import { MercadoPagoConfig, Preference, User } from "mercadopago"

function loadEnvFile(name) {
  const path = resolve(process.cwd(), name)
  if (!existsSync(path)) return
  const text = readFileSync(path, "utf8")
  for (const line of text.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = value
  }
}

loadEnvFile(".env")
loadEnvFile(".env.local")

const skipPreference = process.argv.includes("--skip-preference")
const skipWebhook = process.argv.includes("--skip-webhook")
const countryFlagIdx = process.argv.indexOf("--country")
const countryFilter =
  countryFlagIdx >= 0
    ? String(process.argv[countryFlagIdx + 1] || "")
        .trim()
        .toUpperCase()
    : ""
const base = (
  process.env.PAYMENTS_SMOKE_BASE_URL ||
  process.env.BOOKING_PUBLIC_BASE_URL ||
  "http://127.0.0.1:3000"
).replace(/\/$/, "")

const SITE_BY_COUNTRY = { AR: "MLA", CL: "MLC" }
const CURRENCY_BY_COUNTRY = { AR: "ARS", CL: "CLP" }

function tokenFor(country) {
  return (
    process.env[`MP_ACCESS_TOKEN_${country}`]?.trim() ||
    process.env.MP_ACCESS_TOKEN?.trim() ||
    process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim() ||
    ""
  )
}

function secretFor(country) {
  return (
    process.env[`MP_WEBHOOK_SECRET_${country}`]?.trim() ||
    process.env.MP_WEBHOOK_SECRET?.trim() ||
    ""
  )
}

function signWebhook({ secret, dataId, requestId, ts }) {
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`
  const v1 = createHmac("sha256", secret).update(manifest).digest("hex")
  return `ts=${ts},v1=${v1}`
}

async function smokeCountry(country) {
  const token = tokenFor(country)
  if (!token) {
    console.log(`↷ ${country}: no access token (set MP_ACCESS_TOKEN_${country})`)
    return { country, ok: false, skipped: true }
  }

  const config = new MercadoPagoConfig({ accessToken: token })
  const user = new User(config)
  const profile = await user.get()
  const siteOk = profile.site_id === SITE_BY_COUNTRY[country]
  console.log(
    `✓ ${country}: /users/me id=${profile.id} site_id=${profile.site_id} nickname=${profile.nickname || "—"}`,
  )
  if (!siteOk) {
    console.warn(
      `  ! expected site_id ${SITE_BY_COUNTRY[country]} for ${country}; got ${profile.site_id}`,
    )
  }

  let preferenceId = null
  if (!skipPreference) {
    const preference = new Preference(config)
    const created = await preference.create({
      body: {
        items: [
          {
            id: `smoke-${country}`,
            title: `FTS smoke ${country}`,
            quantity: 1,
            unit_price: country === "CL" ? 1000 : 100,
            currency_id: CURRENCY_BY_COUNTRY[country],
          },
        ],
        external_reference: `SMOKE_${country}_${Date.now()}`,
        notification_url: `${base}/api/payments/webhook?country=${country}`,
      },
    })
    preferenceId = created.id
    console.log(
      `✓ ${country}: preference ${created.id} init_point=${created.init_point || created.sandbox_init_point}`,
    )
  }

  if (!skipWebhook) {
    const secret = secretFor(country)
    if (!secret) {
      console.log(
        `↷ ${country}: skip webhook POST (set MP_WEBHOOK_SECRET_${country})`,
      )
    } else {
      const dataId = String(preferenceId || `smoke-${Date.now()}`)
      const requestId = `smoke-req-${Date.now()}`
      const ts = String(Date.now())
      const xSignature = signWebhook({ secret, dataId, requestId, ts })
      const url = `${base}/api/payments/webhook?country=${country}&data.id=${encodeURIComponent(dataId)}`
      let res
      try {
        res = await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-signature": xSignature,
            "x-request-id": requestId,
          },
          body: JSON.stringify({
            action: "payment.updated",
            type: "payment",
            live_mode: false,
            data: { id: dataId },
          }),
        })
      } catch (err) {
        const why = err instanceof Error ? err.message : String(err)
        throw new Error(
          `${country} webhook POST to ${url} failed (${why}). ` +
            `Start the app on that host/port (\`npm run dev -- --port <port>\`), ` +
            `or set PAYMENTS_SMOKE_BASE_URL / BOOKING_PUBLIC_BASE_URL to match. ` +
            `Offline-only check: npm run payments:webhook-selftest`,
        )
      }
      const text = await res.text()
      if (!res.ok) {
        throw new Error(
          `${country} webhook POST failed ${res.status}: ${text.slice(0, 400)}`,
        )
      }
      console.log(`✓ ${country}: webhook accepted (${res.status}) ${text}`)
    }
  }

  return { country, ok: true, siteOk, preferenceId }
}

let countries = ["AR", "CL"].filter((c) => tokenFor(c))
if (countryFilter) {
  if (countryFilter !== "AR" && countryFilter !== "CL") {
    console.error(`Invalid --country ${countryFilter}. Use AR or CL.`)
    process.exit(1)
  }
  countries = countries.filter((c) => c === countryFilter)
  if (countries.length === 0) {
    console.error(
      `No access token for ${countryFilter}. Set MP_ACCESS_TOKEN_${countryFilter}.`,
    )
    process.exit(1)
  }
}
if (countries.length === 0) {
  console.error(
    "No MP access tokens found. Copy .env.example → .env.local and set MP_ACCESS_TOKEN_CL (AR later).",
  )
  process.exit(1)
}

console.log("Mercado Pago sandbox smoke")
console.log(`Base URL: ${base}`)
console.log(`Countries: ${countries.join(", ")}\n`)

let failed = false
for (const country of countries) {
  try {
    const result = await smokeCountry(country)
    if (!result.ok && !result.skipped) failed = true
    if (result.ok && result.siteOk === false) failed = true
  } catch (err) {
    failed = true
    console.error(`✗ ${country}:`, err instanceof Error ? err.message : err)
  }
  console.log("")
}

console.log(
  "Note: SumUp deferred. AR Mercado Pago can wait — CLP path is the current focus.",
)
process.exit(failed ? 1 : 0)
