"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { CONSULTA_SECTION_ID } from "@/lib/landing-v2/constants"

const NAV_TITLE = "Fanny Torres Silva"

function scrollToTop() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
}

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      // Toggle logo collapse state if user has scrolled past a tiny threshold (15px)
      setIsScrolled(window.scrollY > 15)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Initials of each word: F (index 0), T (index 6), S (index 13)
  const isInitial = (index: number) => index === 0 || index === 6 || index === 13
  const isSpace = (index: number) => NAV_TITLE[index] === " "

  return (
    <header className="lv2-nav fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:h-20 md:px-10">
        <Link
          href="/"
          className={cn(
            "font-[family-name:var(--font-cormorant)] text-lg tracking-[0.2em] text-[var(--lv2-ivory)] uppercase md:text-xl transition-all duration-500",
            isScrolled && "lv2-logo-collapsed"
          )}
          aria-label={NAV_TITLE}
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault()
              scrollToTop()
            }
          }}
        >
          {NAV_TITLE.split("").map((char, index) => {
            const initial = isInitial(index)
            const space = isSpace(index)
            return (
              <span
                key={`${char}-${index}`}
                className={cn(
                  "lv2-nav-char",
                  initial ? "lv2-logo-initial" : space ? "lv2-logo-fade-space" : "lv2-logo-fade-letter"
                )}
                aria-hidden={!initial && isScrolled}
              >
                {space ? "\u00A0" : char}
              </span>
            )
          })}
        </Link>

        <a href={CONSULTA_SECTION_ID} className="lv2-nav-cta lv2-btn-gold">
          Reservar
        </a>
      </div>
    </header>
  )
}
