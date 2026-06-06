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
/** Extra scroll (beyond runway) used to finish the horizontal pan on mobile */
const MOBILE_PAN_EXTRA_VH = 0.42
/** Stop horizontal pan at this fraction of the image width (0–1) */
const MOBILE_PAN_WIDTH_RATIO = 0.8

function mobileImageWidth(vh: number, img: HTMLImageElement | null) {
  if (img) {
    const measured = img.getBoundingClientRect().width
    if (measured > 0) return measured
  }
  return vh * (CONSULTATION_IMAGE.width / CONSULTATION_IMAGE.height)
}

/** Fade starts as soon as the booking block nears the viewport */
const BOOKING_TITLE_ENTER_VH = 1.38
const BOOKING_TITLE_FULL_VH = 1.08

function bookingTitleFade(rect: DOMRect, vh: number) {
  if (rect.bottom <= 0 || rect.top >= vh) return 0

  const enterY = vh * BOOKING_TITLE_ENTER_VH
  const fullY = vh * BOOKING_TITLE_FULL_VH
  const span = enterY - fullY
  if (span <= 0) return 1

  if (rect.top <= fullY) return 1
  return Math.min(Math.max((enterY - rect.top) / span, 0), 1)
}

function sectionEntryFade(sectionTop: number, vh: number) {
  const enterY = vh * 1.15
  const fullY = vh * 0.62
  const span = enterY - fullY
  if (span <= 0) return 1
  if (sectionTop <= fullY) return 1
  if (sectionTop >= enterY) return 0
  return Math.min(Math.max((enterY - sectionTop) / span, 0), 1)
}

export function LandingConsultaParallax() {
  const sectionRef = useRef<HTMLElement>(null)
  const runwayRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const bookingTitleRef = useRef<HTMLParagraphElement>(null)
  const bgImgRef = useRef<HTMLImageElement>(null)
  const updateScrollRef = useRef<() => void>(() => undefined)
  const [blurPx, setBlurPx] = useState(0)
  const [scrimOpacity, setScrimOpacity] = useState(0)
  const [introOpacity, setIntroOpacity] = useState(0)
  const [introY, setIntroY] = useState(24)
  const [bookingTitleOpacity, setBookingTitleOpacity] = useState(0)
  const [bookingTitleY, setBookingTitleY] = useState(16)
  const [bookingPanelOpacity, setBookingPanelOpacity] = useState(0)
  const [bookingPanelY, setBookingPanelY] = useState(20)
  const [bgPanX, setBgPanX] = useState(0)
  const [motionEnabled, setMotionEnabled] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const mobileMq = window.matchMedia("(max-width: 767px)")
    setMotionEnabled(!reduced)

    const syncMobile = () => setIsMobile(mobileMq.matches)
    syncMobile()
    mobileMq.addEventListener("change", syncMobile)

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

      const scrollIntoSection = Math.max(0, -sectionTop)

      const mobile = mobileMq.matches

      const blurProgress =
        !mobile &&
        sectionInView &&
        scrollIntoSection > runwayPx
          ? Math.min((scrollIntoSection - runwayPx) / blurZonePx, 1)
          : 0

      let nextBgPanX = 0
      if (mobile && sectionInView) {
        const renderedW = mobileImageWidth(vh, bgImgRef.current)
        const maxPan = Math.max(
          0,
          renderedW * MOBILE_PAN_WIDTH_RATIO - window.innerWidth
        )
        const panRange = runwayPx + vh * MOBILE_PAN_EXTRA_VH
        const panProgress = Math.min(Math.max(scrollIntoSection / panRange, 0), 1)
        nextBgPanX = -panProgress * maxPan
      }

      const titleRect = bookingTitleRef.current?.getBoundingClientRect()
      const titleFade = titleRect ? bookingTitleFade(titleRect, vh) : 0
      const entryFade = sectionEntryFade(sectionTop, vh)

      const introFade = Math.max(
        Math.min(blurProgress / 0.5, 1),
        entryFade * 0.85
      )
      const panelFade = Math.max(
        titleFade,
        Math.min(Math.max(entryFade - 0.08, 0) / 0.55, 1)
      )

      if (reduced) {
        setBlurPx(0)
        setBgPanX(0)
        setScrimOpacity(0.35)
        setIntroOpacity(1)
        setIntroY(0)
        setBookingTitleOpacity(1)
        setBookingTitleY(0)
        setBookingPanelOpacity(1)
        setBookingPanelY(0)
        return
      }

      setBgPanX(nextBgPanX)
      setBlurPx(blurProgress * MAX_BLUR_PX)
      setScrimOpacity(blurProgress * 0.48 + titleFade * 0.22 + panelFade * 0.12)
      setIntroOpacity(introFade)
      setIntroY((1 - introFade) * 24)
      setBookingTitleOpacity(titleFade)
      setBookingTitleY((1 - titleFade) * 6)
      setBookingPanelOpacity(panelFade)
      setBookingPanelY((1 - panelFade) * 20)
    }

    updateScrollRef.current = update
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)

    const img = bgImgRef.current
    const ro = new ResizeObserver(update)
    if (img) ro.observe(img)

    return () => {
      ro.disconnect()
      mobileMq.removeEventListener("change", syncMobile)
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  const desktopBgScale =
    motionEnabled && !isMobile && blurPx > 0 ? 1 + blurPx * 0.0025 : undefined

  const layerTransform =
    motionEnabled && isMobile && bgPanX !== 0
      ? `translate3d(${bgPanX}px, 0, 0)`
      : undefined

  const imageTransform =
    motionEnabled && desktopBgScale
      ? `scale(${desktopBgScale})`
      : undefined

  return (
    <section
      ref={sectionRef}
      id="consulta"
      className="lv2-consulta-parallax relative bg-[var(--lv2-ink)]"
    >
      <div className="lv2-consulta-bg-pin pointer-events-none" aria-hidden>
        <div
          className="lv2-consulta-bg-layer"
          style={
            layerTransform
              ? { transform: layerTransform, willChange: "transform" }
              : undefined
          }
        >
          <Image
            ref={bgImgRef}
            src={CONSULTATION_IMAGE.src}
            alt="Espacio de exploración interior"
            width={CONSULTATION_IMAGE.width}
            height={CONSULTATION_IMAGE.height}
            className="lv2-consulta-bg-img"
            style={
              motionEnabled
                ? {
                    filter: blurPx > 0 ? `blur(${blurPx}px)` : "none",
                    transform: imageTransform,
                    transformOrigin: isMobile ? "left center" : "center 72%",
                  }
                : undefined
            }
            sizes="100vw"
            priority={false}
            onLoad={() => updateScrollRef.current()}
          />
        </div>
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
            className="lv2-consulta-booking mx-auto w-full max-w-lg scroll-mt-40"
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
