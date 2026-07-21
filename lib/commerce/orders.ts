import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"
import type { OrderRecord, OrderStatus } from "@/lib/commerce/types"

const DATA_DIR = path.join(process.cwd(), "data")
const ORDERS_FILE = path.join(DATA_DIR, "orders.json")

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(ORDERS_FILE)
  } catch {
    await fs.writeFile(ORDERS_FILE, "[]", "utf-8")
  }
}

export async function readOrders(): Promise<OrderRecord[]> {
  await ensureStore()
  const raw = await fs.readFile(ORDERS_FILE, "utf-8")
  return JSON.parse(raw) as OrderRecord[]
}

async function writeOrders(orders: OrderRecord[]) {
  await ensureStore()
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8")
}

export async function createOrder(
  input: Omit<OrderRecord, "id" | "createdAt" | "updatedAt" | "status"> & {
    status?: OrderStatus
  },
): Promise<OrderRecord> {
  const now = new Date().toISOString()
  const order: OrderRecord = {
    ...input,
    id: randomUUID(),
    status: input.status ?? "pending",
    createdAt: now,
    updatedAt: now,
  }
  const orders = await readOrders()
  orders.push(order)
  await writeOrders(orders)
  return order
}

export async function getOrderById(id: string): Promise<OrderRecord | null> {
  const orders = await readOrders()
  return orders.find((o) => o.id === id) ?? null
}

export async function getOrderByExternalReference(
  externalReference: string,
): Promise<OrderRecord | null> {
  const orders = await readOrders()
  return orders.find((o) => o.externalReference === externalReference) ?? null
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
  const orders = await readOrders()
  const idx = orders.findIndex((o) => o.id === id)
  if (idx < 0) return null
  const updated: OrderRecord = {
    ...orders[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  orders[idx] = updated
  await writeOrders(orders)
  return updated
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
