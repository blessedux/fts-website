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
import type { OrderBuyer, OrderLineItem, OrderRecord, OrderStatus } from "@/lib/commerce/types"

const ORDERS_FILE = commerceDataPath("orders.json")

type OrderRow = {
  id: string
  external_reference: string
  country: OrderRecord["country"]
  status: OrderStatus
  items: OrderLineItem[]
  total: number
  buyer: OrderBuyer
  mp_preference_id: string | null
  mp_payment_id: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
}

function rowToOrder(row: OrderRow): OrderRecord {
  return {
    id: row.id,
    externalReference: row.external_reference,
    country: row.country,
    status: row.status,
    items: row.items,
    total: row.total,
    buyer: row.buyer,
    mpPreferenceId: row.mp_preference_id ?? undefined,
    mpPaymentId: row.mp_payment_id ?? undefined,
    paidAt: row.paid_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

async function readOrdersFile(): Promise<OrderRecord[]> {
  return readJsonArray<OrderRecord>(ORDERS_FILE)
}

async function writeOrdersFile(orders: OrderRecord[]) {
  await writeJsonArray(ORDERS_FILE, orders)
}

export async function readOrders(): Promise<OrderRecord[]> {
  assertCommerceStoreAvailable()
  if (!useCommerceDb()) return readOrdersFile()

  const sql = getDb()!
  await ensureCommerceSchema()
  const rows = await sql<OrderRow[]>`
    SELECT
      id::text AS id,
      external_reference,
      country,
      status,
      items,
      total,
      buyer,
      mp_preference_id,
      mp_payment_id,
      paid_at::text AS paid_at,
      created_at::text AS created_at,
      updated_at::text AS updated_at
    FROM commerce_orders
    ORDER BY created_at ASC
  `
  return rows.map(rowToOrder)
}

export async function createOrder(
  input: Omit<OrderRecord, "id" | "createdAt" | "updatedAt" | "status"> & {
    status?: OrderStatus
  },
): Promise<OrderRecord> {
  assertCommerceStoreAvailable()
  const now = new Date().toISOString()
  const id = randomUUID()
  const order: OrderRecord = {
    ...input,
    id,
    // Avoid a shared "pending" external_reference (unique in Postgres).
    externalReference:
      !input.externalReference || input.externalReference === "pending"
        ? id
        : input.externalReference,
    status: input.status ?? "pending",
    createdAt: now,
    updatedAt: now,
  }

  if (!useCommerceDb()) {
    const orders = await readOrdersFile()
    orders.push(order)
    await writeOrdersFile(orders)
    return order
  }

  const sql = getDb()!
  await ensureCommerceSchema()
  await sql`
    INSERT INTO commerce_orders (
      id, external_reference, country, status, items, total, buyer,
      mp_preference_id, mp_payment_id, paid_at, created_at, updated_at
    ) VALUES (
      ${order.id}::uuid,
      ${order.externalReference},
      ${order.country},
      ${order.status},
      ${sql.json(order.items)},
      ${order.total},
      ${sql.json(order.buyer)},
      ${order.mpPreferenceId ?? null},
      ${order.mpPaymentId ?? null},
      ${order.paidAt ?? null},
      ${order.createdAt}::timestamptz,
      ${order.updatedAt}::timestamptz
    )
  `
  return order
}

export async function getOrderById(id: string): Promise<OrderRecord | null> {
  assertCommerceStoreAvailable()
  if (!useCommerceDb()) {
    const orders = await readOrdersFile()
    return orders.find((o) => o.id === id) ?? null
  }

  const sql = getDb()!
  await ensureCommerceSchema()
  const rows = await sql<OrderRow[]>`
    SELECT
      id::text AS id,
      external_reference,
      country,
      status,
      items,
      total,
      buyer,
      mp_preference_id,
      mp_payment_id,
      paid_at::text AS paid_at,
      created_at::text AS created_at,
      updated_at::text AS updated_at
    FROM commerce_orders
    WHERE id = ${id}::uuid
    LIMIT 1
  `
  return rows[0] ? rowToOrder(rows[0]) : null
}

export async function getOrderByExternalReference(
  externalReference: string,
): Promise<OrderRecord | null> {
  assertCommerceStoreAvailable()
  if (!useCommerceDb()) {
    const orders = await readOrdersFile()
    return orders.find((o) => o.externalReference === externalReference) ?? null
  }

  const sql = getDb()!
  await ensureCommerceSchema()
  const rows = await sql<OrderRow[]>`
    SELECT
      id::text AS id,
      external_reference,
      country,
      status,
      items,
      total,
      buyer,
      mp_preference_id,
      mp_payment_id,
      paid_at::text AS paid_at,
      created_at::text AS created_at,
      updated_at::text AS updated_at
    FROM commerce_orders
    WHERE external_reference = ${externalReference}
    LIMIT 1
  `
  return rows[0] ? rowToOrder(rows[0]) : null
}

export async function updateOrder(
  id: string,
  patch: Partial<
    Pick<
      OrderRecord,
      | "status"
      | "externalReference"
      | "mpPreferenceId"
      | "mpPaymentId"
      | "paidAt"
      | "updatedAt"
    >
  >,
): Promise<OrderRecord | null> {
  assertCommerceStoreAvailable()
  const updatedAt = new Date().toISOString()

  if (!useCommerceDb()) {
    const orders = await readOrdersFile()
    const idx = orders.findIndex((o) => o.id === id)
    if (idx < 0) return null
    const updated: OrderRecord = {
      ...orders[idx],
      ...patch,
      updatedAt,
    }
    orders[idx] = updated
    await writeOrdersFile(orders)
    return updated
  }

  const existing = await getOrderById(id)
  if (!existing) return null

  const next: OrderRecord = {
    ...existing,
    ...patch,
    updatedAt,
  }

  const sql = getDb()!
  await ensureCommerceSchema()
  await sql`
    UPDATE commerce_orders SET
      external_reference = ${next.externalReference},
      status = ${next.status},
      mp_preference_id = ${next.mpPreferenceId ?? null},
      mp_payment_id = ${next.mpPaymentId ?? null},
      paid_at = ${next.paidAt ?? null},
      updated_at = ${updatedAt}::timestamptz
    WHERE id = ${id}::uuid
  `
  return next
}

export async function markOrderPaid(input: {
  orderId: string
  mpPaymentId: string
}): Promise<OrderRecord | null> {
  const existing = await getOrderById(input.orderId)
  if (!existing) return null
  if (existing.status === "paid") {
    return updateOrder(existing.id, { mpPaymentId: input.mpPaymentId })
  }
  return updateOrder(existing.id, {
    status: "paid",
    mpPaymentId: input.mpPaymentId,
    paidAt: new Date().toISOString(),
  })
}
