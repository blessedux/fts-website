import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Just log the payment info (no actual Mercado Pago integration yet)
    console.log("Payment request:", body)

    // Simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Simular respuesta de Mercado Pago
    const paymentResponse = {
      id: "payment_" + Math.floor(Math.random() * 1000000),
      status: "pending",
      external_reference: body.reference || "ref_" + Date.now(),
      init_point: "https://www.mercadopago.cl/checkout/v1/redirect?pref_id=123456789",
    }

    return NextResponse.json(paymentResponse)
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json({ error: "Error processing payment" }, { status: 500 })
  }
}
