"use client"

import { useCallback, useEffect, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"
import { cn } from "@/lib/utils"
import { isBookableDate } from "@/lib/booking/slots"
import { formatBookingDateLabel } from "@/lib/booking/slots"
import type { ConsultationModality, TimeSlot } from "@/lib/booking/types"

type Step = "date" | "time" | "details" | "done"

type RevealStyle = {
  opacity: number
  translateY: number
}

type ConsultationBookingProps = {
  labelsReveal?: RevealStyle
  panelReveal?: RevealStyle
}

function revealStyle(reveal?: RevealStyle) {
  if (!reveal) return undefined
  return {
    opacity: reveal.opacity,
    transform: `translate3d(0, ${reveal.translateY}px, 0)`,
    willChange: "opacity, transform" as const,
  }
}

export function ConsultationBooking({
  labelsReveal,
  panelReveal,
}: ConsultationBookingProps = {}) {
  const [step, setStep] = useState<Step>("date")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [modality, setModality] = useState<ConsultationModality>("online")
  const [notes, setNotes] = useState("")

  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null

  const fetchSlots = useCallback(async (date: string) => {
    setLoadingSlots(true)
    setError(null)
    try {
      const res = await fetch(`/api/bookings?date=${date}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "No se pudieron cargar los horarios")
      setSlots(data.slots)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de conexión")
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }, [])

  useEffect(() => {
    if (dateStr && step === "time") {
      fetchSlots(dateStr)
    }
  }, [dateStr, step, fetchSlots])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!dateStr || !selectedTime) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/bookings", {
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
      setStep("done")
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
  }

  if (step === "done" && dateStr && selectedTime) {
    return (
      <div className="lv2-booking-panel text-center">
        <div style={revealStyle(labelsReveal)}>
          <p className="lv2-section-label mb-3">Reserva confirmada</p>
          <h3 className="lv2-display text-2xl text-[var(--lv2-ivory)] mb-4">
            Tu camino ha comenzado
          </h3>
        </div>
        <div style={revealStyle(panelReveal)}>
          <p className="lv2-body text-base mb-6">
            {formatBookingDateLabel(dateStr)} · {selectedTime}
            <br />
            {modality === "online" ? "Consulta online" : "Consulta presencial"}
          </p>
          <p className="lv2-body text-sm mb-8">
            Recibirás un correo de confirmación en <span className="text-[var(--lv2-taupe)]">{email}</span>.
          </p>
          <button type="button" onClick={reset} className="lv2-btn-outline">
            Reservar otra fecha
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="lv2-booking-panel">
      {step === "date" && (
        <div>
          <p
            className="lv2-section-label mb-4 text-center"
            style={revealStyle(labelsReveal)}
          >
            Paso 1 — Elige una fecha
          </p>
          <div style={revealStyle(panelReveal)}>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(d) => {
              setSelectedDate(d)
              setSelectedTime(null)
              if (d) {
                setStep("time")
              }
            }}
            locale={es}
            disabled={(date) => !isBookableDate(date)}
            className="lv2-day-picker mx-auto"
            modifiersClassNames={{
              selected: "lv2-day-selected",
              today: "lv2-day-today",
              disabled: "lv2-day-disabled",
            }}
          />
          </div>
        </div>
      )}

      {step === "time" && dateStr && (
        <div>
          <div style={revealStyle(labelsReveal)}>
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
          </div>
          <div style={revealStyle(panelReveal)}>
          {loadingSlots ? (
            <p className="lv2-body text-center py-8">Cargando horarios…</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {slots.map(({ time, available }) => (
                <button
                  key={time}
                  type="button"
                  disabled={!available}
                  onClick={() => {
                    setSelectedTime(time)
                    setStep("details")
                  }}
                  className={cn(
                    "lv2-slot-btn",
                    !available && "lv2-slot-btn--disabled",
                    selectedTime === time && "lv2-slot-btn--active"
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
          {slots.length > 0 && slots.every((s) => !s.available) && (
            <p className="lv2-body mt-4 text-center text-sm">
              No hay horarios disponibles este día. Elige otra fecha.
            </p>
          )}
          </div>
        </div>
      )}

      {step === "details" && dateStr && selectedTime && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div style={revealStyle(labelsReveal)}>
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
          </div>

          <div className="space-y-4" style={revealStyle(panelReveal)}>
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
                {(["online", "presencial"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModality(m)}
                    className={cn(
                      "lv2-modality-btn flex-1",
                      modality === m && "lv2-modality-btn--active"
                    )}
                  >
                    {m === "online" ? "Online" : "Presencial"}
                  </button>
                ))}
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
            <p className="text-sm text-red-300/90" role="alert" style={revealStyle(panelReveal)}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="lv2-btn-gold w-full"
            style={revealStyle(panelReveal)}
          >
            {submitting ? "Reservando…" : "Confirmar consulta inicial"}
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
