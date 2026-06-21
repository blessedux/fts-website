"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const BIOMBO_BG = {
  src: "/imgs/biombo_bg.webp",
  width: 1402,
  height: 1122,
} as const

// Map vertices to their connected lines in Enneagram
const VERTEX_CONNECTIONS: Record<number, string[]> = {
  1: ["l17", "l41"],
  2: ["l82", "l24"],
  3: ["l36", "l93"],
  4: ["l24", "l41"],
  5: ["l75", "l58"],
  6: ["l36", "l69"],
  7: ["l17", "l75"],
  8: ["l58", "l82"],
  9: ["l69", "l93"],
}

interface EneatipoContent {
  title: string
  description: string
  quote: string
}

const ENEATIPO_INFO: Record<number, EneatipoContent> = {
  1: {
    title: "1 · El Reformista",
    description: "Racional, disciplinado y auto-exigente. Busca la perfección, el orden y la rectitud moral, temiendo el error o la imperfección en sí mismo y en su entorno.",
    quote: "Orientado a hacer lo correcto, corregir errores y mejorar continuamente."
  },
  2: {
    title: "2 · El Ayudante",
    description: "Empático, afectuoso y complaciente. Orientado a satisfacer las necesidades ajenas para sentirse apreciado, a veces descuidando su propia autonomía y bienestar.",
    quote: "Busca conectar sinceramente, ser valorado y sentirse necesitados."
  },
  3: {
    title: "3 · El Realizador",
    description: "Pragmático, eficiente y enfocado en el éxito. Busca estatus y reconocimiento social a través del rendimiento sobresaliente, los logros y una imagen impecable.",
    quote: "Orientado a la productividad, la eficacia y la realización de objetivos."
  },
  4: {
    title: "4 · El Individualista",
    description: "Sensible, expresivo y temperamental. Desea ser auténtico, único y fiel a su identidad íntima, viviendo el mundo desde una gran profundidad y melancolía emocional.",
    quote: "Valora la singularidad personal, la expresión artística y la profundidad del alma."
  },
  5: {
    title: "5 · El Investigador",
    description: "Observador, analítico y reservado. Busca comprender cómo funciona el mundo en profundidad, acumulando conocimiento y protegiendo celosamente su tiempo y energía mental.",
    quote: "Busca el saber absoluto, la autosuficiencia y la competencia intelectual."
  },
  6: {
    title: "6 · El Leal",
    description: "Comprometido, cauteloso y orientado a la seguridad. Anticipa escenarios problemáticos y amenazas para protegerse a sí mismo y a su comunidad de los riesgos futuros.",
    quote: "Valora la confianza mutua, el apoyo grupal, el orden y la preparación."
  },
  7: {
    title: "7 · El Entusiasta",
    description: "Optimista, espontáneo y versátil. Busca estímulos agradables, múltiples opciones abiertas y nuevas experiencias emocionantes para evitar el dolor físico, el aburrimiento o el vacío.",
    quote: "Busca disfrutar de la libertad y mantener siempre un horizonte lleno de posibilidades."
  },
  8: {
    title: "8 · El Desafiador",
    description: "Fuerte, directo y protector. Valora el control sobre su propio destino y su entorno inmediato, defendiendo su autonomía con pasión frente a cualquier asomo de vulnerabilidad.",
    quote: "Busca ser fuerte, tener el control y defender la justicia y a los suyos."
  },
  9: {
    title: "9 · El Pacificador",
    description: "Receptivo, armonizador y conciliador. Evita los conflictos internos y externos a toda costa para mantener la tranquilidad, la conexión con los demás y la paz del espíritu.",
    quote: "Busca la armonía absoluta, la unión integradora y evitar cualquier tipo de fragmentación."
  }
}

const DEFAULT_INFO: EneatipoContent = {
  title: "Un mapa, no una etiqueta",
  description: "Un lenguaje para observar patrones automáticos, mecanismos de defensa y potenciales caminos de crecimiento.",
  quote: "El Eneagrama no te define. Te orienta hacia lo que aún no has podido ver con claridad."
}

