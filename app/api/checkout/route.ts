import { NextResponse } from "next/server"
import { z } from "zod"
import { createArBookRequest } from "@/lib/commerce/ar-book-request"
import { sendArBookRequestAdminEmail } from "@/lib/commerce/ar-book-emails"
import { createBookCheckout } from "@/lib/commerce/checkout"
import { getBookProduct, getBookUnitPrice } from "@/lib/commerce/catalog"
import {
  getDefaultMpCountry,
  isOnlineCheckoutEnabled,
} from "@/lib/payments/env"
import { isMpCountry } from "@/lib/payments/types"

const checkoutSchema = z.object({
  country: z.enum(["AR", "CL"]).optional(),
  quantity: z.number().int().positive().max(20).optional(),
  buyer: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email(),
    phone: z.string().min(8).max(40),
    address: z.string().min(3).max(240).optional(),
    region: z.string().max(80).optional(),
    comuna: z.string().max(80).optional(),
  }),
})

/**
 * Prepaid physical-book checkout.
 * CL → Mercado Pago preference.
 * AR (until dedicated credentials exist) → manual contact request + admin email.
 */
export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = checkoutSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "invalid_body", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const country = parsed.data.country ?? getDefaultMpCountry()
    if (!isMpCountry(country)) {
      return NextResponse.json({ error: "invalid_country" }, { status: 400 })
    }

    const quantity = parsed.data.quantity ?? 1

    if (country === "AR" && !isOnlineCheckoutEnabled("AR")) {
      const arRequest = await createArBookRequest({
        quantity,
        buyer: parsed.data.buyer,
      })
      const adminEmailSent = await sendArBookRequestAdminEmail(arRequest)

      return NextResponse.json(
        {
          mode: "manual_contact",
          country: "AR",
          requestId: arRequest.id,
          status: arRequest.status,
          total: arRequest.total,
          currency: arRequest.currency,
          adminEmailSent,
          message:
            "Recibimos tu solicitud. Fanny te contactará directamente para coordinar el pago en Argentina.",
        },
        { status: 201 },
      )
    }

    const result = await createBookCheckout({
      country,
      quantity,
      buyer: parsed.data.buyer,
    })

    return NextResponse.json(
      {
        mode: "mercadopago",
        orderId: result.order.id,
        status: result.order.status,
        country: result.order.country,
        total: result.order.total,
        currency: result.order.items[0]?.currency,
        preferenceId: result.preferenceId,
        init_point: result.initPoint,
        sandbox_init_point: result.sandboxInitPoint,
      },
      { status: 201 },
    )
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" &&
            error &&
            "message" in error &&
            typeof (error as { message: unknown }).message === "string"
          ? (error as { message: string }).message
          : "checkout_error"
    console.error("[api/checkout]", message, error)
    const missing = message.includes("Missing Mercado Pago")
    return NextResponse.json(
      { error: missing ? "missing_credentials" : "checkout_error", message },
      { status: missing ? 503 : 500 },
    )
  }
}

/** Catalog quote helper for the checkout UI (server prices only). */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const raw = (searchParams.get("country") || getDefaultMpCountry()).toUpperCase()
  const country = isMpCountry(raw) ? raw : getDefaultMpCountry()
  const product = getBookProduct()
  return NextResponse.json({
    product: {
      id: product.id,
      name: product.name,
      image: product.image,
      unitPrice: getBookUnitPrice(country),
      country,
      currency: country === "AR" ? "ARS" : "CLP",
      onlineCheckout: isOnlineCheckoutEnabled(country),
    },
  })
}
