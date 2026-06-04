"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useSyncExternalStore } from "react"
import { ParticleAnimation } from "@/components/ui/particle-animation"
import { LANDING_HERO_VIDEO } from "@/lib/landing-v2/constants"
import { usePingPongVideo } from "@/lib/landing-v2/use-ping-pong-video"
import { LandingHeroPanel } from "@/components/landing-v2/landing-hero"
import { LandingSymptomsPanel } from "@/components/landing-v2/landing-symptoms"

const subscribeReducedMotion = (onStoreChange: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
  mq.addEventListener("change", onStoreChange)
  return () => mq.removeEventListener("change", onStoreChange)
}

const getReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

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

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  )

  const particlesEnabled = !reducedMotion && !videoFailed
  const revealActive = particlesEnabled && blockInView && revealHover

  usePingPongVideo(videoRef, {
    enabled: !videoFailed && !reducedMotion,
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
          >
            <source src={LANDING_HERO_VIDEO} type="video/webm" />
          </video>
        )}
        <div className="lv2-hero-video-vignette absolute inset-0" />
      </div>

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

      <div className="lv2-hero-scroll-content relative">
        <LandingHeroPanel />
        <LandingSymptomsPanel />
      </div>
    </section>
  )
}
