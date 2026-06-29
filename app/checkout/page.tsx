"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Cormorant_Garamond, DM_Sans, EB_Garamond } from "next/font/google"
import { LandingNav } from "@/components/landing-v2/landing-nav"
import { LandingFooter } from "@/components/landing-v2/landing-footer"
import { CheckCircle, CreditCard, Package, Lock, Check } from "lucide-react"
import { getCartItems, CartItem } from "@/lib/landing-v2/cart"
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

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  
  // Form fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [region, setRegion] = useState("Metropolitana")
  const [comuna, setComuna] = useState("")

  useEffect(() => {
    setMounted(true)
    const items = getCartItems()
    if (items.length > 0) {
      setCartItems(items)
    } else {
      // Fallback placeholder item (e.g. the book) if someone loads this directly without any cart items
      setCartItems([
        {
          id: "libro-eneagrama",
          name: "El Libro Oficial de Eneagrama",
          price: 24990,
          image: "/imgs/portada_libro_final.png",
          quantity: 1,
        },
      ])
    }
  }, [])

  const hasPhysicalBook = cartItems.some((item) => item.id === "libro-eneagrama")
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shippingCost = hasPhysicalBook ? 3990 : 0
  const total = subtotal + shippingCost

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Simulate SumUp API checkout processing
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      // Clear cart
      localStorage.removeItem("fts-evershop-cart")
      window.dispatchEvent(new Event("fts-evershop-cart-updated"))
    }, 2000)
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
          
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-16 px-6 bg-[var(--lv2-ink)]/40 border border-[#b8954a]/25 rounded-lg max-w-xl mx-auto my-12 backdrop-blur-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500 mb-6">
                <Check className="h-8 w-8 text-green-400" />
              </div>
              <h1 className="font-[family-name:var(--font-cormorant)] text-3xl text-[var(--lv2-ivory)] mb-4">
                ¡Pago Recibido Exitosamente!
              </h1>
              <p className="lv2-body text-base text-[var(--lv2-ivory-muted)] mb-2">
                Gracias por tu compra. Hemos procesado tu pago de manera segura.
              </p>
              <p className="lv2-body text-sm text-[var(--lv2-taupe)] mb-8">
                Recibirás un correo electrónico de confirmación con los detalles del despacho y acceso en los próximos minutos.
              </p>
              <div className="lv2-gold-line max-w-[120px] mx-auto my-8" />
              <Link href="/" className="lv2-btn-gold px-8 py-3 inline-block">
                Volver al Inicio
              </Link>
            </div>
          ) : (
            /* Checkout Form State */
            <div>
              <div className="mb-10 text-center md:text-left">
                <h1 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl text-[var(--lv2-ivory)]">
                  Finalizar Compra
                </h1>
                <p className="lv2-body text-sm text-[var(--lv2-taupe)] mt-2">
                  Completa tu información para procesar tu pedido
                </p>
              </div>

              <div className="grid gap-10 md:grid-cols-[1fr_350px]">
                
                {/* Left Column: Forms */}
                <form onSubmit={onSubmit} className="space-y-8">
                  
                  {/* Cart Overview */}
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
                              Cantidad: {item.quantity} · ${item.price.toLocaleString("es-CL")} CLP
                            </p>
                          </div>
                          <div className="font-bold text-sm text-[var(--lv2-ivory)]">
                            ${(item.price * item.quantity).toLocaleString("es-CL")} CLP
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Personal Information */}
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
                            placeholder="+56 9 XXXX XXXX"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address (Only if cart contains physical book) */}
                  {hasPhysicalBook && (
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
                              placeholder="Calle, número, departamento o block"
                            />
                          </label>
                        </div>
                        <div>
                          <label className="block">
                            <span className="lv2-form-label block mb-1">Región</span>
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
                          </label>
                        </div>
                        <div>
                          <label className="block">
                            <span className="lv2-form-label block mb-1">Comuna</span>
                            <input
                              type="text"
                              required
                              value={comuna}
                              onChange={(e) => setComuna(e.target.value)}
                              className="lv2-input rounded"
                              placeholder="Comuna de destino"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Methods */}
                  <div className="space-y-4">
                    <p className="lv2-section-label">Método de Pago</p>
                    <div className="border border-[var(--lv2-taupe)]/20 bg-[var(--lv2-ink)]/40 p-5 rounded flex items-start gap-4">
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#b8954a]">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#b8954a]" />
                      </div>
                      <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                          <h4 className="font-semibold text-sm text-[var(--lv2-ivory)] flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-[#0063FF]" />
                            Pago Seguro
                          </h4>
                          <p className="text-xs text-[var(--lv2-taupe)] mt-1">
                            Paga con tarjeta de crédito, débito o prepago de forma rápida y confiable.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="lv2-btn-gold w-full py-4 text-center flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? "Procesando pago seguro..." : `Pagar $${total.toLocaleString("es-CL")} CLP`}
                  </button>
                </form>

                {/* Right Column: Order Summary Card */}
                <div className="space-y-6">
                  <div className="bg-[var(--lv2-ink)]/45 border border-[var(--lv2-taupe)]/20 p-6 rounded-lg backdrop-blur-sm">
                    <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-[var(--lv2-ivory)] mb-4">
                      Resumen del Pedido
                    </h3>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--lv2-ivory-muted)]">Subtotal</span>
                        <span className="text-[var(--lv2-ivory)] font-medium">
                          ${subtotal.toLocaleString("es-CL")} CLP
                        </span>
                      </div>
                      
                      {hasPhysicalBook && (
                        <div className="flex justify-between">
                          <span className="text-[var(--lv2-ivory-muted)]">Envío</span>
                          <span className="text-[var(--lv2-ivory)] font-medium">
                            ${shippingCost.toLocaleString("es-CL")} CLP
                          </span>
                        </div>
                      )}
                      
                      <div className="h-[1px] bg-[var(--lv2-taupe)]/15 my-4" />
                      
                      <div className="flex justify-between items-center text-base font-bold">
                        <span className="text-[var(--lv2-ivory)]">Total</span>
                        <span className="text-lg text-[#f4efe4]">
                          ${total.toLocaleString("es-CL")} CLP
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-[var(--lv2-taupe)]/20 bg-black/10 p-4 rounded flex gap-3">
                    <Lock className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-xs text-[var(--lv2-ivory)]">
                        Transacción Encriptada
                      </h4>
                      <p className="text-[11px] text-[var(--lv2-taupe)] mt-1 leading-normal">
                        Tus datos personales y bancarios están totalmente protegidos. La transacción se realiza de forma directa a través de pasarelas de pago seguras y encriptadas.
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
