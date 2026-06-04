"use client"

import { useEffect, useRef, useState } from "react"
import { EngravingReflection } from "@/components/landing-v2/svg/engraving-reflection"
import { SYMPTOMS } from "@/lib/landing-v2/constants"

export function LandingSymptomsPanel() {
  const panelRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    )

    observer.observe(panel)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={panelRef}
      id="sintomas"
      className={`lv2-symptoms-panel mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-center md:gap-16 md:px-10 ${
        visible ? "lv2-symptoms-panel--visible" : ""
      }`}
    >
      <div className="lv2-symptoms-fade lv2-symptoms-fade--1 flex justify-center md:justify-start">
        <div className="relative p-4 md:p-6">
          <EngravingReflection className="h-auto w-full max-w-[280px] md:max-w-[320px]" />
        </div>
      </div>

      <div className="lv2-symptoms-text lv2-symptoms-fade lv2-symptoms-fade--2">
        <p className="lv2-symptoms-fade lv2-symptoms-fade--3 lv2-section-label mb-4">
          Los síntomas son mensajes
        </p>
        <h2 className="lv2-symptoms-fade lv2-symptoms-fade--4 lv2-display text-3xl text-[#f4efe4] md:text-4xl">
          Lo visible señala lo profundo
        </h2>
        <div className="lv2-symptoms-fade lv2-symptoms-fade--5 lv2-gold-line my-8 max-w-[120px]" />
        <ul className="space-y-4">
          {SYMPTOMS.map((line, index) => (
            <li
              key={line}
              className={`lv2-symptoms-fade lv2-symptoms-fade--${6 + index} lv2-body text-lg text-[#f4efe4]/90`}
            >
              {line}
            </li>
          ))}
        </ul>
        <p className="lv2-symptoms-fade lv2-symptoms-fade--10 lv2-body mt-10 text-lg text-[#c9c0b0]">
          Muchas veces no son el problema.
          <br />
          <span className="text-[#d4b76a]">
            Son la manifestación visible de algo más profundo.
          </span>
        </p>
      </div>
    </div>
  )
}

/** @deprecated Use HeroVideoRevealBlock on the landing page */
export function LandingSymptoms() {
  return <LandingSymptomsPanel />
}
