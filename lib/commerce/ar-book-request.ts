import { randomUUID } from "crypto"
import { getDb } from "@/lib/booking/db"
import { getBookProduct, getBookUnitPrice } from "@/lib/commerce/catalog"
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
import type { OrderBuyer } from "@/lib/commerce/types"

export type ArBookRequest = {
  id: string
  status: "pending_contact"
  country: "AR"
  quantity: number
  unitPrice: number
  total: number
  currency: "ARS"
  buyer: OrderBuyer
  productName: string
  createdAt: string
  adminEmailSentAt?: string
}

const FILE = commerceDataPath("ar-book-requests.json")

export async function createArBookRequest(input: {
  quantity: number
  buyer: OrderBuyer
}): Promise<ArBookRequest> {
  assertCommerceStoreAvailable()
  const quantity = Math.max(1, Math.min(20, Math.floor(input.quantity)))
  const product = getBookProduct()
  const unitPrice = getBookUnitPrice("AR")
  const row: ArBookRequest = {
    id: randomUUID(),
    status: "pending_contact",
    country: "AR",
    quantity,
    unitPrice,
    total: unitPrice * quantity,
    currency: "ARS",
    buyer: input.buyer,
    productName: product.name,
    createdAt: new Date().toISOString(),
  }

  if (!useCommerceDb()) {
    const rows = await readJsonArray<ArBookRequest>(FILE)
    rows.push(row)
    await writeJsonArray(FILE, rows)
    return row
  }

  const sql = getDb()!
  await ensureCommerceSchema()
  await sql`
    INSERT INTO commerce_ar_book_requests (
      id, status, country, quantity, unit_price, total, currency,
      buyer, product_name, created_at, admin_email_sent_at
    ) VALUES (
      ${row.id}::uuid,
      ${row.status},
      ${row.country},
      ${row.quantity},
      ${row.unitPrice},
      ${row.total},
      ${row.currency},
      ${sql.json(row.buyer)},
      ${row.productName},
      ${row.createdAt}::timestamptz,
      NULL
    )
  `
  return row
}

export async function markArBookRequestAdminEmailed(
  id: string,
): Promise<void> {
  assertCommerceStoreAvailable()
  const sentAt = new Date().toISOString()

  if (!useCommerceDb()) {
    const rows = await readJsonArray<ArBookRequest>(FILE)
    const idx = rows.findIndex((r) => r.id === id)
    if (idx < 0) return
    rows[idx] = { ...rows[idx], adminEmailSentAt: sentAt }
    await writeJsonArray(FILE, rows)
    return
  }

  const sql = getDb()!
  await ensureCommerceSchema()
  await sql`
    UPDATE commerce_ar_book_requests
    SET admin_email_sent_at = ${sentAt}::timestamptz
    WHERE id = ${id}::uuid
  `
}
