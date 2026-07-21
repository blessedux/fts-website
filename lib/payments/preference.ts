import { getPaymentsPublicBaseUrl } from "@/lib/payments/env"
import { getPreferenceClient } from "@/lib/payments/client"
import {
  MP_CURRENCY_BY_COUNTRY,
  type MpCountry,
} from "@/lib/payments/types"

export type CreateCheckoutPreferenceInput = {
  country: MpCountry
  title: string
  quantity?: number
  unitPrice: number
  externalReference: string
  payerEmail?: string
  statementDescriptor?: string
  description?: string
  pictureUrl?: string
  /** MP item category_id (default books). */
  categoryId?: string
  /**
   * Return path after checkout (no leading slash).
   * Defaults to `checkout` for books; sessions use `pago`.
   */
  returnPath?: string
  /** Query key for the external reference on return URLs (order | invoice). */
  returnRefParam?: "order" | "invoice"
}

/**
 * Creates a Checkout Pro preference for the given country seller account.
 * Used by book checkout + session pay-after (later tickets).
 *
 * Note: Checkout UI may also show the seller `company.brand_name` from the
 * Mercado Pago account (e.g. "davinci") — that is NOT the item title.
 */
export async function createCheckoutPreference(
  input: CreateCheckoutPreferenceInput,
) {
  const base = getPaymentsPublicBaseUrl()
  const currencyId = MP_CURRENCY_BY_COUNTRY[input.country]
  const quantity = input.quantity ?? 1

  const returnPath = input.returnPath ?? "checkout"
  const refParam = input.returnRefParam ?? "order"
  const backUrls = {
    success: `${base}/${returnPath}?status=success&country=${input.country}&${refParam}=${encodeURIComponent(input.externalReference)}`,
    pending: `${base}/${returnPath}?status=pending&country=${input.country}&${refParam}=${encodeURIComponent(input.externalReference)}`,
    failure: `${base}/${returnPath}?status=failure&country=${input.country}&${refParam}=${encodeURIComponent(input.externalReference)}`,
  }

  // Mercado Pago rejects auto_return when success URL is not HTTPS (e.g. localhost).
  // It also strips non-HTTPS back_urls from the stored preference.
  const canAutoReturn = base.startsWith("https://")

  const preference = getPreferenceClient(input.country)
  return preference.create({
    body: {
      items: [
        {
          id: input.externalReference,
          title: input.title,
          description:
            input.description ?? input.title,
          category_id: input.categoryId ?? "books",
          quantity,
          unit_price: input.unitPrice,
          currency_id: currencyId,
          ...(input.pictureUrl ? { picture_url: input.pictureUrl } : {}),
        },
      ],
      external_reference: input.externalReference,
      // Card statement label (keep short; separate from Checkout product title).
      statement_descriptor:
        input.statementDescriptor ?? "Fanny Torres",
      ...(canAutoReturn ? { auto_return: "approved" as const } : {}),
      ...(canAutoReturn ? { back_urls: backUrls } : {}),
      // Only register notification_url when publicly reachable (HTTPS).
      ...(canAutoReturn
        ? {
            notification_url: `${base}/api/payments/webhook?country=${input.country}`,
          }
        : {}),
      ...(input.payerEmail
        ? { payer: { email: input.payerEmail } }
        : {}),
    },
  })
}
