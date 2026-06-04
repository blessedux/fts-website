import Image from "next/image"
import { EneagramaMap } from "@/components/landing-v2/svg/eneagrama-map"

const BIOMBO_BG = {
  src: "/imgs/biombo_bg.webp",
  width: 1402,
  height: 1122,
} as const

export function LandingEneagrama() {
  return (
    <section id="eneagrama" className="lv2-eneagrama relative isolate border-t border-[var(--lv2-espresso)]">
      <div className="lv2-eneagrama-media relative w-full leading-[0]">
        <div className="lv2-eneagrama-bg-layer relative w-full">
          <Image
            src={BIOMBO_BG.src}
            alt=""
            width={BIOMBO_BG.width}
            height={BIOMBO_BG.height}
            className="lv2-eneagrama-bg-image"
            sizes="100vw"
            priority={false}
          />
        </div>

        <div className="lv2-eneagrama-content absolute inset-0 z-10 flex min-h-0 items-center px-6 py-14 md:px-10 md:py-16">
          <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-2 md:items-center md:gap-16">
            <div className="flex justify-center [&_svg]:overflow-visible">
              <EneagramaMap className="w-full max-w-[360px] text-[var(--lv2-espresso)]" />
            </div>
            <div className="lv2-eneagrama-copy relative">
              <div className="lv2-eneagrama-text-veil" aria-hidden />
              <p className="lv2-section-label mb-4">El eneagrama</p>
              <h2 className="lv2-display text-3xl text-[var(--lv2-ivory)] md:text-4xl">
                Un mapa, no una etiqueta
              </h2>
              <div className="lv2-gold-line my-8 max-w-[120px]" />
              <p className="lv2-body text-lg">
                No una personalidad cerrada. Un lenguaje para observar patrones automáticos,
                mecanismos de defensa y potenciales caminos de crecimiento.
              </p>
              <p className="lv2-body mt-6 text-base italic text-[var(--lv2-taupe)]">
                El eneagrama no te define. Te orienta hacia lo que aún no has podido ver con
                claridad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
