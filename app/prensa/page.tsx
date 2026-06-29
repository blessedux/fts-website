import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PRESS_ITEMS } from "@/lib/landing-v2/press"
import { CardsParallax } from "@/components/landing-v2/cards-parallax"

const CARD_BACKGROUNDS = [
  "#2D231E", // var(--lv2-espresso)
  "#3A2F28", // warm brown
  "#151210", // var(--lv2-void)
  "#44352D", // dark rust/brown
  "#261F1A", // deep espresso
]

export default function PrensaPage() {
  const mappedPressItems = PRESS_ITEMS.map((item, index) => ({
    title: item.caption || "Cobertura de prensa",
    description: item.alt,
    tag: "Prensa",
    src: item.src,
    link: item.url || "",
    color: CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length],
    textColor: "#F4EFE4",
  }))

  return (
    <article className="mx-auto max-w-6xl px-6 pb-24 md:px-10 md:pb-32">
      <Link
        href="/"
        className="lv2-body mb-12 inline-flex items-center gap-2 text-sm tracking-wide text-[var(--lv2-taupe)] transition-colors hover:text-[var(--lv2-ivory)]"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        Volver al inicio
      </Link>

      <header className="max-w-3xl mb-16">
        <p className="lv2-section-label mb-4">Prensa y medios</p>
        <h1 className="lv2-display text-3xl text-[var(--lv2-ivory)] md:text-5xl text-balance">
          Apariciones y cobertura internacional
        </h1>
        <div className="lv2-gold-line my-8 max-w-[120px]" />
        <p className="lv2-body text-lg md:text-xl">
          Explora la presencia de Fanny Torres Silva en radio, televisión, conferencias y
          prensa escrita de Chile y Latinoamérica.
        </p>
      </header>

      <div className="mt-12">
        <CardsParallax items={mappedPressItems} />
      </div>
    </article>
  )
}
