#!/usr/bin/env node
/**
 * Prepaid book checkout smoke (ticket #2) — CLP focus.
 *
 * Requires Next.js running with .env.local loaded:
 *   npm run dev -- --port 3002
 *   npm run payments:checkout-smoke
 */

import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

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

const base = (
  process.env.PAYMENTS_SMOKE_BASE_URL ||
  process.env.BOOKING_PUBLIC_BASE_URL ||
  "http://127.0.0.1:3002"
).replace(/\/$/, "")

console.log("Book checkout smoke (CL)")
console.log(`Base URL: ${base}\n`)

const quoteRes = await fetch(`${base}/api/checkout?country=CL`)
const quote = await quoteRes.json()
if (!quoteRes.ok) {
  console.error("✗ catalog quote failed", quote)
  process.exit(1)
}
console.log(
  `✓ catalog: ${quote.product.name} @ ${quote.product.unitPrice} (${quote.product.country})`,
)

const checkoutRes = await fetch(`${base}/api/checkout`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    country: "CL",
    quantity: 1,
    buyer: {
      name: "Smoke Tester",
      email: "smoke@example.com",
      phone: "+56912345678",
      address: "Calle Falsa 123",
      region: "Metropolitana",
      comuna: "Santiago",
    },
  }),
})
const checkout = await checkoutRes.json()
if (!checkoutRes.ok) {
  console.error("✗ checkout failed", checkout)
  process.exit(1)
}
console.log(
  `✓ order ${checkout.orderId} total=${checkout.total} ${checkout.currency}`,
)
console.log(`✓ preference ${checkout.preferenceId}`)
console.log(`✓ init_point ${checkout.init_point}`)
if (checkout.sandbox_init_point) {
  console.log(`  (sandbox_init_point kept for reference; prefer init_point with TEST tokens)`)
}

const orderRes = await fetch(`${base}/api/orders/${checkout.orderId}`)
const order = await orderRes.json()
if (!orderRes.ok || order.status !== "pending") {
  console.error("✗ order lookup failed", order)
  process.exit(1)
}
console.log(`✓ order status=${order.status} (pending until real MP payment webhook)`)

console.log("\nOpen the sandbox_init_point in a browser to pay with MP test cards.")
console.log("After payment, webhook should mark the order paid.")
