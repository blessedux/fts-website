import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { PRESS_ITEMS } from "@/lib/landing-v2/press"
import { EneagramaMap } from "@/components/landing-v2/svg/eneagrama-map"
import { ENTERPRISE_INQUIRY_EMAIL } from "@/lib/landing-v2/constants"
import {
  ORG_ENEAGRAM_POINTS,
  ORG_FORMATS,
  ORG_SERVICES,
} from "@/lib/landing-v2/organizaciones"

const ENTERPRISE_MAILTO = `mailto:${ENTERPRISE_INQUIRY_EMAIL}?subject=Charlas%20de%20eneagrama%20para%20empresas`

export default function OrganizacionesPage() {
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

      <section className="mt-20 grid gap-12 border-t border-[var(--lv2-taupe)]/20 pt-16 md:grid-cols-2 md:items-center md:gap-16">
        <div className="flex justify-center [&_svg]:overflow-visible">
          <EneagramaMap
            tone="light"
            className="w-full max-w-[min(80vw,320px)] md:max-w-[360px]"
          />
        </div>
        <div>
          <p className="lv2-section-label mb-4">El eneagrama</p>
          <h2 className="lv2-display text-3xl text-[var(--lv2-ivory)] md:text-4xl">
            Un mapa colectivo, no una etiqueta
          </h2>
          <div className="lv2-gold-line my-8 max-w-[120px]" />
          <p className="lv2-body text-lg">
            En contextos organizacionales, el eneagrama ofrece un lenguaje para observar
            cómo cada persona responde bajo presión, qué necesita para colaborar y dónde
            aparecen los conflictos recurrentes.
          </p>
          <ul className="mt-8 space-y-3">
            {ORG_ENEAGRAM_POINTS.map((item) => (
              <li key={item} className="lv2-body flex gap-3 text-base">
                <span className="shrink-0 text-[var(--lv2-taupe)]" aria-hidden>
                  ◆
                </span>
                {item}
              </li>
            ))}
          </ul>
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
        <div className="relative min-h-[280px] md:min-h-[360px]">
          <Image
            src="/imgs/prensa5.png"
            alt="Workshop de eneagrama para ejecutivos"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--lv2-void)]/30 to-transparent md:bg-gradient-to-t md:from-[var(--lv2-void)]/50 md:to-transparent" />
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

        <div className="mx-auto mt-12 max-w-lg">
          <article className="lv2-offering-card overflow-hidden p-0">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={PRESS_ITEMS[0].src}
                alt={PRESS_ITEMS[0].alt}
                fill
                sizes="(max-width: 768px) 100vw, 512px"
                className="object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--lv2-void)] via-[var(--lv2-void)]/20 to-transparent" />
            </div>
            <div className="flex flex-col items-center gap-5 px-8 py-10 text-center">
              <p className="lv2-body text-base md:text-lg">
                Más de {PRESS_ITEMS.length} apariciones en radio, televisión,
                universidades y prensa escrita. Explora la cobertura completa en la
                galería interactiva.
              </p>
              <Link
                href="/prensa"
                className="lv2-btn-gold inline-flex items-center gap-2"
              >
                Ver página de prensa
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </Link>
            </div>
          </article>
        </div>
      </section>
    </article>
  )
}
