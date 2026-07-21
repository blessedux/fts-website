#!/usr/bin/env node
/**
 * Mark a local book order as paid (ticket #2 unblock when Checkout Pro UI is broken).
 *
 * Usage:
 *   npm run payments:simulate-paid -- <orderId>
 *   npm run payments:simulate-paid -- <orderId> --via-webhook
 *
 * --via-webhook posts a signed fake payment notification to the local webhook
 * (requires MP_WEBHOOK_SECRET_CL + next dev). Without the flag, updates orders.json directly.
 */

import { createHmac } from "node:crypto"
import { readFileSync, writeFileSync, existsSync } from "node:fs"
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

const viaWebhook = process.argv.includes("--via-webhook")
const base = (
  process.env.PAYMENTS_SMOKE_BASE_URL ||
  process.env.BOOKING_PUBLIC_BASE_URL ||
  "http://127.0.0.1:3002"
).replace(/\/$/, "")

const args = process.argv.slice(2).filter((a) => a !== "--via-webhook")
const id = args[0]

if (!id) {
  console.error("Usage: npm run payments:simulate-paid -- <orderId> [--via-webhook]")
  process.exit(1)
}

const ordersPath = resolve(process.cwd(), "data/orders.json")
const invoicesPath = resolve(process.cwd(), "data/session-invoices.json")
const orders = existsSync(ordersPath)
  ? JSON.parse(readFileSync(ordersPath, "utf8"))
  : []
const invoices = existsSync(invoicesPath)
  ? JSON.parse(readFileSync(invoicesPath, "utf8"))
  : []
const order = orders.find((o) => o.id === id)
const invoice = invoices.find((o) => o.id === id)
if (!order && !invoice) {
  console.error(`Order/invoice not found: ${id}`)
  process.exit(1)
}

const fakePaymentId = `sim-${Date.now()}`
const kind = order ? "order" : "invoice"
const row = order || invoice
const filePath = order ? ordersPath : invoicesPath
const list = order ? orders : invoices

if (!viaWebhook) {
  const now = new Date().toISOString()
  const idx = list.findIndex((o) => o.id === id)
  list[idx] = {
    ...row,
    status: "paid",
    mpPaymentId: fakePaymentId,
    paidAt: now,
    updatedAt: now,
  }
  writeFileSync(filePath, JSON.stringify(list, null, 2), "utf-8")
  console.log(`✓ ${kind} ${id} marked paid (direct) paymentId=${fakePaymentId}`)
  console.log(
    `  GET ${base}/api/${order ? "orders" : "session-invoices"}/${id}`,
  )
  process.exit(0)
}

const country = row.country || "CL"
const secret =
  process.env[`MP_WEBHOOK_SECRET_${country}`]?.trim() ||
  process.env.MP_WEBHOOK_SECRET?.trim()
if (!secret) {
  console.error(`Missing MP_WEBHOOK_SECRET_${country}`)
  process.exit(1)
}

// Patch order external_reference already = id; webhook will try Payment.get and fail —
// so for --via-webhook we still need a direct mark after a signed ACK, OR we expose
// a test-only path. Keep signed POST as smoke that signature works, then mark paid.
const dataId = fakePaymentId
const requestId = `sim-req-${Date.now()}`
const ts = String(Date.now())
const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`
const v1 = createHmac("sha256", secret).update(manifest).digest("hex")
const xSignature = `ts=${ts},v1=${v1}`
const url = `${base}/api/payments/webhook?country=${country}&data.id=${encodeURIComponent(dataId)}`

const res = await fetch(url, {
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
const text = await res.text()
console.log(`webhook POST ${res.status}: ${text}`)

// Payment.get will fail for fake id — mark paid locally to complete the path.
const fresh = JSON.parse(readFileSync(filePath, "utf8"))
const i = fresh.findIndex((o) => o.id === id)
const now = new Date().toISOString()
fresh[i] = {
  ...fresh[i],
  status: "paid",
  mpPaymentId: fakePaymentId,
  paidAt: now,
  updatedAt: now,
}
writeFileSync(filePath, JSON.stringify(fresh, null, 2), "utf-8")
console.log(`✓ ${kind} ${id} marked paid after signed webhook ACK`)
