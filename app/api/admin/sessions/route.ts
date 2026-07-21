import { NextResponse } from "next/server"
import { z } from "zod"
import { readBookings } from "@/lib/booking/store"
import { getSessionUnitPrice } from "@/lib/commerce/catalog"
import { createSessionCharge } from "@/lib/commerce/session-checkout"
import { sendSessionCheckoutEmail } from "@/lib/commerce/session-emails"
import { readSessionInvoices } from "@/lib/commerce/session-invoices"
import { getDefaultMpCountry } from "@/lib/payments/env"
import { isMpCountry } from "@/lib/payments/types"

const chargeSchema = z.object({
  clientName: z.string().min(2).max(120),
  clientEmail: z.string().email(),
  country: z.enum(["AR", "CL"]).optional(),
  bookingId: z.string().min(1).max(80).optional(),
})

/** List bookings + session invoices for admin cobro UI. */
export async function GET() {
  const [bookings, invoices] = await Promise.all([
    readBookings(),
    readSessionInvoices(),
  ])
  const country = getDefaultMpCountry()
  return NextResponse.json({
    sessionPrice: {
      country,
      unitPrice: getSessionUnitPrice(country),
    },
    bookings: bookings
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 50),
    invoices: invoices
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 50),
  })
}

/**
 * Admin: session already taken → create MP preference → email checkout link.
 * Payment is never required before the session.
 */
export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = chargeSchema.safeParse(json)
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

    const result = await createSessionCharge({
      country,
      clientName: parsed.data.clientName,
      clientEmail: parsed.data.clientEmail,
      bookingId: parsed.data.bookingId,
    })

    const emailSent = await sendSessionCheckoutEmail(result.invoice)

    return NextResponse.json(
      {
        invoiceId: result.invoice.id,
        status: result.invoice.status,
        total: result.invoice.total,
        currency: result.invoice.currency,
        preferenceId: result.preferenceId,
        init_point: result.initPoint,
        checkoutEmailSent: emailSent,
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
          : "session_charge_error"
    console.error("[api/admin/sessions]", message, error)
    const missing = message.includes("Missing Mercado Pago")
    return NextResponse.json(
      {
        error: missing ? "missing_credentials" : "session_charge_error",
        message,
      },
      { status: missing ? 503 : 500 },
    )
  }
}
