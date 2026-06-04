/** Horario de consultas iniciales (Chile, ajustar según disponibilidad real) */
export const BOOKING_CONFIG = {
  timezone: "America/Santiago",
  /** Días laborables: 1 = lunes … 5 = viernes */
  workDays: [1, 2, 3, 4, 5] as number[],
  slotStartHour: 9,
  slotEndHour: 18,
  slotMinutes: 60,
  /** Cuántos días hacia adelante se puede reservar */
  maxDaysAhead: 42,
  /** Mínimo de días de anticipación */
  minDaysAhead: 2,
} as const
