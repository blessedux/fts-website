import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"
import type { BookingRecord, BookingRequest } from "@/lib/booking/types"
import { getSlotsForDate, isBookableDate } from "@/lib/booking/slots"
import { parseISO } from "date-fns"

const DATA_DIR = path.join(process.cwd(), "data")
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json")

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(BOOKINGS_FILE)
  } catch {
    await fs.writeFile(BOOKINGS_FILE, "[]", "utf-8")
  }
}

export async function readBookings(): Promise<BookingRecord[]> {
  await ensureStore()
  const raw = await fs.readFile(BOOKINGS_FILE, "utf-8")
  return JSON.parse(raw) as BookingRecord[]
}

export async function createBooking(
  request: BookingRequest
): Promise<{ ok: true; booking: BookingRecord } | { ok: false; error: string }> {
  const date = parseISO(request.date)
  if (!isBookableDate(date)) {
    return { ok: false, error: "La fecha seleccionada no está disponible." }
  }

  const bookings = await readBookings()
  const slots = getSlotsForDate(request.date, bookings)
  const slot = slots.find((s) => s.time === request.time)

  if (!slot?.available) {
    return { ok: false, error: "Ese horario ya no está disponible." }
  }

  const duplicate = bookings.some(
    (b) =>
      b.date === request.date &&
      b.time === request.time
  )
  if (duplicate) {
    return { ok: false, error: "Ese horario ya fue reservado." }
  }

  const booking: BookingRecord = {
    ...request,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  }

  bookings.push(booking)
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8")

  return { ok: true, booking }
}