// Simple typewriter component for smooth interactive reading
function TypewriterText({ text, speed = 15 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    setDisplayedText("")
    let index = 0
    let isCancelled = false

    const interval = setInterval(() => {
      if (isCancelled) return
      
      const char = text.charAt(index)
      setDisplayedText((prev) => prev + char)
      
      index++
      if (index >= text.length) {
        clearInterval(interval)
      }
    }, speed)

    return () => {
      isCancelled = true
      clearInterval(interval)
    }
  }, [text, speed])

  return <span>{displayedText}</span>
}

export function LandingEneagrama() {
  const [activeDot, setActiveDot] = useState<number | null>(null)
  const [scrollScale, setScrollScale] = useState(0.85)
  const [scrollTranslateY, setScrollTranslateY] = useState(0)

  // Listen to scroll events on the parent bridge section to scale/shift the diagram
  useEffect(() => {
    const handleScroll = () => {
      const group = document.querySelector("[data-lv2-bridge]")
      if (!group) return

      const groupRect = group.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const totalHeight = groupRect.height
      const scrolled = -groupRect.top

      let progress = scrolled / (totalHeight - viewportHeight)
      progress = Math.max(0, Math.min(1, progress))

      // Enneagram grows from 0.85 to 1.15 as it scrolls into position
      const scaleVal = 0.85 + progress * 0.30
      // Centers vertically / lifts slightly up
      const translateYVal = (1 - progress) * 20

      setScrollScale(scaleVal)
      setScrollTranslateY(translateYVal)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  const handleMouseEnter = (dotId: number) => {
    setActiveDot(dotId)
  }

  const handleMouseLeave = () => {
    setActiveDot(null)
  }

  // Helpers to determine active state classes
  const getVertexClass = (id: number, baseClass?: string) => {
    const isHovered = activeDot === id
    const isDimmed = activeDot !== null && activeDot !== id
    return cn(
      baseClass,
      isHovered && "lv2-active",
      isDimmed && "lv2-dimmed"
    )
  }

  const getLabelClass = (id: number) => {
    const isHovered = activeDot === id
    const isDimmed = activeDot !== null && activeDot !== id
    return cn(
      isHovered && "lv2-active",
      isDimmed && "lv2-dimmed"
    )
  }

  const getLineClass = (lineId: string) => {
    if (activeDot === null) return ""
    const isConnected = VERTEX_CONNECTIONS[activeDot]?.includes(lineId)
    return isConnected ? "lv2-active" : "lv2-dimmed"
  }

  const activeContent = activeDot !== null ? ENEATIPO_INFO[activeDot] : DEFAULT_INFO

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

        {/* content overlays raised vertically via bottom padding (pb-20 lg:pb-32) */}
        <div className="lv2-eneagrama-content absolute inset-0 z-10 flex min-h-0 items-center px-6 py-10 md:px-10 pb-20 lg:pb-32 pt-10">
          <div className="relative mx-auto w-full max-w-6xl h-full flex flex-col lg:flex-row lg:items-center justify-center overflow-visible">
            {/* Added margin bottom mb-4 and padding top pt-14 on mobile to push diagram down below header */}
            <div className="lv2-eneagrama-map-wrap flex justify-center overflow-visible lg:flex-1 lg:pr-24 pt-14 md:pt-0 mb-4 lg:mb-24">
              <div
                id="css-eneagrama"
                className="pointer-events-auto"
                style={{
                  transform: `scale(${scrollScale}) translateY(${scrollTranslateY}px)`,
                  transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)",
                }}
              >
                {/* Vertices (dots) with no numbers inside */}
                <div id="v1" className={getVertexClass(1)} onMouseEnter={() => handleMouseEnter(1)} onMouseLeave={handleMouseLeave} />
                <div id="v2" className={getVertexClass(2, "max")} onMouseEnter={() => handleMouseEnter(2)} onMouseLeave={handleMouseLeave} />
                <div id="v3" className={getVertexClass(3, "asa")} onMouseEnter={() => handleMouseEnter(3)} onMouseLeave={handleMouseLeave} />
                <div id="v4" className={getVertexClass(4)} onMouseEnter={() => handleMouseEnter(4)} onMouseLeave={handleMouseLeave} />
                <div id="v5" className={getVertexClass(5)} onMouseEnter={() => handleMouseEnter(5)} onMouseLeave={handleMouseLeave} />
                <div id="v6" className={getVertexClass(6)} onMouseEnter={() => handleMouseEnter(6)} onMouseLeave={handleMouseLeave} />
                <div id="v7" className={getVertexClass(7)} onMouseEnter={() => handleMouseEnter(7)} onMouseLeave={handleMouseLeave} />
                <div id="v8" className={getVertexClass(8)} onMouseEnter={() => handleMouseEnter(8)} onMouseLeave={handleMouseLeave} />
                <div id="v9" className={getVertexClass(9)} onMouseEnter={() => handleMouseEnter(9)} onMouseLeave={handleMouseLeave} />

                {/* Labels */}
                <div id="t1" className={getLabelClass(1)}>1 - El Reformista</div>
                <div id="t2" className={getLabelClass(2)}>2 - El Ayudante</div>
                <div id="t3" className={getLabelClass(3)}>3 - El Realizador</div>
                <div id="t4" className={getLabelClass(4)}>4 - El Individualista</div>
                <div id="t5" className={getLabelClass(5)}>5 - El Investigador</div>
                <div id="t6" className={getLabelClass(6)}>6 - El Leal</div>
                <div id="t7" className={getLabelClass(7)}>7 - El Entusiasta</div>
                <div id="t8" className={getLabelClass(8)}>8 - El Desafiador</div>
                <div id="t9" className={getLabelClass(9)}>9 - El Pacificador</div>

                {/* Lines */}
                <div id="l36" className={getLineClass("l36")}></div>
                <div id="l69" className={getLineClass("l69")}></div>
                <div id="l93" className={getLineClass("l93")}></div>

                <div id="l17" className={getLineClass("l17")}></div>
                <div id="l75" className={getLineClass("l75")}></div>
                <div id="l58" className={getLineClass("l58")}></div>
                <div id="l82" className={getLineClass("l82")}></div>
                <div id="l24" className={getLineClass("l24")}></div>
                <div id="l41" className={getLineClass("l41")}></div>
              </div>
            </div>

            <div className="lv2-eneagrama-copy pointer-events-auto relative mt-4 lg:mt-0 lg:absolute lg:top-8 lg:right-0 lg:max-w-[320px] z-20 flex flex-col justify-between">
              <div className="lv2-eneagrama-text-veil" aria-hidden />
              <div>
                <p className="lv2-section-label mb-2 md:mb-4">El Eneagrama</p>
                <h2 className="lv2-display text-xl md:text-2xl text-[var(--lv2-ivory)] md:text-3xl min-h-[3.2rem] md:min-h-[4rem] flex items-center">
                  {activeContent.title}
                </h2>
                <div className="lv2-gold-line my-3 md:my-6 max-w-[100px]" />
                <p className="lv2-body text-sm md:text-base min-h-[5.5rem] md:min-h-[8.5rem] leading-relaxed">
                  <TypewriterText key={activeDot !== null ? String(activeDot) : "default"} text={activeContent.description} />
                </p>
                <p className="lv2-body mt-3 md:mt-6 text-xs md:text-sm italic text-[var(--lv2-taupe)] min-h-[2rem] md:min-h-[3rem]">
                  {activeContent.quote}
                </p>
              </div>

              <Link href="#caminos" className="lv2-btn-gold mt-4 md:mt-6 w-full text-center text-xs tracking-[0.15em] uppercase py-3 block transition-all duration-300 hover:shadow-lg hover:-translate-y-[1px]">
                Descubre tu eneagrama
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
