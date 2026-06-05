import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { LandingPressInfinite } from "@/components/landing-v2/landing-press-infinite"

export default function PrensaPage() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-6 pt-6 md:px-10 md:pt-8">
        <Link
          href="/organizaciones"
          className="lv2-body pointer-events-auto mb-6 inline-flex items-center gap-2 text-sm tracking-wide text-[var(--lv2-taupe)] transition-colors hover:text-[var(--lv2-ivory)]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          Volver a organizaciones
        </Link>

        <header className="mx-auto max-w-2xl text-center">
          <p className="lv2-section-label mb-3">Prensa y medios</p>
          <h1 className="lv2-display text-2xl text-[var(--lv2-ivory)] md:text-4xl">
            Apariciones y cobertura
          </h1>
          <p className="lv2-body mt-4 text-sm md:text-base">
            Arrastra o desplázate para explorar. Haz clic en una imagen con enlace
            para leer la nota completa.
          </p>
        </header>
      </div>

      <LandingPressInfinite />
    </div>
  )
}
