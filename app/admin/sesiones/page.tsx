"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type Booking = {
  id: string
  name: string
  email: string
  date: string
  time: string
  modality: string
}

type Invoice = {
  id: string
  clientName: string
  clientEmail: string
  status: string
  total: number
  currency: string
  createdAt: string
  checkoutEmailSentAt?: string
  receiptEmailSentAt?: string
  initPoint?: string
}

export default function AdminSesionesPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [unitPrice, setUnitPrice] = useState<number>(45000)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [bookingId, setBookingId] = useState<string | undefined>()

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/sessions")
      const data = await res.json()
      setBookings(data.bookings || [])
      setInvoices(data.invoices || [])
      if (data.sessionPrice?.unitPrice) setUnitPrice(data.sessionPrice.unitPrice)
    } catch {
      setError("No se pudo cargar sesiones")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  async function charge(payload: {
    clientName: string
    clientEmail: string
    bookingId?: string
  }) {
    setSubmitting(true)
    setMessage(null)
    setError(null)
    try {
      const res = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, country: "CL" }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || data.error || "Error al cobrar")
      }
      setMessage(
        `Cobro creado (${data.invoiceId}). Email checkout: ${
          data.checkoutEmailSent ? "enviado" : "NO enviado (revisa RESEND_*)"
        }.`,
      )
      setName("")
      setEmail("")
      setBookingId(undefined)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cobrar")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold">Sesiones · cobro posterior</h1>
        <p className="text-muted-foreground mt-1">
          Marca una sesión como realizada y envía el link de Mercado Pago (
          {unitPrice.toLocaleString("es-CL")} CLP). El pago no se pide antes de
          la sesión.
        </p>
      </div>

      {message ? (
        <p className="text-sm text-green-700 dark:text-green-400">{message}</p>
      ) : null}
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <section className="space-y-4 max-w-xl border rounded-lg p-4">
        <h2 className="font-semibold">Nueva cobranza</h2>
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del cliente</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre completo"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="cliente@email.com"
          />
        </div>
        <Button
          disabled={submitting || name.trim().length < 2 || !email.includes("@")}
          onClick={() =>
            charge({
              clientName: name,
              clientEmail: email,
              bookingId,
            })
          }
        >
          {submitting ? "Enviando…" : "Sesión completada → enviar cobro"}
        </Button>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Reservas recientes (atajo)</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay reservas locales.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Modalidad</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <div className="font-medium">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.email}</div>
                  </TableCell>
                  <TableCell>
                    {b.date} {b.time}
                  </TableCell>
                  <TableCell>{b.modality}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={submitting}
                      onClick={() => {
                        setName(b.name)
                        setEmail(b.email)
                        setBookingId(b.id)
                        void charge({
                          clientName: b.name,
                          clientEmail: b.email,
                          bookingId: b.id,
                        })
                      }}
                    >
                      Cobrar sesión
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Cobranzas</h2>
        {invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin cobranzas aún.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Emails</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    <div className="font-medium">{inv.clientName}</div>
                    <div className="text-xs text-muted-foreground">
                      {inv.clientEmail}
                    </div>
                  </TableCell>
                  <TableCell>
                    ${inv.total.toLocaleString("es-CL")} {inv.currency}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        inv.status === "paid" ? "default" : "outline"
                      }
                    >
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {inv.checkoutEmailSentAt ? "checkout ✓" : "checkout —"}
                    {" · "}
                    {inv.receiptEmailSentAt ? "recibo ✓" : "recibo —"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {inv.initPoint ? (
                      <a
                        href={inv.initPoint}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm underline"
                      >
                        Link MP
                      </a>
                    ) : null}
                    {inv.status !== "paid" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={submitting}
                        onClick={async () => {
                          setSubmitting(true)
                          setError(null)
                          try {
                            const res = await fetch(
                              `/api/admin/sessions/${inv.id}/mark-paid`,
                              { method: "POST" },
                            )
                            const data = await res.json()
                            if (!res.ok) {
                              throw new Error(data.error || "mark-paid failed")
                            }
                            setMessage(
                              `Pagado + emails: confirmación ${data.confirmationSent ? "✓" : "—"}, recibo ${data.receiptSent ? "✓" : "—"}`,
                            )
                            await refresh()
                          } catch (err) {
                            setError(
                              err instanceof Error
                                ? err.message
                                : "No se pudo marcar pagado",
                            )
                          } finally {
                            setSubmitting(false)
                          }
                        }}
                      >
                        Simular pago + emails
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  )
}
