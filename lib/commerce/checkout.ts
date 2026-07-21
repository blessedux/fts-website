import {
  BOOK_PRODUCT_ID,
  getBookProduct,
  getBookUnitPrice,
} from "@/lib/commerce/catalog"
import { createOrder, updateOrder } from "@/lib/commerce/orders"
import type { OrderBuyer, OrderRecord } from "@/lib/commerce/types"
import { createCheckoutPreference } from "@/lib/payments/preference"
import { MP_CURRENCY_BY_COUNTRY, type MpCountry } from "@/lib/payments/types"

export type CreateBookCheckoutInput = {
  country: MpCountry
  quantity: number
  buyer: OrderBuyer
}

export type CreateBookCheckoutResult = {
  order: OrderRecord
  initPoint: string
  sandboxInitPoint?: string
  preferenceId?: string
}

/**
 * Server-side prepaid book checkout: catalog price → pending order → MP preference.
 * Client-sent prices are ignored; unit price comes from the catalog.
 */
export async function createBookCheckout(
  input: CreateBookCheckoutInput,
): Promise<CreateBookCheckoutResult> {
  const quantity = Math.max(1, Math.min(20, Math.floor(input.quantity)))
  const product = getBookProduct()
  const unitPrice = getBookUnitPrice(input.country)
  const currency = MP_CURRENCY_BY_COUNTRY[input.country]
  const total = unitPrice * quantity

  const order = await createOrder({
    externalReference: "pending",
    country: input.country,
    items: [
      {
        productId: BOOK_PRODUCT_ID,
        title: product.name,
        quantity,
        unitPrice,
        currency,
      },
    ],
    total,
    buyer: input.buyer,
  })

  const preference = await createCheckoutPreference({
    country: input.country,
    title: product.name,
    quantity,
    unitPrice,
    payerEmail: input.buyer.email,
    externalReference: order.id,
  })

  const withPreference =
    (await updateOrder(order.id, {
      mpPreferenceId: preference.id,
    })) ?? order

  // Current MP docs: with TEST access tokens, use init_point (not sandbox_init_point).
  const initPoint = preference.init_point || preference.sandbox_init_point || ""
  if (!initPoint) {
    throw new Error("Mercado Pago did not return a checkout URL")
  }

  return {
    order: withPreference,
    initPoint,
    sandboxInitPoint: preference.sandbox_init_point,
    preferenceId: preference.id,
  }
}
