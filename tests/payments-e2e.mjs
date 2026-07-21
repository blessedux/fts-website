#!/usr/bin/env node
/**
 * Commerce payments e2e (ticket #4)
 *
 * Covers API + webhook state machine against a running Next server.
 * Full browser Checkout Pro card UI is NOT automated here — MP sandbox
 * card-form/association is unreliable; see comments at bottom.
 *
 * Prerequisites:
 *   npm run dev -- --port 3002
 *   .env.local with MP_ACCESS_TOKEN_CL + MP_WEBHOOK_SECRET_CL
 *   Optional: MP_ACCESS_TOKEN_AR + MP_WEBHOOK_SECRET_AR for AR book path
 *   Optional: RESEND_* for session email assertions (soft)
 *
 * Run:
 *   npm run test:payments
 *
 * CI: start Next, then run this script. Exit 0 = green.
 */

import { createHmac } from "node:crypto"
import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import { describe, it, before } from "node:test"
import assert from "node:assert/strict"

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

function tokenFor(country) {
  return (
    process.env[`MP_ACCESS_TOKEN_${country}`]?.trim() ||
    process.env.MP_ACCESS_TOKEN?.trim() ||
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

async function postJson(path, body) {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  return { res, data }
}

async function getJson(path) {
  const res = await fetch(`${base}${path}`)
  const data = await res.json().catch(() => ({}))
  return { res, data }
}

before(async () => {
  let ok = false
  try {
    const r = await fetch(`${base}/api/payments/webhook?country=CL`)
    ok = r.ok
  } catch {
    ok = false
  }
  if (!ok) {
    throw new Error(
      `Server not reachable at ${base}. Start with: npm run dev -- --port 3002`,
    )
  }
})

describe("payments e2e — CL book happy path", () => {
  it("creates prepaid preference and can mark order paid", async (t) => {
    if (!tokenFor("CL")) {
      t.skip("MP_ACCESS_TOKEN_CL not set")
      return
    }

    const { res, data } = await postJson("/api/checkout", {
      country: "CL",
      quantity: 1,
      buyer: {
        name: "E2E Book CL",
        email: "e2e-book-cl@testmail.local",
        phone: "+56911111111",
        address: "Calle E2E 1",
        region: "Metropolitana",
        comuna: "Santiago",
      },
    })
    assert.equal(res.status, 201, JSON.stringify(data))
    assert.ok(data.orderId)
    assert.ok(data.init_point || data.sandbox_init_point)
    assert.equal(data.currency, "CLP")
    assert.equal(data.total, 24990)

    const pending = await getJson(`/api/orders/${data.orderId}`)
    assert.equal(pending.res.status, 200)
    assert.equal(pending.data.status, "pending")

    // Happy path without browser: local mark-paid equivalent for books
    const sim = await import("node:child_process").then((cp) =>
      cp.spawnSync(
        "node",
        ["scripts/mp-simulate-paid.mjs", data.orderId],
        { encoding: "utf8", cwd: process.cwd() },
      ),
    )
    assert.equal(sim.status, 0, sim.stderr || sim.stdout)

    const paid = await getJson(`/api/orders/${data.orderId}`)
    assert.equal(paid.data.status, "paid")
  })
})

describe("payments e2e — AR book happy path", () => {
  it("creates prepaid preference in ARS when AR token is configured", async (t) => {
    if (!tokenFor("AR")) {
      t.skip(
        "MP_ACCESS_TOKEN_AR not set — AR book path deferred until AR credentials exist",
      )
      return
    }

    const { res, data } = await postJson("/api/checkout", {
      country: "AR",
      quantity: 1,
      buyer: {
        name: "E2E Book AR",
        email: "e2e-book-ar@testmail.local",
        phone: "+541111111111",
        address: "Calle E2E 2",
        region: "CABA",
        comuna: "Palermo",
      },
    })
    assert.equal(res.status, 201, JSON.stringify(data))
    assert.ok(data.orderId)
    assert.equal(data.currency, "ARS")
    assert.equal(data.total, 25000)
    assert.ok(data.init_point || data.sandbox_init_point)

    const pending = await getJson(`/api/orders/${data.orderId}`)
    assert.equal(pending.data.status, "pending")

    const sim = await import("node:child_process").then((cp) =>
      cp.spawnSync(
        "node",
        ["scripts/mp-simulate-paid.mjs", data.orderId],
        { encoding: "utf8", cwd: process.cwd() },
      ),
    )
    assert.equal(sim.status, 0, sim.stderr || sim.stdout)

    const paid = await getJson(`/api/orders/${data.orderId}`)
    assert.equal(paid.data.status, "paid")
  })
})

describe("payments e2e — session pay-after happy path", () => {
  it("creates session invoice + preference and marks paid", async (t) => {
    if (!tokenFor("CL")) {
      t.skip("MP_ACCESS_TOKEN_CL not set")
      return
    }

    const { res, data } = await postJson("/api/admin/sessions", {
      country: "CL",
      clientName: "E2E Session Client",
      clientEmail:
        process.env.PAYMENTS_SMOKE_EMAIL?.trim() ||
        process.env.BOOKING_ORGANIZER_EMAIL?.trim() ||
        "e2e-session@testmail.local",
    })
    assert.equal(res.status, 201, JSON.stringify(data))
    assert.ok(data.invoiceId)
    assert.equal(data.total, 45000)
    assert.equal(data.currency, "CLP")
    assert.ok(data.init_point)

    const pending = await getJson(`/api/session-invoices/${data.invoiceId}`)
    assert.equal(pending.data.status, "pending")

    const { res: paidRes, data: paidBody } = await postJson(
      `/api/admin/sessions/${data.invoiceId}/mark-paid`,
      {},
    )
    assert.equal(paidRes.status, 200, JSON.stringify(paidBody))
    assert.equal(paidBody.status, "paid")

    const paid = await getJson(`/api/session-invoices/${data.invoiceId}`)
    assert.equal(paid.data.status, "paid")
  })
})

describe("payments e2e — failure path does not mark paid", () => {
  it("invalid webhook signature leaves order pending", async (t) => {
    if (!tokenFor("CL") || !secretFor("CL")) {
      t.skip("CL MP token/secret required")
      return
    }

    const { res, data } = await postJson("/api/checkout", {
      country: "CL",
      quantity: 1,
      buyer: {
        name: "E2E Fail Path",
        email: "e2e-fail@testmail.local",
        phone: "+56922222222",
        address: "Calle Fail 1",
        region: "Metropolitana",
        comuna: "Santiago",
      },
    })
    assert.equal(res.status, 201, JSON.stringify(data))
    const orderId = data.orderId

    const bad = await fetch(
      `${base}/api/payments/webhook?country=CL&data.id=fake-pay-1`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-signature": "ts=1,v1=deadbeef",
          "x-request-id": "e2e-bad-sig",
        },
        body: JSON.stringify({
          type: "payment",
          action: "payment.updated",
          data: { id: "fake-pay-1" },
        }),
      },
    )
    assert.equal(bad.status, 401)

    const still = await getJson(`/api/orders/${orderId}`)
    assert.equal(still.data.status, "pending")
  })

  it("signed webhook with unknown payment id does not mark paid", async (t) => {
    if (!tokenFor("CL") || !secretFor("CL")) {
      t.skip("CL MP token/secret required")
      return
    }

    const { res, data } = await postJson("/api/checkout", {
      country: "CL",
      quantity: 1,
      buyer: {
        name: "E2E Unknown Pay",
        email: "e2e-unknown@testmail.local",
        phone: "+56933333333",
        address: "Calle Unknown 1",
        region: "Metropolitana",
        comuna: "Santiago",
      },
    })
    assert.equal(res.status, 201, JSON.stringify(data))
    const orderId = data.orderId

    const dataId = `unknown-pay-${Date.now()}`
    const requestId = `e2e-req-${Date.now()}`
    const ts = String(Date.now())
    const xSignature = signWebhook({
      secret: secretFor("CL"),
      dataId,
      requestId,
      ts,
    })

    const wh = await fetch(
      `${base}/api/payments/webhook?country=CL&data.id=${encodeURIComponent(dataId)}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-signature": xSignature,
          "x-request-id": requestId,
        },
        body: JSON.stringify({
          type: "payment",
          action: "payment.updated",
          live_mode: false,
          data: { id: dataId },
        }),
      },
    )
    assert.equal(wh.status, 200)
    const body = await wh.json()
    assert.equal(body.orderId, null)

    const still = await getJson(`/api/orders/${orderId}`)
    assert.equal(still.data.status, "pending")
  })
})

describe("payments e2e — offline webhook signature unit", () => {
  it("accepts valid HMAC and rejects forged", async () => {
    const { WebhookSignatureValidator } = await import("mercadopago")
    const secret = "e2e-selftest-secret"
    const dataId = "42"
    const requestId = "req-e2e"
    const ts = String(Date.now())
    const xSignature = signWebhook({ secret, dataId, requestId, ts })

    WebhookSignatureValidator.validate({
      xSignature,
      xRequestId: requestId,
      dataId,
      secret,
      toleranceSeconds: 300,
    })

    assert.throws(() => {
      WebhookSignatureValidator.validate({
        xSignature: `ts=${ts},v1=${"ab".repeat(32)}`,
        xRequestId: requestId,
        dataId,
        secret,
        toleranceSeconds: 300,
      })
    })
  })
})

/*
 * Local / CI procedure
 * --------------------
 * 1. Copy .env.example → .env.local; fill MP_*_CL (and AR when ready).
 * 2. npm run dev -- --port 3002
 * 3. npm run test:payments
 * 4. Optional: npm run payments:webhook-selftest
 *
 * Browser Checkout Pro card payment is manually verified in prod / when
 * MP sandbox card-form/association stops 404'ing. These e2e tests cover
 * preference creation, order/invoice state, webhook auth, and paid/not-paid.
 */
