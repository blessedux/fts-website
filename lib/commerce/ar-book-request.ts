import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"
import { getBookProduct, getBookUnitPrice } from "@/lib/commerce/catalog"
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

const DATA_DIR = path.join(process.cwd(), "data")
const FILE = path.join(DATA_DIR, "ar-book-requests.json")

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(FILE)
  } catch {
    await fs.writeFile(FILE, "[]", "utf-8")
  }
}

export async function createArBookRequest(input: {
  quantity: number
  buyer: OrderBuyer
}): Promise<ArBookRequest> {
  await ensureStore()
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
  const raw = await fs.readFile(FILE, "utf-8")
  const rows = JSON.parse(raw) as ArBookRequest[]
  rows.push(row)
  await fs.writeFile(FILE, JSON.stringify(rows, null, 2), "utf-8")
  return row
}

export async function markArBookRequestAdminEmailed(
  id: string,
): Promise<void> {
  await ensureStore()
  const raw = await fs.readFile(FILE, "utf-8")
  const rows = JSON.parse(raw) as ArBookRequest[]
  const idx = rows.findIndex((r) => r.id === id)
  if (idx < 0) return
  rows[idx] = {
    ...rows[idx],
    adminEmailSentAt: new Date().toISOString(),
  }
  await fs.writeFile(FILE, JSON.stringify(rows, null, 2), "utf-8")
}
