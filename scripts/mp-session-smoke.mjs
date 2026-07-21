#!/usr/bin/env node
/**
 * Session post-pay smoke (ticket #3) — CLP.
 *
 *   npm run dev -- --port 3002
 *   npm run payments:session-smoke
 */

import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

function loadEnvFile(name) {
  const path = resolve(process.cwd(), name)
  if (!existsSync(path)) return
  for (const line of readFileSync(path, "utf8").split("\n")) {
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

const base = (
  process.env.PAYMENTS_SMOKE_BASE_URL ||
  process.env.BOOKING_PUBLIC_BASE_URL ||
  "http://127.0.0.1:3002"
).replace(/\/$/, "")

console.log("Session post-pay smoke (CL)")
console.log(`Base URL: ${base}\n`)

// Resend test mode rejects example.com — use a real inbox.
const clientEmail =
  process.env.PAYMENTS_SMOKE_EMAIL?.trim() ||
  process.env.BOOKING_ORGANIZER_EMAIL?.trim() ||
  ""

if (!clientEmail) {
  console.error(
    "Set PAYMENTS_SMOKE_EMAIL or BOOKING_ORGANIZER_EMAIL for Resend-deliverable smoke.",
  )
  process.exit(1)
}

const res = await fetch(`${base}/api/admin/sessions`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    country: "CL",
    clientName: "Cliente Smoke Sesión",
    clientEmail,
  }),
})
const data = await res.json()
if (!res.ok) {
  console.error("✗ charge failed", data)
  process.exit(1)
}

console.log(`✓ invoice ${data.invoiceId} total=${data.total} ${data.currency}`)
console.log(`✓ preference ${data.preferenceId}`)
console.log(`✓ init_point ${data.init_point}`)
console.log(
  `✓ checkout email → ${clientEmail}: ${data.checkoutEmailSent ? "sent" : "FAILED"}`,
)
if (!data.checkoutEmailSent) process.exit(1)

const invRes = await fetch(`${base}/api/session-invoices/${data.invoiceId}`)
const inv = await invRes.json()
if (!invRes.ok || inv.status !== "pending") {
  console.error("✗ invoice lookup", inv)
  process.exit(1)
}
console.log(`✓ invoice status=${inv.status}`)

const paidRes = await fetch(
  `${base}/api/admin/sessions/${data.invoiceId}/mark-paid`,
  { method: "POST" },
)
const paid = await paidRes.json()
if (!paidRes.ok) {
  console.error("✗ mark-paid failed", paid)
  process.exit(1)
}
console.log(
  `✓ confirmation email: ${paid.confirmationSent ? "sent" : "skipped/failed"}`,
)
console.log(`✓ receipt email: ${paid.receiptSent ? "sent" : "skipped/failed"}`)
if (!paid.confirmationSent || !paid.receiptSent) process.exit(1)

console.log("\nAdmin UI: /admin/sesiones")
console.log(`Return page: ${base}/pago?status=success&invoice=${data.invoiceId}`)
