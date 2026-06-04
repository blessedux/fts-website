import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { LandingBookSection } from "@/components/landing-v2/landing-book-section"
import { BOOK_CONTENT_ITEMS, BOOK_PRODUCT_DETAILS } from "@/lib/landing-v2/book"

export default function BookPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 pb-24 md:px-10 md:pb-32">
      <Link
        href="/sobre-mi"
        className="lv2-body mb-12 inline-flex items-center gap-2 text-sm tracking-wide text-[var(--lv2-taupe)] transition-colors hover:text-[var(--lv2-ivory)]"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        Volver
      </Link>

      <LandingBookSection titleTag="h1" showTopBorder={false} embedded={false} />

      <section id="detalles" className="mt-24 border-t border-[var(--lv2-taupe)]/20 pt-24 md:mt-32 md:pt-32">
        <div className="mx-auto max-w-3xl">
          <p className="lv2-section-label mb-4">Detalles</p>
          <h2 className="lv2-display text-3xl text-[var(--lv2-ivory)] md:text-4xl">Descripción</h2>
          <div className="lv2-gold-line my-8 max-w-[120px]" />
          <div className="lv2-body space-y-6 text-lg">
            <p>
              Este libro es una guía completa para comprender y aplicar el eneagrama en la vida
              cotidiana. Escrito por Fanny Torres Da Silva, recorre nueve tipos de personalidad, sus
              motivaciones, miedos, deseos y patrones de comportamiento.
            </p>
            <p>
              A través de sus páginas descubrirás cómo identificar tu tipo principal y cómo influye
              en tus relaciones, tu trabajo y tu desarrollo personal — con una mirada profunda, no
              reducida a etiquetas.
            </p>
          </div>

          <h2 className="lv2-display mt-16 text-2xl text-[var(--lv2-ivory)] md:text-3xl">Contenido</h2>
          <ul className="mt-6 space-y-3">
            {BOOK_CONTENT_ITEMS.map((item) => (
              <li key={item} className="lv2-body flex gap-3 text-base">
                <span className="shrink-0 text-[var(--lv2-taupe)]" aria-hidden>
                  ◆
                </span>
                {item}
              </li>
            ))}
          </ul>

          <h2 className="lv2-display mt-16 text-2xl text-[var(--lv2-ivory)] md:text-3xl">
            Detalles del producto
          </h2>
          <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {BOOK_PRODUCT_DETAILS.map(({ label, value }) => (
              <div key={label}>
                <dt className="font-[family-name:var(--font-hero-sans)] text-xs font-semibold uppercase tracking-[0.14em] text-[var(--lv2-taupe)]">
                  {label}
                </dt>
                <dd className="lv2-body mt-1 text-base">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-20">
            <h2 className="lv2-display text-2xl text-[var(--lv2-ivory)] md:text-3xl">
              Previsualiza el libro
            </h2>
            <div className="lv2-gold-line my-8 max-w-[120px]" />
            <div className="h-[min(70vh,600px)] overflow-hidden border border-[var(--lv2-taupe)]/30 bg-[var(--lv2-espresso)]/30">
              <iframe
                src="/imgs/Torres%20Silva_Fanny%2022-12-23%20tapa.pdf"
                title="Previsualización del libro Eneagrama"
                width="100%"
                height="100%"
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
