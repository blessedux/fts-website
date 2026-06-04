"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ConsultationBooking } from "@/components/landing-v2/consultation-booking"
import { LabyrinthTopView } from "@/components/landing-v2/svg/labyrinth"

const CONSULTATION_IMAGE = {
  src: "/imgs/consultation_bg.webp",
  width: 1672,
  height: 941,
} as const

const RUNWAY_VH = 0.88
const BLUR_ZONE_VH = 0.42
const MAX_BLUR_PX = 16

/** Fade starts when the title enters the viewport; full opacity after a short scroll */
const BOOKING_TITLE_ENTER_VH = 1
const BOOKING_TITLE_FULL_VH = 0.96

function bookingTitleFade(rect: DOMRect, vh: number) {
  if (rect.bottom <= 0 || rect.top >= vh) return 0

  const enterY = vh * BOOKING_TITLE_ENTER_VH
  const fullY = vh * BOOKING_TITLE_FULL_VH
  const span = enterY - fullY
  if (span <= 0) return 1

  if (rect.top <= fullY) return 1
  return Math.min(Math.max((enterY - rect.top) / span, 0), 1)
}

export function LandingConsultaParallax() {
  const sectionRef = useRef<HTMLElement>(null)
  const runwayRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const bookingTitleRef = useRef<HTMLParagraphElement>(null)
  const [blurPx, setBlurPx] = useState(0)
  const [scrimOpacity, setScrimOpacity] = useState(0)
  const [introOpacity, setIntroOpacity] = useState(0)
  const [introY, setIntroY] = useState(24)
  const [bookingTitleOpacity, setBookingTitleOpacity] = useState(0)
  const [bookingTitleY, setBookingTitleY] = useState(16)
  const [bookingPanelOpacity, setBookingPanelOpacity] = useState(0)
  const [bookingPanelY, setBookingPanelY] = useState(20)
  const [motionEnabled, setMotionEnabled] = useState(true)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setMotionEnabled(!reduced)

    const update = () => {
      const section = sectionRef.current
      const overlay = overlayRef.current
      if (!section || !overlay) return

      const vh = window.innerHeight
      const runwayPx = runwayRef.current?.offsetHeight ?? vh * RUNWAY_VH
      const blurZonePx = vh * BLUR_ZONE_VH
      const sectionRect = section.getBoundingClientRect()
      const sectionTop = sectionRect.top
      const sectionInView = sectionRect.top < vh && sectionRect.bottom > 0

      /** Pixels scrolled since section top aligned with viewport top */
      const scrollIntoSection = Math.max(0, -sectionTop)

      /** Sharp through full runway; blur only after runway bottom is reached */
      const blurProgress =
        sectionInView && scrollIntoSection > runwayPx
          ? Math.min((scrollIntoSection - runwayPx) / blurZonePx, 1)
          : 0

      const titleRect = bookingTitleRef.current?.getBoundingClientRect()
      const titleFade = titleRect ? bookingTitleFade(titleRect, vh) : 0

      const introFade = Math.min(blurProgress / 0.5, 1)
      const panelFade = Math.min(Math.max(blurProgress - 0.06, 0) / 0.42, 1)

      if (reduced) {
        setBlurPx(0)
        setScrimOpacity(0.35)
        setIntroOpacity(1)
        setIntroY(0)
        setBookingTitleOpacity(1)
        setBookingTitleY(0)
        setBookingPanelOpacity(1)
        setBookingPanelY(0)
        return
      }

      setBlurPx(blurProgress * MAX_BLUR_PX)
      setScrimOpacity(blurProgress * 0.48 + titleFade * 0.22 + panelFade * 0.12)
      setIntroOpacity(introFade)
      setIntroY((1 - introFade) * 24)
      setBookingTitleOpacity(titleFade)
      setBookingTitleY((1 - titleFade) * 6)
      setBookingPanelOpacity(panelFade)
      setBookingPanelY((1 - panelFade) * 20)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)

    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="consulta"
      className="lv2-consulta-parallax relative bg-[var(--lv2-ink)]"
    >
      <div className="lv2-consulta-bg-pin pointer-events-none" aria-hidden>
        <Image
          src={CONSULTATION_IMAGE.src}
          alt="Espacio de exploración interior"
          width={CONSULTATION_IMAGE.width}
          height={CONSULTATION_IMAGE.height}
          className="lv2-consulta-bg-img"
          style={
            motionEnabled
              ? {
                  filter: blurPx > 0 ? `blur(${blurPx}px)` : "none",
                  transform: blurPx > 0 ? `scale(${1 + blurPx * 0.0025})` : "none",
                }
              : undefined
          }
          sizes="100vw"
          priority={false}
        />
        <div
          className="lv2-consulta-bg-scrim absolute inset-0"
          style={{ opacity: scrimOpacity }}
        />
      </div>

      <div ref={runwayRef} className="lv2-consulta-runway" aria-hidden />

      <div ref={overlayRef} className="lv2-consulta-stage">
        <LabyrinthTopView className="pointer-events-none absolute right-[-10%] top-[8%] h-[min(90vw,520px)] w-[min(90vw,520px)] opacity-[0.1] md:right-[5%] md:opacity-[0.18]" />

        <div className="lv2-consulta-stage-inner">
          <div
            className="lv2-consulta-intro mx-auto max-w-3xl text-center"
            style={
              motionEnabled
                ? {
                    opacity: introOpacity,
                    transform: `translate3d(0, ${introY}px, 0)`,
                  }
                : undefined
            }
          >
            <p className="lv2-section-label mb-2">Inicio del proceso</p>
            <h2 className="lv2-display text-3xl text-[var(--lv2-ivory)] md:text-5xl text-balance">
              Toda transformación comienza con el primer paso.
            </h2>
            <div className="lv2-gold-line mx-auto my-8 max-w-xs md:my-10" />
            <p className="lv2-body text-lg md:text-xl">
              A veces basta una conversación para comenzar a comprender
              <br />
              aquello que lleva años intentando expresarse.
            </p>
          </div>

          <div
            id="reserva-consulta"
            className="lv2-consulta-booking mx-auto w-full max-w-lg scroll-mt-28"
            aria-label="Calendario para reservar consulta"
          >
            <p
              ref={bookingTitleRef}
              className="lv2-section-label mb-6 text-center"
              style={
                motionEnabled
                  ? {
                      opacity: bookingTitleOpacity,
                      transform: `translate3d(0, ${bookingTitleY}px, 0)`,
                    }
                  : undefined
              }
            >
              Reserva tu consulta
            </p>
            <ConsultationBooking
              labelsReveal={
                motionEnabled
                  ? { opacity: bookingTitleOpacity, translateY: bookingTitleY }
                  : undefined
              }
              panelReveal={
                motionEnabled
                  ? { opacity: bookingPanelOpacity, translateY: bookingPanelY }
                  : undefined
              }
            />
          </div>
        </div>
      </div>

      <div className="lv2-consulta-tail" aria-hidden />
    </section>
  )
}
