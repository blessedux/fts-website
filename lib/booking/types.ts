export type ConsultationModality = "presencial" | "online"

export type BookingRequest = {
  date: string
  time: string
  name: string
  email: string
  phone: string
  modality: ConsultationModality
  notes?: string
}

export type BookingRecord = BookingRequest & {
  id: string
  createdAt: string
}

export type TimeSlot = {
  time: string
  available: boolean
}
