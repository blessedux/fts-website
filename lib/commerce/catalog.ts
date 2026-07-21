import type { MpCountry } from "@/lib/payments/types"

/**
 * Commerce SKUs for v1.
 * - Book: public prepaid cart
 * - Session: pay-after only (never in public cart)
 *
 * Prices are fixed per currency — never trust client-sent amounts.
 */

export const BOOK_PRODUCT_ID = "libro-eneagrama" as const
export const SESSION_PRODUCT_ID = "sesion-psicoanalisis" as const

export type BookProductId = typeof BOOK_PRODUCT_ID
export type SessionProductId = typeof SESSION_PRODUCT_ID
export type CommerceProductId = BookProductId | SessionProductId

type PricedProduct<Id extends string> = {
  id: Id
  name: string
  image?: string
  prices: Record<MpCountry, number>
}

export const BOOK_PRODUCT: PricedProduct<BookProductId> = {
  id: BOOK_PRODUCT_ID,
  name: "El Libro Oficial de Eneagrama",
  image: "/imgs/portada_libro_final.png",
  prices: {
    CL: 24_990, // CLP
    AR: 25_000, // ARS — placeholder until AR checkout is enabled
  },
}

/** Fixed session fee — pay-after admin flow only. */
export const SESSION_PRODUCT: PricedProduct<SessionProductId> = {
  id: SESSION_PRODUCT_ID,
  name: "Sesión de psicoanálisis",
  prices: {
    CL: 45_000, // CLP — confirm with Fanny
    AR: 45_000, // ARS — placeholder
  },
}

export function getBookProduct() {
  return BOOK_PRODUCT
}

export function getBookUnitPrice(country: MpCountry): number {
  return BOOK_PRODUCT.prices[country]
}

export function getSessionProduct() {
  return SESSION_PRODUCT
}

export function getSessionUnitPrice(country: MpCountry): number {
  return SESSION_PRODUCT.prices[country]
}

export function isCommerceProductId(id: string): id is CommerceProductId {
  return id === BOOK_PRODUCT_ID || id === SESSION_PRODUCT_ID
}
