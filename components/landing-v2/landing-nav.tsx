"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CONSULTA_SECTION_ID } from "@/lib/landing-v2/constants"

const NAV_TITLE = "Fanny Torres Silva"
const SCROLL_FADE_DISTANCE = 72

function scrollToTop() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
}

export function LandingNav() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setScrollProgress(
        Math.min(Math.max(window.scrollY / SCROLL_FADE_DISTANCE, 0), 1)
      )
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="lv2-nav fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:h-20 md:px-10">
        <Link
          href="/"
          className="font-[family-name:var(--font-cormorant)] text-lg tracking-[0.2em] text-[var(--lv2-ivory)] uppercase md:text-xl"
          aria-label={NAV_TITLE}
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault()
              scrollToTop()
            }
          }}
        >
          {NAV_TITLE.split("").map((char, index) => (
            <span
              key={`${char}-${index}`}
              className="lv2-nav-char"
              style={{
                opacity: index === 0 ? 1 : 1 - scrollProgress,
              }}
              aria-hidden={index > 0 && scrollProgress >= 1}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </Link>

        <a href={CONSULTA_SECTION_ID} className="lv2-nav-cta lv2-btn-gold">
          Reservar
        </a>
      </div>
    </header>
  )
}
