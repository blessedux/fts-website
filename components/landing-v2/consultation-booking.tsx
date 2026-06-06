"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { es } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"
import { cn } from "@/lib/utils"
import { isBookableDate, formatBookingDateLabel } from "@/lib/booking/slots"
import type { ConsultationModality } from "@/lib/booking/types"

type Step = "date" | "time" | "details" | "done"

type AvailabilityResponse = {
  source: string
  availableSlotsByDate: Record<string, string[]>
  timezone: string
  databaseConfigured: boolean
}

type BookSuccess = {
  ok: true
  bookingId?: string
  status?: "pending" | "confirmed"
  guestEmailSent?: boolean
}

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

function ymdFromDate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function monthRange(d: Date): { from: string; to: string } {
  const first = startOfMonth(d)
  const last = endOfMonth(d)
  return { from: ymdFromDate(first), to: ymdFromDate(last) }
}

export function ConsultationBooking() {
  const [step, setStep] = useState<Step>("date")
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null)
  const [loadingAvail, setLoadingAvail] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookSuccess, setBookSuccess] = useState<BookSuccess | null>(null)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [modality, setModality] = useState<ConsultationModality>("online")
  const [notes, setNotes] = useState("")

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const dateStr = selectedDate ? ymdFromDate(selectedDate) : null

  const fetchAvailability = useCallback(async (month: Date) => {
    const { from, to } = monthRange(month)
    setLoadingAvail(true)
    try {
      const res = await fetch(
        `/api/booking-availability?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
        { cache: "no-store" },
      )
      if (!res.ok) throw new Error("No se pudo cargar la disponibilidad")
      const data: AvailabilityResponse = await res.json()
      setAvailability(data)
    } catch (e) {
      console.error("[ConsultationBooking] availability fetch:", e)
    } finally {
      setLoadingAvail(false)
    }
  }, [])

  // Fetch on mount and whenever the visible month changes
  useEffect(() => {
    fetchAvailability(currentMonth)
  }, [currentMonth, fetchAvailability])

  // 60-second poll + refetch on focus/visibility so slot list stays current
  useEffect(() => {
    const refetch = () => fetchAvailability(currentMonth)
    pollRef.current = setInterval(refetch, 60_000)
    window.addEventListener("focus", refetch)
    document.addEventListener("visibilitychange", refetch)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      window.removeEventListener("focus", refetch)
      document.removeEventListener("visibilitychange", refetch)
    }
  }, [currentMonth, fetchAvailability])

  // Refetch when a booking is completed so picker reflects the now-taken slot
  useEffect(() => {
    function onBookingChanged() {
      fetchAvailability(currentMonth)
    }
    window.addEventListener("fts-bookings-changed", onBookingChanged)
    return () => window.removeEventListener("fts-bookings-changed", onBookingChanged)
  }, [currentMonth, fetchAvailability])

  const availableSlots: string[] = dateStr
    ? (availability?.availableSlotsByDate[dateStr] ?? [])
    : []

  /** A date is selectable when it has at least one available slot in the fetched month. */
  function isDayDisabled(date: Date): boolean {
    if (!isBookableDate(date)) return true
    if (!availability) return false // optimistic while loading
    const ymd = ymdFromDate(date)
    const slots = availability.availableSlotsByDate[ymd]
    return !slots || slots.length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!dateStr || !selectedTime) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/book-consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateStr,
          time: selectedTime,
          name,
          email,
          phone,
          modality,
          notes: notes || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "No se pudo completar la reserva")
      setBookSuccess(data as BookSuccess)
      setStep("done")
      window.dispatchEvent(new CustomEvent("fts-bookings-changed"))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al reservar")
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setStep("date")
    setSelectedDate(undefined)
    setSelectedTime(null)
    setName("")
    setEmail("")
    setPhone("")
    setNotes("")
    setError(null)
    setBookSuccess(null)
  }

  if (step === "done" && dateStr && selectedTime) {
    return (
      <div className="lv2-booking-panel text-center">
        <p className="lv2-section-label mb-3">Solicitud enviada</p>
        <h3 className="lv2-display text-2xl text-[var(--lv2-ivory)] mb-4">
          Hemos recibido tu solicitud
        </h3>
        <p className="lv2-body text-base mb-6">
          {formatBookingDateLabel(dateStr)} · {selectedTime}
          <br />
          {modality === "online" ? "Consulta online" : "Consulta presencial"}
        </p>
        <p className="lv2-body text-sm mb-8">
          {bookSuccess?.guestEmailSent ? (
            <>
              Te enviamos un correo a{" "}
              <span className="text-[var(--lv2-taupe)]">{email}</span> confirmando
              que recibimos tu solicitud. Te avisaremos cuando quede confirmada la
              cita.
            </>
          ) : (
            <>
              Tu solicitud fue registrada. Te contactaremos por correo cuando
              quede confirmada la cita.
            </>
          )}
        </p>

        <button type="button" onClick={reset} className="lv2-btn-outline">
          Reservar otra fecha
        </button>
      </div>
    )
  }

  return (
    <div className="lv2-booking-panel">
      {step === "date" && (
        <div>
          <p className="lv2-section-label mb-4 text-center">Paso 1 — Elige una fecha</p>
          {loadingAvail && !availability && (
            <p className="lv2-body text-center text-sm mb-4 opacity-60">Cargando disponibilidad…</p>
          )}
          <DayPicker
            mode="single"
            selected={selectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            onSelect={(d) => {
              setSelectedDate(d)
              setSelectedTime(null)
              if (d) setStep("time")
            }}
            locale={es}
            disabled={isDayDisabled}
            className="lv2-day-picker mx-auto"
            modifiersClassNames={{
              selected: "lv2-day-selected",
              today: "lv2-day-today",
              disabled: "lv2-day-disabled",
            }}
          />
        </div>
      )}

      {step === "time" && dateStr && (
        <div>
          <button
            type="button"
            onClick={() => setStep("date")}
            className="lv2-body mb-4 text-sm text-[var(--lv2-taupe)] hover:text-[var(--lv2-ivory)]"
          >
            ← Cambiar fecha
          </button>
          <p className="lv2-section-label mb-2">Paso 2 — Horario</p>
          <p className="lv2-display text-xl text-[var(--lv2-ivory)] mb-6 capitalize">
            {formatBookingDateLabel(dateStr)}
          </p>
          {availableSlots.length === 0 ? (
            <p className="lv2-body text-center py-8 text-sm">
              No hay horarios disponibles este día. Elige otra fecha.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {availableSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => {
                    setSelectedTime(time)
                    setStep("details")
                  }}
                  className={cn(
                    "lv2-slot-btn",
                    selectedTime === time && "lv2-slot-btn--active"
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === "details" && dateStr && selectedTime && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <button
            type="button"
            onClick={() => setStep("time")}
            className="lv2-body text-sm text-[var(--lv2-taupe)] hover:text-[var(--lv2-ivory)]"
          >
            ← Cambiar horario
          </button>
          <p className="lv2-section-label">Paso 3 — Tus datos</p>
          <p className="lv2-body text-sm capitalize">
            {formatBookingDateLabel(dateStr)} · {selectedTime}
          </p>

          <div className="space-y-4">
            <label className="block">
              <span className="lv2-form-label">Nombre completo</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="lv2-input"
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className="lv2-form-label">Correo</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="lv2-input"
                autoComplete="email"
              />
            </label>
            <label className="block">
              <span className="lv2-form-label">Teléfono</span>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="lv2-input"
                autoComplete="tel"
              />
            </label>
            <fieldset>
              <legend className="lv2-form-label mb-2">Modalidad</legend>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setModality("online")}
                  className={cn(
                    "lv2-modality-btn flex-1",
                    modality === "online" && "lv2-modality-btn--active"
                  )}
                >
                  Online
                </button>
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  title="Presencial — próximamente disponible"
                  className="lv2-modality-btn flex-1 flex flex-col items-center gap-0.5"
                >
                  <span>Presencial</span>
                  <span className="text-[10px] tracking-wider opacity-60">próximamente</span>
                </button>
              </div>
            </fieldset>
            <label className="block">
              <span className="lv2-form-label">¿Algo que quieras compartir antes? (opcional)</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="lv2-input min-h-[88px] resize-y"
                maxLength={500}
              />
            </label>
          </div>

          {error && (
            <p className="text-sm text-red-300/90" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting} className="lv2-btn-gold w-full">
            {submitting ? "Enviando solicitud…" : "Solicitar consulta inicial"}
          </button>
        </form>
      )}

      {error && step !== "details" && (
        <p className="mt-4 text-sm text-red-300/90 text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
