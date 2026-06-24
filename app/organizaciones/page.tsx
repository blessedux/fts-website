import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PRESS_ITEMS } from "@/lib/landing-v2/press"
import { CardsParallax } from "@/components/landing-v2/cards-parallax"
import { ENTERPRISE_INQUIRY_EMAIL } from "@/lib/landing-v2/constants"
import {
  ORG_ENEAGRAM_POINTS,
  ORG_FORMATS,
  ORG_SERVICES,
} from "@/lib/landing-v2/organizaciones"

const ENTERPRISE_MAILTO = `mailto:${ENTERPRISE_INQUIRY_EMAIL}?subject=Charlas%20de%20eneagrama%20para%20empresas`

const CARD_BACKGROUNDS = [
  "#2D231E", // var(--lv2-espresso)
  "#3A2F28", // warm brown
  "#151210", // var(--lv2-void)
  "#44352D", // dark rust/brown
  "#261F1A", // deep espresso
]

export default function OrganizacionesPage() {
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

      <header className="max-w-3xl">
        <p className="lv2-section-label mb-4">Organizaciones</p>
        <h1 className="lv2-display text-3xl text-[var(--lv2-ivory)] md:text-5xl text-balance">
          Eneagrama para equipos, liderazgo y cultura
        </h1>
        <div className="lv2-gold-line my-8 max-w-[120px]" />
        <p className="lv2-body text-lg md:text-xl">
          Talleres y charlas para organizaciones que buscan una mirada profunda sobre
          comunicación, roles y dinámicas colectivas — sin reducir personas a etiquetas.
        </p>
      </header>

      <section className="mt-20 relative overflow-hidden min-h-[480px] flex items-stretch bg-[var(--lv2-void)] -ml-4 md:-ml-8 lg:-ml-16">
        {/* Left Side Image Container (65% on desktop) with Gradient Fade to Right */}
        <div className="absolute left-0 top-0 bottom-0 w-full md:w-[65%] z-0">
          <Image
            src="/imgs/organizaciones.webp"
            alt="Eneagrama para áreas comerciales y ventas"
            fill
            className="object-cover object-left"
            sizes="(max-width: 768px) 100vw, 750px"
          />
          {/* Gradient fading to solid void on the right (desktop) or bottom (mobile) - shifting fade left to avoid text overlay */}
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-transparent via-transparent via-[55%] md:via-[75%] to-[var(--lv2-void)] z-10" />
        </div>

        {/* Overlay Grid Container (12-column layout) */}
        <div className="relative z-20 w-full grid md:grid-cols-12">
          {/* Left space (reveals background picture on desktop) */}
          <div className="hidden md:block md:col-span-7 lg:col-span-8" aria-hidden />

          {/* Right column (solid overlay on mobile, transparent on desktop) */}
          <div className="flex flex-col justify-center p-8 md:p-12 md:pl-4 bg-[var(--lv2-void)] md:bg-transparent md:col-span-5 lg:col-span-4">
            <p className="lv2-section-label mb-4">El eneagrama</p>
            <h2 className="lv2-display text-3xl text-[var(--lv2-ivory)] md:text-4xl">
              Un motor de sintonía comercial y relacional
            </h2>
            <div className="lv2-gold-line my-8 max-w-[120px]" />
            <p className="lv2-body text-lg text-[#f4efe4]/90">
              El Eneagrama es una herramienta excepcionalmente potente por ejemplo para áreas comerciales porque, en su esencia, las ventas no son solo un proceso técnico; son un <em className="italic text-[var(--lv2-taupe)]">proceso relacional y de sintonía emocional</em>.
            </p>
            <p className="lv2-body text-lg mt-4 text-[#f4efe4]/90">
              Tradicionalmente, la capacitación en ventas se enfoca en el saber hacer (técnicas de cierre, manejo de objeciones). El Eneagrama interviene en el ser, permitiendo que un vendedor comprenda su propio motor motivacional.
            </p>
            <ul className="mt-8 space-y-3">
              {ORG_ENEAGRAM_POINTS.map((item) => (
                <li key={item} className="lv2-body flex gap-3 text-base text-[#f4efe4]/95">
                  <span className="shrink-0 text-[var(--lv2-taupe)]" aria-hidden>
                    ◆
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-20 border-t border-[var(--lv2-taupe)]/20 pt-16">
        <div className="max-w-2xl">
          <p className="lv2-section-label mb-4">El servicio</p>
          <h2 className="lv2-display text-3xl text-[var(--lv2-ivory)] md:text-4xl">
            Charlas y talleres a medida
          </h2>
          <div className="lv2-gold-line my-8 max-w-[120px]" />
          <p className="lv2-body text-lg">
            Cada propuesta se adapta al tamaño del equipo, el objetivo de la organización
            y el nivel de familiaridad con el eneagrama.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ORG_SERVICES.map((service) => (
            <article key={service.id} className="lv2-offering-card flex flex-col">
              <h3 className="lv2-display text-2xl text-[var(--lv2-ivory)]">
                {service.title}
              </h3>
              <div className="lv2-gold-line my-6 max-w-[80px]" />
              <p className="lv2-body flex-1 text-base">{service.description}</p>
            </article>
          ))}
        </div>

        <ul className="mt-10 flex flex-wrap gap-2">
          {ORG_FORMATS.map(({ place, mode }) => (
            <li key={place} className="lv2-offering-tag">
              {place}
              {mode ? <span className="lv2-offering-tag-mode"> · {mode}</span> : null}
            </li>
          ))}
        </ul>

        <a href={ENTERPRISE_MAILTO} className="lv2-btn-gold mt-10 inline-flex">
          Consultar charlas
        </a>
      </section>

      <section className="mt-20 overflow-hidden border border-[var(--lv2-taupe)]/25 md:grid md:grid-cols-2">
        <div 
          className="relative min-h-[280px] md:min-h-[360px] aspect-video md:aspect-auto bg-cover bg-center bg-[var(--lv2-espresso)]"
          style={{ backgroundImage: "url('/imgs/prensa5.png')" }}
        >
          <iframe
            src="https://www.youtube.com/embed/Uz5Eo33R3hc"
            title="Experiencia Fanny Torres Silva"
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="flex flex-col justify-center bg-[var(--lv2-espresso)]/35 p-8 md:p-10">
          <p className="lv2-section-label mb-4">Experiencia</p>
          <h2 className="lv2-display text-2xl text-[var(--lv2-ivory)] md:text-3xl">
            Acompañamiento con trayectoria en medios y formación
          </h2>
          <p className="lv2-body mt-6 text-base">
            Fanny Torres Silva combina eneagrama, psicoanálisis y una mirada simbólica del
            desarrollo humano en charlas, talleres y conferencias para equipos en Chile,
            Argentina e internacionalmente.
          </p>
        </div>
      </section>

      <section className="mt-20 border-t border-[var(--lv2-taupe)]/20 pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="lv2-section-label mb-4">Prensa</p>
          <h2 className="lv2-display text-3xl text-[var(--lv2-ivory)] md:text-4xl">
            Reconocida en medios y conferencias
          </h2>
          <p className="lv2-body mt-6 text-lg">
            Apariciones en radio, televisión, universidades y prensa escrita en Chile y
            Latinoamérica.
          </p>
        </div>

        <div className="mt-6 md:mt-12">
          <CardsParallax items={mappedPressItems} />
        </div>
      </section>
    </article>
  )
}
