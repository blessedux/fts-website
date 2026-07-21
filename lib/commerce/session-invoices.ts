import { randomUUID } from "crypto"
import { getDb } from "@/lib/booking/db"
import {
  assertCommerceStoreAvailable,
  ensureCommerceSchema,
  useCommerceDb,
} from "@/lib/commerce/ensure-schema"
import {
  commerceDataPath,
  readJsonArray,
  writeJsonArray,
} from "@/lib/commerce/file-store"
import type { MpCountry } from "@/lib/payments/types"

export type SessionInvoiceStatus = "pending" | "paid" | "failed" | "cancelled"

export type SessionInvoice = {
  id: string
  externalReference: string
  bookingId?: string
  country: MpCountry
  status: SessionInvoiceStatus
  clientName: string
  clientEmail: string
  title: string
  unitPrice: number
  currency: "CLP" | "ARS"
  total: number
  mpPreferenceId?: string
  initPoint?: string
  mpPaymentId?: string
  paidAt?: string
  checkoutEmailSentAt?: string
  receiptEmailSentAt?: string
  createdAt: string
  updatedAt: string
}

const FILE = commerceDataPath("session-invoices.json")

type InvoiceRow = {
  id: string
  external_reference: string
  booking_id: string | null
  country: MpCountry
  status: SessionInvoiceStatus
  client_name: string
  client_email: string
  title: string
  unit_price: number
  currency: "CLP" | "ARS"
  total: number
  mp_preference_id: string | null
  init_point: string | null
  mp_payment_id: string | null
  paid_at: string | null
  checkout_email_sent_at: string | null
  receipt_email_sent_at: string | null
  created_at: string
  updated_at: string
}

