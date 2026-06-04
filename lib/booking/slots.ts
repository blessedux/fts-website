import { addDays, format, isBefore, parseISO, startOfDay } from "date-fns"
import { es } from "date-fns/locale"
import { BOOKING_CONFIG } from "@/lib/booking/config"
import type { BookingRecord, TimeSlot } from "@/lib/booking/types"

function pad(n: number) {
  return String(n).padStart(2, "0")
}

export function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let h = BOOKING_CONFIG.slotStartHour; h < BOOKING_CONFIG.slotEndHour; h++) {
    slots.push(`${pad(h)}:00`)
  }
  return slots
}

export function isBookableDate(date: Date, today = new Date()): boolean {
  const day = startOfDay(date)
  const min = startOfDay(addDays(today, BOOKING_CONFIG.minDaysAhead))
  const max = startOfDay(addDays(today, BOOKING_CONFIG.maxDaysAhead))

  if (isBefore(day, min) || isBefore(max, day)) return false
  const dow = day.getDay()
  if (dow === 0 || dow === 6) return false
  return BOOKING_CONFIG.workDays.includes(dow)
}

export function getSlotsForDate(
  dateStr: string,
  existingBookings: BookingRecord[]
): TimeSlot[] {
  const date = parseISO(dateStr)
  if (!isBookableDate(date)) {
    return generateTimeSlots().map((time) => ({ time, available: false }))
  }

  const taken = new Set(
    existingBookings.filter((b) => b.date === dateStr).map((b) => b.time)
  )

  return generateTimeSlots().map((time) => ({
    time,
    available: !taken.has(time),
  }))
}

export function formatBookingDateLabel(dateStr: string): string {
  return format(parseISO(dateStr), "EEEE d 'de' MMMM", { locale: es })
}
