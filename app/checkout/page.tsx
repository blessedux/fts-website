"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Cormorant_Garamond, DM_Sans, EB_Garamond } from "next/font/google"
import { LandingNav } from "@/components/landing-v2/landing-nav"
import { LandingFooter } from "@/components/landing-v2/landing-footer"
import { CreditCard, Package, Lock, Check, Mail } from "lucide-react"
import { getCartItems, clearCart, type CartItem } from "@/lib/landing-v2/cart"
import { BOOK_PRODUCT, getBookUnitPrice } from "@/lib/commerce/catalog"
import type { MpCountry } from "@/lib/payments/types"
import "@/styles/landing-v2.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hero-sans",
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
})

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
})

function formatMoney(amount: number, country: MpCountry) {
  const locale = country === "AR" ? "es-AR" : "es-CL"
  const currency = country === "AR" ? "ARS" : "CLP"
  return `$${amount.toLocaleString(locale)} ${currency}`
}

function CheckoutInner() {
  const searchParams = useSearchParams()
  const statusParam = searchParams.get("status")
  const orderParam = searchParams.get("order")
  const countryParam = searchParams.get("country")?.toUpperCase()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [orderStatus, setOrderStatus] = useState<string | null>(null)
  const [arRequestDone, setArRequestDone] = useState(false)
  const [arRequestId, setArRequestId] = useState<string | null>(null)

  const [country, setCountry] = useState<MpCountry>(
    countryParam === "AR" ? "AR" : "CL",
  )
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [region, setRegion] = useState(
    countryParam === "AR" ? "Buenos Aires" : "Metropolitana",
  )
  const [comuna, setComuna] = useState("")

  const unitPrice = getBookUnitPrice(country)
  const isArManual = country === "AR"

  useEffect(() => {
    setMounted(true)
    const items = getCartItems().filter((i) => i.id === BOOK_PRODUCT.id)
    if (items.length > 0) {
      setCartItems(items.map((i) => ({ ...i, price: unitPrice })))
    } else if (!statusParam && !arRequestDone) {
      setCartItems([
        {
          id: BOOK_PRODUCT.id,
          name: BOOK_PRODUCT.name,
          price: unitPrice,
          image: BOOK_PRODUCT.image ?? "/imgs/portada_libro_final.png",
          quantity: 1,
        },
      ])
    }
  }, [statusParam, unitPrice, arRequestDone])

  useEffect(() => {
    if (!orderParam) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/orders/${orderParam}`)
        if (!res.ok) return
        const data = (await res.json()) as { status?: string }
        if (!cancelled) {
          setOrderStatus(data.status ?? null)
          if (data.status === "paid") {
            clearCart()
          }
        }
      } catch {
        // ignore
      }
    })()
    return () => {
      cancelled = true
    }
  }, [orderParam])

  const quantity = cartItems.reduce((acc, item) => acc + item.quantity, 0) || 1
  const total = unitPrice * quantity
  const isSuccess =
    statusParam === "success" || orderStatus === "paid"
  const isFailure = statusParam === "failure"
  const isPending = statusParam === "pending" && orderStatus !== "paid"

  function onCountryChange(next: MpCountry) {
    setCountry(next)
    setRegion(next === "AR" ? "Buenos Aires" : "Metropolitana")
    setError(null)
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          country,
          quantity,
          buyer: {
            name,
            email,
            phone,
            address,
            region,
            comuna,
          },
        }),
      })
      const data = (await res.json()) as {
        mode?: string
        init_point?: string
        sandbox_init_point?: string
        requestId?: string
        message?: string
        error?: string
        adminEmailSent?: boolean
      }
      if (!res.ok) {
        throw new Error(data.message || data.error || "No se pudo procesar la solicitud")
      }

      if (data.mode === "manual_contact") {
        clearCart()
        setArRequestId(data.requestId ?? null)
        setArRequestDone(true)
        setIsLoading(false)
        return
      }

      const url = data.init_point || data.sandbox_init_point
      if (!url) throw new Error("Mercado Pago no devolvió URL de pago")
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar el pago")
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--lv2-void)] flex items-center justify-center text-[var(--lv2-ivory)]">
        <p className="animate-pulse">Cargando...</p>
      </div>
    )
  }

  return (
    <div
      className={`landing-v2 min-h-screen ${dmSans.variable} ${cormorant.variable} ${ebGaramond.variable} flex flex-col bg-[var(--lv2-void)]`}
    >
      <LandingNav />

      <main className="flex-grow pt-24 pb-24 md:pt-32">
        <div className="mx-auto max-w-4xl px-6 md:px-10">
          {arRequestDone ? (
            <div className="text-center py-16 px-6 bg-[var(--lv2-ink)]/40 border border-[#b8954a]/25 rounded-lg max-w-xl mx-auto my-12 backdrop-blur-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#b8954a]/15 border border-[#b8954a] mb-6">
                <Mail className="h-8 w-8 text-[#b8954a]" />
              </div>
              <h1 className="font-[family-name:var(--font-cormorant)] text-3xl text-[var(--lv2-ivory)] mb-4">
                Recibimos tu solicitud
              </h1>
              <p className="lv2-body text-base text-[var(--lv2-ivory-muted)] mb-4">
                Por ahora el pago online en Argentina (ARS) aún no está habilitado.
                <strong className="text-[var(--lv2-ivory)]"> Fanny te contactará directamente</strong>{" "}
                para coordinar la compra del libro.
              </p>
              <p className="lv2-body text-sm text-[var(--lv2-taupe)] mb-2">
                No se realizó ningún cargo. Tus datos quedaron registrados para el seguimiento.
              </p>
              {arRequestId ? (
                <p className="lv2-body text-xs text-[var(--lv2-taupe)] mb-8">
                  Referencia: {arRequestId}
                </p>
              ) : null}
              <div className="lv2-gold-line max-w-[120px] mx-auto my-8" />
              <Link href="/" className="lv2-btn-gold px-8 py-3 inline-block">
                Volver al Inicio
              </Link>
            </div>
          ) : isSuccess ? (
            <div className="text-center py-16 px-6 bg-[var(--lv2-ink)]/40 border border-[#b8954a]/25 rounded-lg max-w-xl mx-auto my-12 backdrop-blur-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500 mb-6">
                <Check className="h-8 w-8 text-green-400" />
              </div>
              <h1 className="font-[family-name:var(--font-cormorant)] text-3xl text-[var(--lv2-ivory)] mb-4">
                {orderStatus === "paid"
                  ? "¡Pago confirmado!"
                  : "¡Gracias por tu compra!"}
              </h1>
              <p className="lv2-body text-base text-[var(--lv2-ivory-muted)] mb-2">
                {orderStatus === "paid"
                  ? "Tu pedido del libro quedó marcado como pagado."
                  : "Si el pago fue aprobado, lo confirmaremos en unos momentos."}
              </p>
              {orderParam ? (
                <p className="lv2-body text-xs text-[var(--lv2-taupe)] mb-8">
                  Pedido: {orderParam}
                </p>
              ) : null}
              <div className="lv2-gold-line max-w-[120px] mx-auto my-8" />
              <Link href="/" className="lv2-btn-gold px-8 py-3 inline-block">
                Volver al Inicio
              </Link>
            </div>
          ) : isFailure ? (
            <div className="text-center py-16 px-6 bg-[var(--lv2-ink)]/40 border border-red-500/30 rounded-lg max-w-xl mx-auto my-12">
              <h1 className="font-[family-name:var(--font-cormorant)] text-3xl text-[var(--lv2-ivory)] mb-4">
                Pago no completado
              </h1>
              <p className="lv2-body text-base text-[var(--lv2-ivory-muted)] mb-8">
                Puedes intentar nuevamente cuando quieras. Tu carrito se mantiene.
              </p>
              <Link href="/checkout" className="lv2-btn-gold px-8 py-3 inline-block">
                Volver al checkout
              </Link>
            </div>
          ) : isPending ? (
            <div className="text-center py-16 px-6 bg-[var(--lv2-ink)]/40 border border-[#b8954a]/25 rounded-lg max-w-xl mx-auto my-12">
              <h1 className="font-[family-name:var(--font-cormorant)] text-3xl text-[var(--lv2-ivory)] mb-4">
                Pago en proceso
              </h1>
              <p className="lv2-body text-base text-[var(--lv2-ivory-muted)] mb-8">
                Estamos esperando la confirmación de Mercado Pago.
              </p>
              <Link href="/" className="lv2-btn-outline px-8 py-3 inline-block">
                Volver al inicio
              </Link>
            </div>
          ) : (
            <div>
              <div className="mb-10 text-center md:text-left">
                <h1 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl text-[var(--lv2-ivory)]">
                  Finalizar Compra
                </h1>
                <p className="lv2-body text-sm text-[var(--lv2-taupe)] mt-2">
                  Libro físico · {formatMoney(unitPrice, country)}
                  {isArManual
                    ? " · Coordinación directa en Argentina"
                    : " · Mercado Pago Chile"}
                </p>
              </div>

              <div className="grid gap-10 md:grid-cols-[1fr_350px]">
                <form onSubmit={onSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <p className="lv2-section-label">País de compra</p>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          { id: "CL" as const, label: "Chile (CLP)" },
                          { id: "AR" as const, label: "Argentina (ARS)" },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => onCountryChange(opt.id)}
                          className={`rounded border px-4 py-3 text-sm text-left transition-colors ${
                            country === opt.id
                              ? "border-[#b8954a] bg-[var(--lv2-ink)]/50 text-[var(--lv2-ivory)]"
                              : "border-[var(--lv2-taupe)]/25 text-[var(--lv2-taupe)] hover:border-[var(--lv2-taupe)]/50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isArManual ? (
                    <div className="border border-[#b8954a]/35 bg-[#b8954a]/10 p-5 rounded space-y-2">
                      <p className="font-semibold text-sm text-[var(--lv2-ivory)]">
                        Pago online en Argentina temporalmente no disponible
                      </p>
                      <p className="text-sm text-[var(--lv2-ivory-muted)] leading-relaxed">
                        Estamos habilitando Mercado Pago en ARS. Completa tus datos y
                        envía la solicitud: <strong className="text-[var(--lv2-ivory)]">Fanny te contactará directamente</strong> para
                        coordinar el pago. No serás redirigido a ninguna pasarela.
                      </p>
                    </div>
                  ) : null}

                  <div className="space-y-4">
                    <p className="lv2-section-label">Artículos del Pedido</p>
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 bg-[var(--lv2-ink)]/30 border border-[var(--lv2-taupe)]/10 p-4 rounded"
                        >
                          <div className="relative h-16 w-12 bg-black/25 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-contain"
                              sizes="48px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-[var(--lv2-ivory)] truncate">
                              {item.name}
                            </h3>
                            <p className="text-xs text-[var(--lv2-taupe)] mt-1">
                              Cantidad: {item.quantity} · {formatMoney(unitPrice, country)}
                            </p>
                          </div>
                          <div className="font-bold text-sm text-[var(--lv2-ivory)]">
                            {formatMoney(unitPrice * item.quantity, country)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="lv2-section-label">Información Personal</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="block">
                          <span className="lv2-form-label block mb-1">Nombre Completo</span>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="lv2-input rounded"
                            placeholder="Nombre y apellidos"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block">
                          <span className="lv2-form-label block mb-1">Correo Electrónico</span>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="lv2-input rounded"
                            placeholder="nombre@ejemplo.com"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block">
                          <span className="lv2-form-label block mb-1">Teléfono de Contacto</span>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="lv2-input rounded"
                            placeholder={isArManual ? "+54 9 11 XXXX XXXX" : "+56 9 XXXX XXXX"}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-[#b8954a]" />
                      <p className="lv2-section-label mb-0">Información de Envío</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="block">
                          <span className="lv2-form-label block mb-1">Dirección Completa</span>
                          <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="lv2-input rounded"
                            placeholder={
                              isArManual
                                ? "Calle, número, piso o departamento"
                                : "Calle, número, departamento o block"
                            }
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block">
                          <span className="lv2-form-label block mb-1">
                            {isArManual ? "Provincia" : "Región"}
                          </span>
                          {isArManual ? (
                            <input
                              type="text"
                              required
                              value={region}
                              onChange={(e) => setRegion(e.target.value)}
                              className="lv2-input rounded"
                              placeholder="Provincia"
                            />
                          ) : (
                            <select
                              value={region}
                              onChange={(e) => setRegion(e.target.value)}
                              className="lv2-input rounded w-full bg-[#2e1a0e] border border-[var(--lv2-taupe)]/35 text-[var(--lv2-ivory)] px-3 py-2.5"
                            >
                              <option value="Metropolitana">Metropolitana</option>
                              <option value="Valparaiso">Valparaíso</option>
                              <option value="Biobio">Biobío</option>
                              <option value="Araucania">Araucanía</option>
                              <option value="Antofagasta">Antofagasta</option>
                              <option value="Otro">Otra Región</option>
                            </select>
                          )}
                        </label>
                      </div>
                      <div>
                        <label className="block">
                          <span className="lv2-form-label block mb-1">
                            {isArManual ? "Localidad / Ciudad" : "Comuna"}
                          </span>
                          <input
                            type="text"
                            required
                            value={comuna}
                            onChange={(e) => setComuna(e.target.value)}
                            className="lv2-input rounded"
                            placeholder={isArManual ? "Localidad o ciudad" : "Comuna de destino"}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="lv2-section-label">Método de Pago</p>
                    <div className="border border-[var(--lv2-taupe)]/20 bg-[var(--lv2-ink)]/40 p-5 rounded flex items-start gap-4">
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#b8954a]">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#b8954a]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-[var(--lv2-ivory)] flex items-center gap-2">
                          {isArManual ? (
                            <>
                              <Mail className="h-4 w-4 text-[#b8954a]" />
                              Coordinación directa con Fanny
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-4 w-4 text-[#0063FF]" />
                              Mercado Pago (Chile)
                            </>
                          )}
                        </h4>
                        <p className="text-xs text-[var(--lv2-taupe)] mt-1">
                          {isArManual
                            ? "Sin redirección a pasarela. Te escribiremos para cerrar el pago en ARS."
                            : "Serás redirigido a Checkout Pro para pagar con tarjeta u otros medios."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {error ? (
                    <p className="text-sm text-red-400" role="alert">
                      {error}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="lv2-btn-gold w-full py-4 text-center flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading
                      ? isArManual
                        ? "Enviando solicitud..."
                        : "Redirigiendo a Mercado Pago..."
                      : isArManual
                        ? `Solicitar compra · ${formatMoney(total, country)}`
                        : `Pagar ${formatMoney(total, country)}`}
                  </button>
                </form>

                <div className="space-y-6">
                  <div className="bg-[var(--lv2-ink)]/45 border border-[var(--lv2-taupe)]/20 p-6 rounded-lg backdrop-blur-sm">
                    <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-[var(--lv2-ivory)] mb-4">
                      Resumen del Pedido
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--lv2-ivory-muted)]">Libro × {quantity}</span>
                        <span className="text-[var(--lv2-ivory)] font-medium">
                          {formatMoney(total, country)}
                        </span>
                      </div>
                      <div className="h-[1px] bg-[var(--lv2-taupe)]/15 my-4" />
                      <div className="flex justify-between items-center text-base font-bold">
                        <span className="text-[var(--lv2-ivory)]">Total</span>
                        <span className="text-lg text-[#f4efe4]">
                          {formatMoney(total, country)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-[var(--lv2-taupe)]/20 bg-black/10 p-4 rounded flex gap-3">
                    <Lock className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-xs text-[var(--lv2-ivory)]">
                        {isArManual ? "Sin cargo online" : "Transacción Encriptada"}
                      </h4>
                      <p className="text-[11px] text-[var(--lv2-taupe)] mt-1 leading-normal">
                        {isArManual
                          ? "No procesamos pagos en ARS todavía. Solo guardamos tus datos para que Fanny te contacte."
                          : "El pago se procesa en Mercado Pago. El precio lo fija el servidor (catálogo), no el navegador."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--lv2-void)] flex items-center justify-center text-[var(--lv2-ivory)]">
          <p className="animate-pulse">Cargando...</p>
        </div>
      }
    >
      <CheckoutInner />
    </Suspense>
  )
}
