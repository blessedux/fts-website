import { NextResponse } from "next/server"
import { getOrderById } from "@/lib/commerce/orders"

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const order = await getOrderById(id)
  if (!order) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  return NextResponse.json({
    id: order.id,
    status: order.status,
    country: order.country,
    total: order.total,
    currency: order.items[0]?.currency ?? null,
    paidAt: order.paidAt ?? null,
    items: order.items,
  })
}
