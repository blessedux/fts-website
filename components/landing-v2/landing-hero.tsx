import { CONSULTA_SECTION_ID } from "@/lib/landing-v2/constants"

export function LandingHeroPanel() {
  return (
    <div className="lv2-hero-panel mx-auto max-w-6xl px-6 pb-14 md:px-10 md:pb-16">
      <p className="lv2-section-label mb-3 max-w-xl">
        Psicoanálisis · Eneagrama · Acompañamiento terapéutico
      </p>

      <h1 className="lv2-hero-title max-w-4xl">
        Toda transformación comienza
        <br />
        <span className="lv2-hero-title-closing">
          {" con una "}
          <span className="lv2-hero-title-accent">pregunta</span>.
        </span>
      </h1>

      <p className="lv2-body mt-8 max-w-2xl text-lg md:text-xl">
        Psicoanálisis, eneagrama y acompañamiento terapéutico para quienes desean comprender su
        historia, transformar patrones profundos y construir una vida más consciente.
      </p>

      <div className="mt-10">
        <a href={CONSULTA_SECTION_ID} className="lv2-btn-gold">
          Reserva una consulta inicial
        </a>
      </div>
    </div>
  )
}

/** @deprecated Use HeroVideoRevealBlock on the landing page */
export function LandingHero() {
  return <LandingHeroPanel />
}
