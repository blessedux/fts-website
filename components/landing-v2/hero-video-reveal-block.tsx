"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useSyncExternalStore } from "react"
import { ParticleAnimation } from "@/components/ui/particle-animation"
import { LANDING_HERO_VIDEO } from "@/lib/landing-v2/constants"
import { useHeroVideoAutoplay } from "@/lib/landing-v2/use-hero-video-autoplay"
import { usePingPongVideo } from "@/lib/landing-v2/use-ping-pong-video"
import { LandingHeroPanel } from "@/components/landing-v2/landing-hero"
import { LandingSymptomsPanel } from "@/components/landing-v2/landing-symptoms"

const MOBILE_MQ = "(max-width: 767px)"

const subscribeReducedMotion = (onStoreChange: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
  mq.addEventListener("change", onStoreChange)
  return () => mq.removeEventListener("change", onStoreChange)
}

const getReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

const subscribeMobile = (onStoreChange: () => void) => {
  const mq = window.matchMedia(MOBILE_MQ)
  mq.addEventListener("change", onStoreChange)
  return () => mq.removeEventListener("change", onStoreChange)
}

const getMobile = () =>
  typeof window !== "undefined" && window.matchMedia(MOBILE_MQ).matches

export function HeroVideoRevealBlock() {
  const blockRef = useRef<HTMLElement>(null)
  const revealPinRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reactId = useId().replace(/:/g, "")
  const maskId = `particle-mask-hero-scroll-${reactId}`
  const gooeyFilterId = `particle-gooey-hero-scroll-${reactId}`

  const [videoFailed, setVideoFailed] = useState(false)
  const [revealHover, setRevealHover] = useState(false)
  const [blockInView, setBlockInView] = useState(false)
  const [mobileVideoBlur, setMobileVideoBlur] = useState(0)

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  )

  const isMobile = useSyncExternalStore(subscribeMobile, getMobile, () => false)

  const videoEnabled = !videoFailed && !reducedMotion
  const particlesEnabled = videoEnabled && !isMobile
  const revealActive = particlesEnabled && blockInView && revealHover

  useHeroVideoAutoplay(videoRef, {
    enabled: videoEnabled,
    loop: isMobile || reducedMotion,
  })

  usePingPongVideo(videoRef, {
    enabled: videoEnabled && !isMobile,
    loopFallback: reducedMotion && !videoFailed,
  })

  useEffect(() => {
    const block = blockRef.current
    if (!block) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setBlockInView(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(block)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!blockInView) setRevealHover(false)
  }, [blockInView])

  useEffect(() => {
    if (!isMobile || reducedMotion) {
      setMobileVideoBlur(0)
      return undefined
    }

    const updateBlur = () => {
      const portrait = document.querySelector("[data-lv2-symptoms-portrait]")
      if (!portrait) {
        setMobileVideoBlur(0)
        return
      }

      const vh = window.innerHeight
      const top = portrait.getBoundingClientRect().top
      const blurStart = vh * 0.92
      const blurEnd = vh * 0.28
      const span = blurStart - blurEnd
      const progress =
        span <= 0 ? 1 : Math.min(Math.max((blurStart - top) / span, 0), 1)
      setMobileVideoBlur(progress * 14)
    }

    updateBlur()
    window.addEventListener("scroll", updateBlur, { passive: true })
    window.addEventListener("resize", updateBlur)
    return () => {
      window.removeEventListener("scroll", updateBlur)
      window.removeEventListener("resize", updateBlur)
    }
  }, [isMobile, reducedMotion])

  const veilMaskStyle = revealActive
    ? {
        mask: `url(#${maskId})`,
        WebkitMask: `url(#${maskId})`,
      }
    : undefined

  return (
    <section
      ref={blockRef}
      id="hero"
      className="lv2-hero-video-scroll relative isolate bg-[var(--lv2-void)]"
    >
      <div className="lv2-hero-video-pin pointer-events-none" aria-hidden>
        {!videoFailed && (
          <video
            ref={videoRef}
            className="lv2-hero-video-el"
            autoPlay
            muted
            playsInline
            preload="auto"
            onError={() => setVideoFailed(true)}
            style={
              mobileVideoBlur > 0
                ? {
                    filter: `blur(${mobileVideoBlur}px)`,
                    transform: `scale(${1 + mobileVideoBlur * 0.004})`,
                  }
                : undefined
            }
          >
            <source src={LANDING_HERO_VIDEO} type="video/webm" />
          </video>
        )}
        <div className="lv2-hero-video-vignette absolute inset-0" />
      </div>

      {!isMobile && (
        <div
          ref={revealPinRef}
          className="lv2-hero-reveal-pin"
          onPointerEnter={() => setRevealHover(true)}
          onPointerLeave={() => setRevealHover(false)}
        >
          <div
            className="lv2-particle-veil lv2-particle-veil--hero-scroll pointer-events-none absolute inset-0"
            style={veilMaskStyle}
            aria-hidden
          />

          {particlesEnabled && (
            <ParticleAnimation
              containerRef={revealPinRef}
              maskId={maskId}
              gooeyFilterId={gooeyFilterId}
              enabled={revealActive}
            />
          )}
        </div>
      )}

      <div className="lv2-hero-scroll-content relative">
        <LandingHeroPanel />
        <LandingSymptomsPanel />
      </div>
    </section>
  )
}
