"use client"

import { BOOK_PRODUCT, getBookUnitPrice } from "@/lib/commerce/catalog"
import { addToCart } from "@/lib/landing-v2/cart"
import type { MpCountry } from "@/lib/payments/types"

/** Adds the single physical book SKU using the catalog price for the country. */
export function addBookToCart(country: MpCountry = "CL", quantity = 1) {
  addToCart(
    {
      id: BOOK_PRODUCT.id,
      name: BOOK_PRODUCT.name,
      price: getBookUnitPrice(country),
      image: BOOK_PRODUCT.image,
    },
    quantity,
  )
}
