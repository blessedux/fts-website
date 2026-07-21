import { NextResponse } from "next/server"
import { sendSessionPaidEmails } from "@/lib/commerce/session-emails"
import {
  getSessionInvoiceById,
  markSessionInvoicePaid,
} from "@/lib/commerce/session-invoices"

/**
 * Local/admin helper: mark a session invoice paid and send confirmation + receipt.
 * Use when Checkout Pro sandbox UI is broken; prod path is the MP webhook.
 */
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const existing = await getSessionInvoiceById(id)
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  const paid =
    (await markSessionInvoicePaid({
      invoiceId: id,
      mpPaymentId: existing.mpPaymentId || `manual-${Date.now()}`,
    })) ?? existing

  const emails = await sendSessionPaidEmails(paid)

  return NextResponse.json({
    invoiceId: paid.id,
    status: paid.status,
    paidAt: paid.paidAt ?? null,
    confirmationSent: emails.confirmationSent,
    receiptSent: emails.receiptSent,
  })
}
