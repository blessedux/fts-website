import type { MpCountry } from "@/lib/payments/types"
import type { BookProductId } from "@/lib/commerce/catalog"

export type OrderStatus = "pending" | "paid" | "failed" | "cancelled"

export type OrderBuyer = {
  name: string
  email: string
  phone: string
  address?: string
  region?: string
  comuna?: string
}

export type OrderLineItem = {
  productId: BookProductId
  title: string
  quantity: number
  unitPrice: number
  currency: "CLP" | "ARS"
}

export type OrderRecord = {
  id: string
  externalReference: string
  country: MpCountry
  status: OrderStatus
  items: OrderLineItem[]
  total: number
  buyer: OrderBuyer
  mpPreferenceId?: string
  mpPaymentId?: string
  paidAt?: string
  createdAt: string
  updatedAt: string
}
