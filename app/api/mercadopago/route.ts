import { NextResponse } from "next/server"
import { z } from "zod"
import { getDefaultMpCountry } from "@/lib/payments/env"
import { createCheckoutPreference } from "@/lib/payments/preference"
import { isMpCountry } from "@/lib/payments/types"

const createSchema = z.object({
  country: z.enum(["AR", "CL"]).optional(),
  title: z.string().min(1).max(200),
  unitPrice: z.number().positive(),
  quantity: z.number().int().positive().optional(),
  externalReference: z.string().min(1).max(256).optional(),
  payerEmail: z.string().email().optional(),
})

/**
 * Creates a real Mercado Pago Checkout Pro preference (sandbox or prod
 * depending on the access token). Replaces the previous mock response.
 */
export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = createSchema.safeParse(json)

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

    const preference = await createCheckoutPreference({
      country,
      title: parsed.data.title,
      unitPrice: parsed.data.unitPrice,
      quantity: parsed.data.quantity,
      payerEmail: parsed.data.payerEmail,
      externalReference:
        parsed.data.externalReference ?? `SMOKE_${country}_${Date.now()}`,
    })

    return NextResponse.json({
      id: preference.id,
      status: "created",
      country,
      external_reference: preference.external_reference,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "payment_error"
    console.error("[api/mercadopago] create preference failed:", message)
    const missingCreds = message.includes("Missing Mercado Pago")
    return NextResponse.json(
      { error: missingCreds ? "missing_credentials" : "payment_error", message },
      { status: missingCreds ? 503 : 500 },
    )
  }
}
