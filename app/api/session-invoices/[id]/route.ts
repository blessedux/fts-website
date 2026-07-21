import { NextResponse } from "next/server"
import { getSessionInvoiceById } from "@/lib/commerce/session-invoices"

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const invoice = await getSessionInvoiceById(id)
  if (!invoice) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  return NextResponse.json({
    id: invoice.id,
    status: invoice.status,
    country: invoice.country,
    total: invoice.total,
    currency: invoice.currency,
    title: invoice.title,
    clientName: invoice.clientName,
    paidAt: invoice.paidAt ?? null,
    receiptEmailSentAt: invoice.receiptEmailSentAt ?? null,
  })
}
