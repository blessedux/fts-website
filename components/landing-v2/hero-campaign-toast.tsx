"use client"

import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronUp, X } from "lucide-react"
import { BOOKING_SECTION_ID, HERO_CAMPAIGN } from "@/lib/landing-v2/constants"

const DISMISS_KEY = "fts-hero-campaign-toast-v3-dismissed"
const ENTER_MS = 32
const EXIT_MS = 500

function wasDismissed() {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1"
  } catch {
    return false
  }
}

function scrollToBooking() {
  document.querySelector(BOOKING_SECTION_ID)?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  })
}

export function HeroCampaignToast() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [entered, setEntered] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !HERO_CAMPAIGN.active || wasDismissed()) return

    const showTimer = window.setTimeout(() => setOpen(true), HERO_CAMPAIGN.toastDelayMs)
    return () => window.clearTimeout(showTimer)
  }, [mounted])

  useEffect(() => {
    if (!open) {
      setEntered(false)
      return
    }

    const enterTimer = window.setTimeout(() => setEntered(true), ENTER_MS)
    return () => window.clearTimeout(enterTimer)
  }, [open])

  const dismiss = useCallback(() => {
    setEntered(false)
    setExpanded(false)
    try {
      sessionStorage.setItem(DISMISS_KEY, "1")
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setOpen(false), EXIT_MS)
  }, [])

  function handleCtaClick(e: React.MouseEvent) {
    e.stopPropagation()
    scrollToBooking()
  }

  if (!mounted || !HERO_CAMPAIGN.active || !open) return null

  return createPortal(
    <div className="landing-v2 lv2-campaign-toast-portal">
      <div
        className={`lv2-campaign-toast ${entered ? "lv2-campaign-toast--visible" : ""} ${
          expanded ? "lv2-campaign-toast--expanded" : "lv2-campaign-toast--collapsed"
        }`}
        role="region"
        aria-label="Promoción consulta gratuita"
        aria-live="polite"
      >
        <button
          type="button"
          onClick={dismiss}
          className="lv2-campaign-toast-close"
          aria-label="Cerrar aviso"
        >
          <X size={16} strokeWidth={1.5} />
        </button>

        <button
          type="button"
          className="lv2-campaign-toast-toggle"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-controls="lv2-campaign-toast-body"
        >
          <span className="lv2-campaign-toast-badge">{HERO_CAMPAIGN.badge}</span>
          <span className="lv2-campaign-toast-toggle-row">
            <span id="lv2-campaign-toast-title" className="lv2-campaign-toast-title">
              {HERO_CAMPAIGN.title}
            </span>
            <ChevronUp
              size={18}
              strokeWidth={1.5}
              className="lv2-campaign-toast-chevron shrink-0"
              aria-hidden
            />
          </span>
        </button>

        <div id="lv2-campaign-toast-body" className="lv2-campaign-toast-body">
          <p className="lv2-campaign-toast-detail">{HERO_CAMPAIGN.detail}</p>
          <button
            type="button"
            className="lv2-campaign-toast-cta lv2-btn-gold mt-4 w-full py-2.5 text-center text-xs"
            onClick={handleCtaClick}
          >
            {HERO_CAMPAIGN.ctaLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
