import {
  getSessionProduct,
  getSessionUnitPrice,
} from "@/lib/commerce/catalog"
import {
  createSessionInvoice,
  updateSessionInvoice,
  type SessionInvoice,
} from "@/lib/commerce/session-invoices"
import { createCheckoutPreference } from "@/lib/payments/preference"
import { MP_CURRENCY_BY_COUNTRY, type MpCountry } from "@/lib/payments/types"

export type CreateSessionChargeInput = {
  country: MpCountry
  clientName: string
  clientEmail: string
  bookingId?: string
}

export type CreateSessionChargeResult = {
  invoice: SessionInvoice
  initPoint: string
  preferenceId?: string
}

/**
 * After a session is taken: create pending invoice + Mercado Pago preference.
 * Does not require payment before the session.
 */
export async function createSessionCharge(
  input: CreateSessionChargeInput,
): Promise<CreateSessionChargeResult> {
  const product = getSessionProduct()
  const unitPrice = getSessionUnitPrice(input.country)
  const currency = MP_CURRENCY_BY_COUNTRY[input.country]

  const invoice = await createSessionInvoice({
    bookingId: input.bookingId,
    country: input.country,
    clientName: input.clientName.trim(),
    clientEmail: input.clientEmail.trim().toLowerCase(),
    title: product.name,
    unitPrice,
    currency,
    total: unitPrice,
  })

  const preference = await createCheckoutPreference({
    country: input.country,
    title: product.name,
    description: `Sesión completada · ${input.clientName}`,
    quantity: 1,
    unitPrice,
    payerEmail: input.clientEmail,
    externalReference: invoice.id,
    categoryId: "services",
    returnPath: "pago",
    returnRefParam: "invoice",
  })

  const initPoint =
    preference.init_point || preference.sandbox_init_point || ""
  if (!initPoint) {
    throw new Error("Mercado Pago did not return a checkout URL")
  }

  const updated =
    (await updateSessionInvoice(invoice.id, {
      mpPreferenceId: preference.id,
      initPoint,
    })) ?? invoice

  return {
    invoice: updated,
    initPoint,
    preferenceId: preference.id,
  }
}
