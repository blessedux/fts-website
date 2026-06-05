"use client"

import Image from "next/image"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { SYMPTOMS } from "@/lib/landing-v2/constants"

const SYMPTOMS_PORTRAIT = {
  src: "/imgs/bio_pic.webp",
  width: 1010,
  height: 1510,
} as const

function ScrollFadeIn({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`lv2-scroll-fade ${visible ? "lv2-scroll-fade--visible" : ""} ${className}`}
    >
      {children}
    </div>
  )
}

export function LandingSymptomsPanel() {
  return (
    <div id="sintomas" className="lv2-symptoms-panel mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-center md:gap-16 md:px-10">
      <ScrollFadeIn className="flex justify-center md:justify-start">
        <div
          data-lv2-symptoms-portrait
          className="relative aspect-[1010/1510] w-full max-w-[280px] overflow-hidden border border-[var(--lv2-taupe)]/30 md:max-w-[320px]"
        >
          <Image
            src={SYMPTOMS_PORTRAIT.src}
            alt="Retrato editorial — la mirada hacia lo interior"
            width={SYMPTOMS_PORTRAIT.width}
            height={SYMPTOMS_PORTRAIT.height}
            className="h-full w-full object-cover object-center grayscale-[15%] contrast-[1.05]"
            sizes="(max-width: 768px) 80vw, 320px"
            priority={false}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--lv2-void)]/70 via-transparent to-[var(--lv2-void)]/25"
            aria-hidden
          />
        </div>
      </ScrollFadeIn>

      <div className="lv2-symptoms-text">
        <ScrollFadeIn>
          <p className="lv2-section-label mb-4">Los síntomas son mensajes</p>
        </ScrollFadeIn>

        <ScrollFadeIn>
          <h2 className="lv2-display text-3xl text-[#f4efe4] md:text-4xl">
            Lo visible señala lo profundo
          </h2>
        </ScrollFadeIn>

        <ScrollFadeIn>
          <div className="lv2-gold-line my-8 max-w-[120px]" />
        </ScrollFadeIn>

        <ul className="space-y-4">
          {SYMPTOMS.map((line) => (
            <ScrollFadeIn key={line}>
              <li className="lv2-body text-lg text-[#f4efe4]/90">{line}</li>
            </ScrollFadeIn>
          ))}
        </ul>

        <ScrollFadeIn>
          <p className="lv2-symptoms-closing mt-10 text-[var(--lv2-ivory)]">
            Muchas veces no son el{" "}
            <strong className="font-semibold text-[var(--lv2-ivory)]">problema</strong>.
            <br />
            <span className="lv2-symptoms-closing-line">
              Son la manifestación visible de algo más{" "}
              <em className="lv2-symptoms-closing-accent">profundo</em>.
            </span>
          </p>
        </ScrollFadeIn>
      </div>
    </div>
  )
}

/** @deprecated Use HeroVideoRevealBlock on the landing page */
export function LandingSymptoms() {
  return <LandingSymptomsPanel />
}
