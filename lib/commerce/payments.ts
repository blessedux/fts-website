import { Payment } from "mercadopago"
import {
  getOrderByExternalReference,
  markOrderPaid,
  updateOrder,
} from "@/lib/commerce/orders"
import type { OrderRecord } from "@/lib/commerce/types"
import {
  getSessionInvoiceByExternalReference,
  markSessionInvoicePaid,
  updateSessionInvoice,
  type SessionInvoice,
} from "@/lib/commerce/session-invoices"
import { sendSessionPaidEmails } from "@/lib/commerce/session-emails"
import { getMercadoPagoConfig } from "@/lib/payments/client"
import type { MpCountry } from "@/lib/payments/types"

export type PaymentApplyResult = {
  order: OrderRecord | null
  sessionInvoice: SessionInvoice | null
  paymentStatus?: string
}

/**
 * Fetch a Mercado Pago payment and advance book order or session invoice when approved.
 */
export async function applyMercadoPagoPaymentNotification(input: {
  country: MpCountry
  paymentId: string
}): Promise<PaymentApplyResult> {
  const paymentClient = new Payment(getMercadoPagoConfig(input.country))
  const payment = await paymentClient.get({ id: input.paymentId })
  const status = payment.status
  const externalReference = payment.external_reference

  if (!externalReference) {
    return { order: null, sessionInvoice: null, paymentStatus: status }
  }

  const order = await getOrderByExternalReference(externalReference)
  if (order) {
    if (status === "approved") {
      const paid = await markOrderPaid({
        orderId: order.id,
        mpPaymentId: String(payment.id ?? input.paymentId),
      })
      return { order: paid, sessionInvoice: null, paymentStatus: status }
    }
    if (status === "rejected" || status === "cancelled") {
      const failed = await updateOrder(order.id, {
        status: status === "cancelled" ? "cancelled" : "failed",
        mpPaymentId: String(payment.id ?? input.paymentId),
      })
      return { order: failed, sessionInvoice: null, paymentStatus: status }
    }
    return { order, sessionInvoice: null, paymentStatus: status }
  }

  const invoice = await getSessionInvoiceByExternalReference(externalReference)
  if (!invoice) {
    return { order: null, sessionInvoice: null, paymentStatus: status }
  }

  if (status === "approved") {
    const paid = await markSessionInvoicePaid({
      invoiceId: invoice.id,
      mpPaymentId: String(payment.id ?? input.paymentId),
    })
    if (paid && !paid.receiptEmailSentAt) {
      await sendSessionPaidEmails(paid).catch((err) => {
        console.error("[payments] confirmation/receipt email failed", err)
      })
    }
    return { order: null, sessionInvoice: paid, paymentStatus: status }
  }

  if (status === "rejected" || status === "cancelled") {
    const failed = await updateSessionInvoice(invoice.id, {
      status: status === "cancelled" ? "cancelled" : "failed",
      mpPaymentId: String(payment.id ?? input.paymentId),
    })
    return { order: null, sessionInvoice: failed, paymentStatus: status }
  }

  return { order: null, sessionInvoice: invoice, paymentStatus: status }
}
