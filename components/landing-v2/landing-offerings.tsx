"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { OFFERINGS } from "@/lib/landing-v2/constants"

const GROUP_SELECTOR = "[data-lv2-bridge]"
const CAMINOS_HOST_VH = 42
const SLIDE_VH_RATIO = 0.28

function getSlideMax() {
  if (typeof window === "undefined") return 0
  return window.innerHeight * SLIDE_VH_RATIO
}

export function LandingOfferings() {
  const biomboRunwayRef = useRef<HTMLDivElement>(null)
  const caminosHostRef = useRef<HTMLDivElement>(null)
  const biomboShiftRef = useRef(0)
  const [panelOffset, setPanelOffset] = useState(getSlideMax)
  const [motionEnabled, setMotionEnabled] = useState(true)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setMotionEnabled(!reduced)
    if (reduced) {
      setPanelOffset(0)
      return
    }

    const measureBiomboShift = () => {
      const media = document.querySelector(
        "#eneagrama .lv2-eneagrama-media"
      ) as HTMLElement | null
      if (!media) return 0
      const vh = window.innerHeight
      const imageHeight = media.getBoundingClientRect().height
      return Math.max(0, imageHeight - vh)
    }

    const applyRunwayHeight = () => {
      const shift = measureBiomboShift()
      biomboShiftRef.current = shift
      if (biomboRunwayRef.current) {
        biomboRunwayRef.current.style.height = `${shift}px`
      }
    }

    const onScroll = () => {
      const group = document.querySelector(GROUP_SELECTOR) as HTMLElement | null
      const biomboRunway = biomboRunwayRef.current
      const caminosHost = caminosHostRef.current
      if (!biomboRunway || !caminosHost) return

      const vh = window.innerHeight
      const slideMax = vh * SLIDE_VH_RATIO
      const biomboShift = biomboShiftRef.current
      const hostHeight = caminosHost.offsetHeight
      const runwayTop = biomboRunway.getBoundingClientRect().top
      const hostTop = caminosHost.getBoundingClientRect().top

      let biomboY = 0
      let panelY = slideMax

      if (runwayTop <= vh + 1) {
        if (biomboShift > 0 && runwayTop > vh - biomboShift) {
          const biomboProgress = (vh - runwayTop) / biomboShift
          biomboY = -biomboProgress * biomboShift
        } else {
          biomboY = -biomboShift

          if (hostTop <= vh + 1) {
            const caminosProgress = Math.min(
              Math.max((vh - hostTop) / hostHeight, 0),
              1
            )
            panelY = (1 - caminosProgress) * slideMax
          }
        }
      }

      group?.style.setProperty("--lv2-biombo-y", `${biomboY}px`)
      setPanelOffset(panelY)
    }

    applyRunwayHeight()
    onScroll()

    const media = document.querySelector("#eneagrama .lv2-eneagrama-media")
    const ro = new ResizeObserver(() => {
      applyRunwayHeight()
      onScroll()
    })
    if (media) ro.observe(media)

    window.addEventListener("scroll", onScroll, { passive: true })
    const onResize = () => {
      applyRunwayHeight()
      onScroll()
    }
    window.addEventListener("resize", onResize)

    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <>
      <div ref={biomboRunwayRef} className="lv2-biombo-runway" aria-hidden />

      <div
        ref={caminosHostRef}
        className="lv2-caminos-scroll-host"
        style={{ height: `${CAMINOS_HOST_VH}vh` }}
        aria-hidden
      />

      <section id="caminos" className="lv2-caminos relative z-[30] border-t-0">
        <div
          className="lv2-caminos-panel bg-[var(--lv2-void)] py-24 md:py-32"
          style={
            motionEnabled
              ? { transform: `translate3d(0, ${panelOffset}px, 0)` }
              : undefined
          }
        >
          <div className="lv2-caminos-top-edge" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-6 md:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <p className="lv2-section-label mb-4">Dos caminos de trabajo</p>
              <h2 className="lv2-display text-3xl text-[var(--lv2-ivory)] md:text-4xl text-balance">
                Terapia individual y eneagrama en organizaciones
              </h2>
              <p className="lv2-body mt-6 text-lg">
                Un mismo marco de comprensión profunda, aplicado al trabajo interior personal o al
                lenguaje de equipos, liderazgo y cultura.
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 md:gap-8">
              {OFFERINGS.map((offering) => (
                <article key={offering.id} className="lv2-offering-card flex flex-col">
                  <p className="lv2-section-label mb-3">{offering.label}</p>
                  <h3 className="lv2-display text-2xl text-[var(--lv2-ivory)] md:text-3xl">
                    {offering.title}
                  </h3>
                  <div className="lv2-gold-line my-6 max-w-[80px]" />
                  <p className="lv2-body flex-1 text-base">{offering.description}</p>

                  <ul className="mt-8 flex flex-wrap gap-2">
                    {offering.locations.map(({ place, mode }) => (
                      <li key={place} className="lv2-offering-tag">
                        {place}
                        {mode ? (
                          <span className="lv2-offering-tag-mode"> · {mode}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>

                  {offering.ctaHref.startsWith("mailto:") ? (
                    <a href={offering.ctaHref} className="lv2-btn-outline mt-10 self-start">
                      {offering.ctaLabel}
                    </a>
                  ) : (
                    <Link href={offering.ctaHref} className="lv2-btn-gold mt-10 self-start">
                      {offering.ctaLabel}
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
