import Image from "next/image"
import Link from "next/link"

const HIGHLIGHTS = [
  "Formación en psicoanálisis y desarrollo humano",
  "Profesora de literatura y escritora",
  "Enfoque integrador y simbólico",
  "Trabajo profundo con el Eneagrama como mapa interior"
] as const

export function LandingAbout() {
  return (
    <section id="guia" className="relative border-t border-[#b8954a]/15 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-2 md:items-center md:gap-20 md:px-10">
        <div className="order-2 md:order-1">
          <p className="lv2-section-label mb-4">Sobre Fanny Torres</p>
          <h2 className="lv2-display text-3xl text-[#f4efe4] md:text-4xl">
            Una guía para el trabajo interior
          </h2>
          <div className="lv2-gold-line my-8 max-w-[120px]" />
          <p className="lv2-body text-lg mb-8">
            Psicoanálisis y eneagrama para quienes buscan comprender profundamente
            su historia, sus patrones y su propósito, no solo sentirse mejor, sino entender quién son.
          </p>
          <ul className="space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="lv2-body flex gap-3 text-base">
                <span className="text-[#b8954a] shrink-0" aria-hidden>
                  ◆
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="lv2-body mt-8 text-base">
            Formación en Chile, Londres y Buenos Aires. Integra psicoanálisis y Eneagrama como una mirada simbolica del desarrollo huamno.
          </p>
          <Link
            href="/sobre-mi"
            className="lv2-btn-outline mt-10 inline-block"
          >
            Conocer el recorrido completo
          </Link>
        </div>

        <div className="relative order-1 aspect-[4/5] w-full max-w-md mx-auto overflow-hidden border border-[var(--lv2-taupe)]/30 md:order-2 md:mx-0 md:ml-auto">
          <Image
            src="/imgs/DSC_0198.jpg"
            alt="Fanny Torres Da Silva — retrato editorial"
            fill
            className="object-cover object-top grayscale-[20%] contrast-[1.05]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--lv2-void)] via-transparent to-[var(--lv2-void)]/40" />
        </div>
      </div>
    </section>
  )
}
