"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function PagoInner() {
  const searchParams = useSearchParams()
  const status = searchParams.get("status")
  const invoiceId = searchParams.get("invoice")
  const [invoiceStatus, setInvoiceStatus] = useState<string | null>(null)

  useEffect(() => {
    if (!invoiceId) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/session-invoices/${invoiceId}`)
        if (!res.ok) return
        const data = (await res.json()) as { status?: string }
        if (!cancelled) setInvoiceStatus(data.status ?? null)
      } catch {
        // ignore
      }
    })()
    return () => {
      cancelled = true
    }
  }, [invoiceId])

  const paid = invoiceStatus === "paid" || status === "success"
  const failed = status === "failure"
  const pending = status === "pending" && invoiceStatus !== "paid"

  return (
    <main className="min-h-screen bg-[#1a0f0a] text-[#f2ebe3] flex items-center justify-center px-6">
      <div className="max-w-md w-full border border-[#967e66]/30 bg-[#2e1a0e]/60 p-8 rounded-lg text-center">
        {paid ? (
          <>
            <h1 className="text-2xl font-serif mb-3">Pago de sesión recibido</h1>
            <p className="text-sm text-[#c4b5a6] mb-6">
              Si el pago fue aprobado, te enviamos el comprobante por correo.
            </p>
          </>
        ) : failed ? (
          <>
            <h1 className="text-2xl font-serif mb-3">Pago no completado</h1>
            <p className="text-sm text-[#c4b5a6] mb-6">
              Puedes reintentar con el enlace del correo cuando quieras.
            </p>
          </>
        ) : pending ? (
          <>
            <h1 className="text-2xl font-serif mb-3">Pago en proceso</h1>
            <p className="text-sm text-[#c4b5a6] mb-6">
              Estamos esperando la confirmación de Mercado Pago.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-serif mb-3">Pago de sesión</h1>
            <p className="text-sm text-[#c4b5a6] mb-6">
              Usa el enlace enviado por correo para pagar tu sesión.
            </p>
          </>
        )}
        {invoiceId ? (
          <p className="text-xs text-[#967e66] mb-6 break-all">Ref: {invoiceId}</p>
        ) : null}
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#6a4128] text-[#f2ebe3] rounded text-sm font-semibold"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}

export default function PagoPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#1a0f0a] text-[#f2ebe3] flex items-center justify-center">
          Cargando...
        </main>
      }
    >
      <PagoInner />
    </Suspense>
  )
}
