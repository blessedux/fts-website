import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"
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

const DATA_DIR = path.join(process.cwd(), "data")
const FILE = path.join(DATA_DIR, "session-invoices.json")

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(FILE)
  } catch {
    await fs.writeFile(FILE, "[]", "utf-8")
  }
}

export async function readSessionInvoices(): Promise<SessionInvoice[]> {
  await ensureStore()
  const raw = await fs.readFile(FILE, "utf-8")
  return JSON.parse(raw) as SessionInvoice[]
}

async function writeSessionInvoices(rows: SessionInvoice[]) {
  await ensureStore()
  await fs.writeFile(FILE, JSON.stringify(rows, null, 2), "utf-8")
}

export async function createSessionInvoice(
  input: Omit<
    SessionInvoice,
    "id" | "createdAt" | "updatedAt" | "status" | "externalReference"
  > & { status?: SessionInvoiceStatus },
): Promise<SessionInvoice> {
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
  const rows = await readSessionInvoices()
  rows.push(row)
  await writeSessionInvoices(rows)
  return row
}

export async function getSessionInvoiceById(
  id: string,
): Promise<SessionInvoice | null> {
  const rows = await readSessionInvoices()
  return rows.find((r) => r.id === id) ?? null
}

export async function getSessionInvoiceByExternalReference(
  externalReference: string,
): Promise<SessionInvoice | null> {
  const rows = await readSessionInvoices()
  return rows.find((r) => r.externalReference === externalReference) ?? null
}

export async function updateSessionInvoice(
  id: string,
  patch: Partial<SessionInvoice>,
): Promise<SessionInvoice | null> {
  const rows = await readSessionInvoices()
  const idx = rows.findIndex((r) => r.id === id)
  if (idx < 0) return null
  const updated: SessionInvoice = {
    ...rows[idx],
    ...patch,
    id: rows[idx].id,
    updatedAt: new Date().toISOString(),
  }
  rows[idx] = updated
  await writeSessionInvoices(rows)
  return updated
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
