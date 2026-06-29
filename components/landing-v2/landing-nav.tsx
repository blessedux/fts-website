"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { CONSULTA_SECTION_ID } from "@/lib/landing-v2/constants"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react"
import {
  CartItem,
  getCartItems,
  updateCartQuantity,
  removeFromCart,
  getCartTotal,
  getCartCount,
  addToCart
} from "@/lib/landing-v2/cart"

const NAV_TITLE = "Fanny Torres Silva"

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Eneagrama", href: "/#eneagrama" },
  { label: "Eneatipos", href: "/#arquetipos" },
  { label: "Sobre mí", href: "/sobre-mi" },
  { label: "El Libro", href: "/libro" },
  { label: "Organizaciones", href: "/organizaciones" },
  { label: "Prensa", href: "/prensa" },
  { label: "Reservar Consulta", href: `/${CONSULTA_SECTION_ID}` },
]

function scrollToTop() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
}

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    setMounted(true)
    setCartItems(getCartItems())

    const onScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }

    const syncCart = () => {
      setCartItems(getCartItems())
    }

    const openMenuCart = () => {
      setIsOpen(true)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("fts-evershop-cart-updated", syncCart)
    window.addEventListener("fts-evershop-cart-open", openMenuCart)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("fts-evershop-cart-updated", syncCart)
      window.removeEventListener("fts-evershop-cart-open", openMenuCart)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const isInitial = (index: number) => index === 0 || index === 6 || index === 13
  const isSpace = (index: number) => NAV_TITLE[index] === " "

  const totalItems = mounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0
  const subtotal = mounted ? getCartTotal() : 0

  const handleAddBookQuickly = () => {
    addToCart({
      id: "libro-eneagrama",
      name: "El Libro Oficial de Eneagrama",
      price: 24990,
      image: "/imgs/portada_libro_final.png",
    })
  }

  return (
    <>
      <header className="lv2-nav fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:h-20 md:px-10">
          <Link
            href="/"
            className={cn(
              "font-[family-name:var(--font-cormorant)] text-lg tracking-[0.2em] text-[var(--lv2-ivory)] uppercase md:text-xl transition-all duration-500 z-50 whitespace-nowrap flex-shrink-0",
              isScrolled && "lv2-logo-collapsed"
            )}
            aria-label={NAV_TITLE}
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault()
                scrollToTop()
              }
              setIsOpen(false)
            }}
          >
            {NAV_TITLE.split("").map((char, index) => {
              const initial = isInitial(index)
              const space = isSpace(index)
              return (
                <span
                  key={`${char}-${index}`}
                  className={cn(
                    "lv2-nav-char",
                    initial ? "lv2-logo-initial" : space ? "lv2-logo-fade-space" : "lv2-logo-fade-letter"
                  )}
                  aria-hidden={!initial && isScrolled}
                >
                  {space ? "\u00A0" : char}
                </span>
              )
            })}
          </Link>

          <div className="flex items-center gap-4 z-50">
            <Link
              href={`/${CONSULTA_SECTION_ID}`}
              className="lv2-nav-cta lv2-btn-gold hidden sm:inline-flex"
            >
              Reservar
            </Link>

            {/* Burger Toggle */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="relative flex h-10 w-10 flex-col items-center justify-center rounded border border-[var(--lv2-taupe)]/30 bg-black/20 hover:bg-[#b8954a]/10 hover:border-[#b8954a]/60 transition-all duration-300 text-[var(--lv2-ivory)]"
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isOpen ? (
                <X className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <div className="relative">
                  <Menu className="h-5 w-5" strokeWidth={1.5} />
                  {mounted && totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#b8954a] text-[10px] font-bold text-[var(--lv2-void)]">
                      {totalItems}
                    </span>
                  )}
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-Down Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#1a0c04]/99 backdrop-blur-md pt-24 pb-12 px-6 overflow-y-auto border-b border-[#b8954a]/15 flex flex-col"
          >
            <div className="mx-auto max-w-6xl w-full flex-1 flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16 pt-6 lg:pt-12">
              
              {/* Left Column: Navigation Links */}
              <div className="w-full lg:w-1/2 flex flex-col">
                <p className="lv2-section-label mb-6 text-[#b8954a]/85 font-semibold">Navegación</p>
                <nav className="flex flex-col gap-2">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="font-[family-name:var(--font-cormorant)] text-2xl sm:text-3xl lg:text-4xl tracking-wider text-[var(--lv2-ivory)] hover:text-[#b8954a] transition-all duration-300 py-1 flex items-center group"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="h-[1.5px] w-0 bg-[#b8954a] mr-0 opacity-0 group-hover:w-4 group-hover:mr-3 group-hover:opacity-100 transition-all duration-300" />
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Right Column: Cart Container */}
              <div className="w-full lg:w-1/2 lg:max-w-md bg-[var(--lv2-ink)]/50 border border-[var(--lv2-taupe)]/20 p-6 rounded-lg backdrop-blur-sm flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingBag className="h-5 w-5 text-[#b8954a]" />
                  </div>
                  <div className="h-[1px] w-full bg-[var(--lv2-taupe)]/20 mt-2" />
                </div>

                {mounted && cartItems.length === 0 ? (
                  /* Empty Cart View - no "empty cart" text mentioned */
                  <div className="flex flex-col items-center py-6 text-center">
                    
                    {/* Quick Add Product Card */}
                    <div className="w-full border border-[var(--lv2-taupe)]/10 bg-black/10 p-4 rounded flex items-center gap-4">
                      <div className="relative h-20 w-16 bg-black/20 flex-shrink-0">
                        <Image
                          src="/imgs/portada_libro_final.png"
                          alt="Portada del libro"
                          fill
                          className="object-contain"
                          sizes="64px"
                        />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-[var(--lv2-ivory)] truncate">
                          El Libro Oficial de Eneagrama
                        </h4>
                        <p className="text-xs text-[var(--lv2-taupe)] mt-0.5">
                          Por Fanny Torres Silva
                        </p>
                        <p className="text-sm font-bold text-[#f4efe4] mt-1">
                          $24.990 CLP
                        </p>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleAddBookQuickly}
                      className="lv2-btn-gold w-full mt-6 flex items-center justify-center gap-2 py-3"
                    >
                      Agregar Libro
                    </button>
                  </div>
                ) : (
                  /* Active Cart View */
                  <div className="flex flex-col gap-4">
                    <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1">
                      {mounted && cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 border-b border-[var(--lv2-taupe)]/10 pb-4"
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
                            <h4 className="font-semibold text-xs text-[var(--lv2-ivory)] truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-[var(--lv2-taupe)] mt-0.5">
                              ${item.price.toLocaleString("es-CL")} CLP
                            </p>
                            
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                className="h-6 w-6 rounded border border-[var(--lv2-taupe)]/30 flex items-center justify-center text-[var(--lv2-ivory)] hover:border-[#b8954a]"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-xs font-semibold px-2 w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                className="h-6 w-6 rounded border border-[var(--lv2-taupe)]/30 flex items-center justify-center text-[var(--lv2-ivory)] hover:border-[#b8954a]"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-[var(--lv2-taupe)] hover:text-red-400 transition-colors"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Summary and Pay */}
                    <div className="mt-4 pt-4 border-t border-[var(--lv2-taupe)]/20">
                      <div className="flex justify-between items-center text-sm font-semibold mb-6">
                        <span className="text-[var(--lv2-ivory-muted)]">Subtotal</span>
                        <span className="text-lg text-[var(--lv2-ivory)]">
                          ${subtotal.toLocaleString("es-CL")} CLP
                        </span>
                      </div>

                      <Link
                        href="/checkout"
                        onClick={() => setIsOpen(false)}
                        className="lv2-btn-gold w-full flex items-center justify-center gap-2 py-3 text-center"
                      >
                        Proceder al Pago
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
