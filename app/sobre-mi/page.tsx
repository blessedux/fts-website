import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { LandingBookSection } from "@/components/landing-v2/landing-book-section"
import { CONSULTA_SECTION_ID } from "@/lib/landing-v2/constants"

function Em({ children }: { children: ReactNode }) {
  return <span className="lv2-inline-emphasis">{children}</span>
}

export default function BioPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 pb-24 md:px-10 md:pb-32">
      <Link
        href="/"
        className="lv2-body mb-12 inline-flex items-center gap-2 text-sm tracking-wide text-[var(--lv2-taupe)] transition-colors hover:text-[var(--lv2-ivory)]"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        Volver al inicio
      </Link>

      <div className="grid gap-16 md:grid-cols-2 md:items-start md:gap-20">
        <div className="order-2 space-y-8 md:order-1">
          <div>
            <p className="lv2-section-label mb-4">Sobre Fanny Torres</p>
            <h1 className="lv2-display text-3xl text-[var(--lv2-ivory)] md:text-5xl">
              El recorrido completo
            </h1>
            <div className="lv2-gold-line my-8 max-w-[120px]" />
          </div>

          <div className="space-y-6">
            <p className="lv2-body text-lg">
              <Em>Fanny Torres Silva</Em> es una destacada <Em>Eneagramista</Em> y experta en{" "}
              <Em>desarrollo personal</Em>, cuyo viaje profesional y académico refleja una pasión
              profunda por el <Em>autoconocimiento</Em> y la <Em>transformación</Em>.
            </p>
            <p className="lv2-body text-lg">
              Su carrera comenzó en <Em>Chile</Em>, donde se formó como profesora, y pronto expandió
              sus horizontes en <Em>Educación para la Creatividad</Em> en Londres. Su sed de
              conocimiento la llevó a estudiar en <Em>Estados Unidos</Em>, donde se certificó en{" "}
              <Em>Programación Neurolingüística (PNL)</Em> e <Em>hipnosis Ericksoniana</Em>,
              herramientas clave que enriquecen su enfoque del eneagrama.
            </p>
            <p className="lv2-body text-lg">
              Actualmente, Fanny continúa su formación en <Em>Psicoanálisis</Em> en{" "}
              <Em>Buenos Aires</Em>, integrando un enfoque <Em>multidisciplinario</Em> en su
              práctica. Su amor por la <Em>mitología griega</Em> y su fascinación por la lectura no
              solo han forjado su perspectiva profesional, sino que también constituyen los pilares
              de su vida personal.
            </p>
            <p className="lv2-body text-lg">
              Como autora, fusiona su entusiasmo por el aprendizaje con un firme compromiso con el{" "}
              <Em>desarrollo personal</Em>. Su enfoque <Em>innovador</Em> y su vasta experiencia
              hacen que su trabajo sea una guía invaluable para quienes buscan una comprensión más
              profunda de sí mismos y desean transformar sus vidas de manera significativa.
            </p>
          </div>

          <div className="pt-4">
            <Link href={`/${CONSULTA_SECTION_ID}`} className="lv2-btn-gold">
              Reservar consulta
            </Link>
          </div>
        </div>

        <div className="relative order-1 aspect-[4/5] w-full max-w-md mx-auto overflow-hidden border border-[var(--lv2-taupe)]/30 md:order-2 md:ml-auto md:mr-0">
          <Image
            src="/imgs/DSC_0198.jpg"
            alt="Fanny Torres Silva — retrato editorial"
            fill
            className="object-cover object-top grayscale-[20%] contrast-[1.05]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--lv2-void)] via-transparent to-[var(--lv2-void)]/40" />
        </div>
      </div>

      <LandingBookSection embedded />
    </article>
  )
}