function rowToInvoice(row: InvoiceRow): SessionInvoice {
  return {
    id: row.id,
    externalReference: row.external_reference,
    bookingId: row.booking_id ?? undefined,
    country: row.country,
    status: row.status,
    clientName: row.client_name,
    clientEmail: row.client_email,
    title: row.title,
    unitPrice: row.unit_price,
    currency: row.currency,
    total: row.total,
    mpPreferenceId: row.mp_preference_id ?? undefined,
    initPoint: row.init_point ?? undefined,
    mpPaymentId: row.mp_payment_id ?? undefined,
    paidAt: row.paid_at ?? undefined,
    checkoutEmailSentAt: row.checkout_email_sent_at ?? undefined,
    receiptEmailSentAt: row.receipt_email_sent_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function readSessionInvoices(): Promise<SessionInvoice[]> {
  assertCommerceStoreAvailable()
  if (!useCommerceDb()) return readJsonArray<SessionInvoice>(FILE)

  const sql = getDb()!
  await ensureCommerceSchema()
  const rows = await sql<InvoiceRow[]>`
    SELECT
      id::text AS id,
      external_reference,
      booking_id,
      country,
      status,
      client_name,
      client_email,
      title,
      unit_price,
      currency,
      total,
      mp_preference_id,
      init_point,
      mp_payment_id,
      paid_at::text AS paid_at,
      checkout_email_sent_at::text AS checkout_email_sent_at,
      receipt_email_sent_at::text AS receipt_email_sent_at,
      created_at::text AS created_at,
      updated_at::text AS updated_at
    FROM commerce_session_invoices
    ORDER BY created_at DESC
  `
  return rows.map(rowToInvoice)
}

export async function createSessionInvoice(
  input: Omit<
    SessionInvoice,
    "id" | "createdAt" | "updatedAt" | "status" | "externalReference"
  > & { status?: SessionInvoiceStatus },
): Promise<SessionInvoice> {
  assertCommerceStoreAvailable()
  const now = new Date().toISOString()
  const id = randomUUID()
  const row: SessionInvoice = {
    ...input,
    id,
    externalReference: id,
    status: input.status ?? "pending",
    createdAt: now,
    updatedAt: now,
  }

  if (!useCommerceDb()) {
    const rows = await readJsonArray<SessionInvoice>(FILE)
    rows.push(row)
    await writeJsonArray(FILE, rows)
    return row
  }

  const sql = getDb()!
  await ensureCommerceSchema()
  await sql`
    INSERT INTO commerce_session_invoices (
      id, external_reference, booking_id, country, status,
      client_name, client_email, title, unit_price, currency, total,
      mp_preference_id, init_point, mp_payment_id, paid_at,
      checkout_email_sent_at, receipt_email_sent_at, created_at, updated_at
    ) VALUES (
      ${row.id}::uuid,
      ${row.externalReference},
      ${row.bookingId ?? null},
      ${row.country},
      ${row.status},
      ${row.clientName},
      ${row.clientEmail},
      ${row.title},
      ${row.unitPrice},
      ${row.currency},
      ${row.total},
      ${row.mpPreferenceId ?? null},
      ${row.initPoint ?? null},
      ${row.mpPaymentId ?? null},
      ${row.paidAt ?? null},
      ${row.checkoutEmailSentAt ?? null},
      ${row.receiptEmailSentAt ?? null},
      ${row.createdAt}::timestamptz,
      ${row.updatedAt}::timestamptz
    )
  `
  return row
}

export async function getSessionInvoiceById(
  id: string,
): Promise<SessionInvoice | null> {
  assertCommerceStoreAvailable()
  if (!useCommerceDb()) {
    const rows = await readJsonArray<SessionInvoice>(FILE)
    return rows.find((r) => r.id === id) ?? null
  }

  const sql = getDb()!
  await ensureCommerceSchema()
  const rows = await sql<InvoiceRow[]>`
    SELECT
      id::text AS id,
      external_reference,
      booking_id,
      country,
      status,
      client_name,
      client_email,
      title,
      unit_price,
      currency,
      total,
      mp_preference_id,
      init_point,
      mp_payment_id,
      paid_at::text AS paid_at,
      checkout_email_sent_at::text AS checkout_email_sent_at,
      receipt_email_sent_at::text AS receipt_email_sent_at,
      created_at::text AS created_at,
      updated_at::text AS updated_at
    FROM commerce_session_invoices
    WHERE id = ${id}::uuid
    LIMIT 1
  `
  return rows[0] ? rowToInvoice(rows[0]) : null
}

export async function getSessionInvoiceByExternalReference(
  externalReference: string,
): Promise<SessionInvoice | null> {
  assertCommerceStoreAvailable()
  if (!useCommerceDb()) {
    const rows = await readJsonArray<SessionInvoice>(FILE)
    return rows.find((r) => r.externalReference === externalReference) ?? null
  }

  const sql = getDb()!
  await ensureCommerceSchema()
  const rows = await sql<InvoiceRow[]>`
    SELECT
      id::text AS id,
      external_reference,
      booking_id,
      country,
      status,
      client_name,
      client_email,
      title,
      unit_price,
      currency,
      total,
      mp_preference_id,
      init_point,
      mp_payment_id,
      paid_at::text AS paid_at,
      checkout_email_sent_at::text AS checkout_email_sent_at,
      receipt_email_sent_at::text AS receipt_email_sent_at,
      created_at::text AS created_at,
      updated_at::text AS updated_at
    FROM commerce_session_invoices
    WHERE external_reference = ${externalReference}
    LIMIT 1
  `
  return rows[0] ? rowToInvoice(rows[0]) : null
}

export async function updateSessionInvoice(
  id: string,
  patch: Partial<SessionInvoice>,
): Promise<SessionInvoice | null> {
  assertCommerceStoreAvailable()
  const updatedAt = new Date().toISOString()

  if (!useCommerceDb()) {
    const rows = await readJsonArray<SessionInvoice>(FILE)
    const idx = rows.findIndex((r) => r.id === id)
    if (idx < 0) return null
    const updated: SessionInvoice = {
      ...rows[idx],
      ...patch,
      id: rows[idx].id,
      updatedAt,
    }
    rows[idx] = updated
    await writeJsonArray(FILE, rows)
    return updated
  }

  const existing = await getSessionInvoiceById(id)
  if (!existing) return null
  const next: SessionInvoice = {
    ...existing,
    ...patch,
    id: existing.id,
    updatedAt,
  }

  const sql = getDb()!
  await ensureCommerceSchema()
  await sql`
    UPDATE commerce_session_invoices SET
      external_reference = ${next.externalReference},
      booking_id = ${next.bookingId ?? null},
      country = ${next.country},
      status = ${next.status},
      client_name = ${next.clientName},
      client_email = ${next.clientEmail},
      title = ${next.title},
      unit_price = ${next.unitPrice},
      currency = ${next.currency},
      total = ${next.total},
      mp_preference_id = ${next.mpPreferenceId ?? null},
      init_point = ${next.initPoint ?? null},
      mp_payment_id = ${next.mpPaymentId ?? null},
      paid_at = ${next.paidAt ?? null},
      checkout_email_sent_at = ${next.checkoutEmailSentAt ?? null},
      receipt_email_sent_at = ${next.receiptEmailSentAt ?? null},
      updated_at = ${updatedAt}::timestamptz
    WHERE id = ${id}::uuid
  `
  return next
}

export async function markSessionInvoicePaid(input: {
  invoiceId: string
  mpPaymentId: string
}): Promise<SessionInvoice | null> {
  const existing = await getSessionInvoiceById(input.invoiceId)
  if (!existing) return null
  if (existing.status === "paid") {
    return updateSessionInvoice(existing.id, {
      mpPaymentId: input.mpPaymentId,
    })
  }
  return updateSessionInvoice(existing.id, {
    status: "paid",
    mpPaymentId: input.mpPaymentId,
    paidAt: new Date().toISOString(),
  })
}
