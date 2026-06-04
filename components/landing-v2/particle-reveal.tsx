"use client"

import Image from "next/image"
import { useId, useRef, useSyncExternalStore } from "react"
import { ParticleAnimation } from "@/components/ui/particle-animation"

const subscribeReducedMotion = (onStoreChange: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
  mq.addEventListener("change", onStoreChange)
  return () => mq.removeEventListener("change", onStoreChange)
}

const getReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

type ParticleRevealProps = {
  instanceId: string
  revealImageSrc: string
  revealImageAlt?: string
  className?: string
  children: React.ReactNode
  /** Extra layers between reveal bg and particle veil (e.g. video) */
  middleLayer?: React.ReactNode
  veilClassName?: string
}

export function ParticleReveal({
  instanceId,
  revealImageSrc,
  revealImageAlt = "",
  className = "",
  children,
  middleLayer,
  veilClassName = "",
}: ParticleRevealProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const reactId = useId().replace(/:/g, "")
  const maskId = `particle-mask-${instanceId}-${reactId}`
  const gooeyFilterId = `particle-gooey-${instanceId}-${reactId}`

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  )

  const particlesEnabled = !reducedMotion

  return (
    <section
      ref={sectionRef}
      className={`lv2-particle-reveal relative isolate overflow-hidden ${className}`}
    >
      <div className="lv2-particle-reveal-bg absolute inset-0 z-0" aria-hidden>
        <Image
          src={revealImageSrc}
          alt={revealImageAlt}
          fill
          className="object-cover"
          sizes="100vw"
          priority={instanceId === "hero"}
        />
      </div>

      {middleLayer}

      <div
        className={`lv2-particle-veil absolute inset-0 z-[6] ${veilClassName}`}
        style={
          particlesEnabled
            ? {
                mask: `url(#${maskId})`,
                WebkitMask: `url(#${maskId})`,
              }
            : undefined
        }
        aria-hidden
      />

      {particlesEnabled && (
        <ParticleAnimation
          containerRef={sectionRef}
          maskId={maskId}
          gooeyFilterId={gooeyFilterId}
        />
      )}

      <div className="relative z-10">{children}</div>
    </section>
  )
}
