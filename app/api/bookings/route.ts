import { NextResponse } from "next/server"
import { z } from "zod"
import { createBooking, readBookings } from "@/lib/booking/store"
import { getSlotsForDate } from "@/lib/booking/slots"

const bookingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(8).max(30),
  modality: z.enum(["presencial", "online"]),
  notes: z.string().max(500).optional(),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Parámetro date requerido (YYYY-MM-DD)" }, { status: 400 })
  }

  const bookings = await readBookings()
  const slots = getSlotsForDate(date, bookings)
  return NextResponse.json({ date, slots })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = bookingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const result = await createBooking(parsed.data)

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 409 })
    }

    return NextResponse.json({ booking: result.booking }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Error al procesar la reserva" }, { status: 500 })
  }
}
