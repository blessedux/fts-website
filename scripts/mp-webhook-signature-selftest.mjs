#!/usr/bin/env node
/**
 * Offline webhook signature self-test (no Mercado Pago network calls).
 * Exercises the same HMAC manifest the Next.js webhook route validates.
 *
 *   npm run payments:webhook-selftest
 */

import { createHmac } from "node:crypto"
import { WebhookSignatureValidator } from "mercadopago"

const secret = "test-webhook-secret-fts"
const dataId = "1234567890"
const requestId = "req-abc-123"
const ts = String(Date.now())
const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`
const v1 = createHmac("sha256", secret).update(manifest).digest("hex")
const xSignature = `ts=${ts},v1=${v1}`

try {
  WebhookSignatureValidator.validate({
    xSignature,
    xRequestId: requestId,
    dataId,
    secret,
    toleranceSeconds: 300,
  })
  console.log("✓ valid signature accepted")
} catch (err) {
  console.error("✗ expected valid signature to pass:", err)
  process.exit(1)
}

try {
  WebhookSignatureValidator.validate({
    xSignature: `ts=${ts},v1=${"0".repeat(64)}`,
    xRequestId: requestId,
    dataId,
    secret,
    toleranceSeconds: 300,
  })
  console.error("✗ forged signature should have been rejected")
  process.exit(1)
} catch {
  console.log("✓ forged signature rejected")
}

console.log("Webhook signature self-test OK")
