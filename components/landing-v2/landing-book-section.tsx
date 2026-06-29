"use client"

import Image from "next/image"
import Link from "next/link"
import { BOOK_FEATURES } from "@/lib/landing-v2/book"
import { addToCart } from "@/lib/landing-v2/cart"

type LandingBookSectionProps = {
  titleTag?: "h1" | "h2"
  showTopBorder?: boolean
  /** En sobre-mi enlaza a /libro; en /libro muestra botón de compra */
  embedded?: boolean
  detallesHref?: string
}

export function LandingBookSection({
  titleTag = "h2",
  showTopBorder = true,
  embedded = false,
  detallesHref = "#detalles",
}: LandingBookSectionProps) {
  const Title = titleTag

  return (
    <section
      className={
        showTopBorder
          ? "mt-24 border-t border-[var(--lv2-taupe)]/20 pt-24 md:mt-32 md:pt-32"
          : ""
      }
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="relative mx-auto h-[420px] w-full max-w-[320px] sm:max-w-[375px] lg:mx-0 lg:ml-auto">
          <Image
            src="/imgs/portada_libro_final.png"
            alt="Libro de Eneagrama por Fanny Torres Silva"
            fill
            sizes="(max-width: 768px) 90vw, 375px"
            className="object-contain"
          />
        </div>

        <div>
          <p className="lv2-section-label mb-4">Publicación</p>
          <Title className="lv2-display text-3xl text-[var(--lv2-ivory)] md:text-4xl md:text-5xl">
            El libro oficial de Eneagrama
          </Title>
          <p className="lv2-body mt-3 text-base text-[var(--lv2-taupe)]">Por Fanny Torres Silva</p>
          <div className="lv2-gold-line my-8 max-w-[120px]" />
          <p className="lv2-body text-lg">
            Lleva contigo los conocimientos del Eneagrama en este libro completo — una guía para leer
            patrones, historia y transformación personal.
          </p>

          <ul className="mt-8 space-y-3">
            {BOOK_FEATURES.map((item) => (
              <li key={item} className="lv2-body flex gap-3 text-base">
                <span className="shrink-0 text-[var(--lv2-taupe)]" aria-hidden>
                  ◆
                </span>
                {item}
              </li>
            ))}
          </ul>

          <p className="lv2-body mt-6 text-sm text-[var(--lv2-taupe)]">
            Envío a todo Chile. Tiempo estimado de entrega: 3–5 días hábiles.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            {embedded ? (
              <Link href="/libro" className="lv2-btn-gold">
                Comprar ahora
              </Link>
            ) : (
              <button
                type="button"
                className="lv2-btn-gold"
                onClick={() =>
                  addToCart({
                    id: "libro-eneagrama",
                    name: "El Libro Oficial de Eneagrama",
                    price: 24990,
                    image: "/imgs/portada_libro_final.png",
                  })
                }
              >
                Comprar ahora
              </button>
            )}
            <Link
              href={embedded ? "/libro#detalles" : detallesHref}
              className="lv2-btn-outline"
            >
              Ver detalles
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
