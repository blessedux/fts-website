"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ArchetypeMagnifierCard } from "@/components/landing-v2/archetype-magnifier-card"
import { ARCHETYPE_CARDS } from "@/lib/landing-v2/constants"

const SLOT_COUNT = ARCHETYPE_CARDS.length
const IDLE_MS = 5000
const FADE_MS = 1800
const HOVER_RETRY_MS = 400

const INITIAL_SLOT_INDICES = ARCHETYPE_CARDS.map((_, i) => i)

type FadeState = {
  slot: number
  fromIndex: number
  toIndex: number
}

export function ArchetypeCardsGrid() {
  const [slotIndices, setSlotIndices] = useState<number[]>(() => [...INITIAL_SLOT_INDICES])
  const [fade, setFade] = useState<FadeState | null>(null)
  const [hoveredSlots, setHoveredSlots] = useState<boolean[]>(() =>
    Array(SLOT_COUNT).fill(false)
  )

  const slotIndicesRef = useRef(slotIndices)
  const hoveredSlotsRef = useRef(hoveredSlots)
  const phaseRef = useRef(0)
  const fadeRef = useRef<FadeState | null>(null)
  const mountedRef = useRef(true)

  slotIndicesRef.current = slotIndices
  hoveredSlotsRef.current = hoveredSlots
  fadeRef.current = fade

  const setSlotHovered = useCallback((slot: number, hovered: boolean) => {
    setHoveredSlots((prev) => {
      if (prev[slot] === hovered) return prev
      const next = [...prev]
      next[slot] = hovered
      hoveredSlotsRef.current = next
      return next
    })
  }, [])

  useEffect(() => {
    mountedRef.current = true

    if (typeof window === "undefined") return () => undefined
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        mountedRef.current = false
      }
    }

    let idleTimer: ReturnType<typeof setTimeout>
    let fadeTimer: ReturnType<typeof setTimeout>
    let retryTimer: ReturnType<typeof setTimeout>

    const clearTimers = () => {
      clearTimeout(idleTimer)
      clearTimeout(fadeTimer)
      clearTimeout(retryTimer)
    }

    const scheduleIdle = () => {
      clearTimeout(idleTimer)
      idleTimer = setTimeout(beginFadeForPhase, IDLE_MS)
    }

    const finishFade = () => {
      const current = fadeRef.current
      if (!current || !mountedRef.current) return

      const nextIndices = [...slotIndicesRef.current]
      nextIndices[current.slot] = current.toIndex
      slotIndicesRef.current = nextIndices
      setSlotIndices(nextIndices)
      setFade(null)
      fadeRef.current = null
      phaseRef.current = (current.slot + 1) % SLOT_COUNT
      scheduleIdle()
    }

    const beginFadeForPhase = () => {
      if (!mountedRef.current || fadeRef.current) return

      const slot = phaseRef.current
      if (hoveredSlotsRef.current[slot]) {
        retryTimer = setTimeout(beginFadeForPhase, HOVER_RETRY_MS)
        return
      }

      const fromIndex = slotIndicesRef.current[slot]
      const toIndex = (fromIndex + 1) % SLOT_COUNT
      const nextFade: FadeState = { slot, fromIndex, toIndex }
      fadeRef.current = nextFade
      setFade(nextFade)

      clearTimeout(fadeTimer)
      fadeTimer = setTimeout(finishFade, FADE_MS)
    }

    scheduleIdle()

    return () => {
      mountedRef.current = false
      clearTimers()
    }
  }, [])

  return (
    <div className="mt-16 grid grid-cols-1 items-start gap-6 sm:grid-cols-3 md:gap-8">
      {ARCHETYPE_CARDS.map((_, slot) => {
        const isFading = fade?.slot === slot
        const displayIndex = isFading ? fade!.fromIndex : slotIndices[slot]
        const nextIndex = isFading
          ? fade!.toIndex
          : (slotIndices[slot] + 1) % SLOT_COUNT
        const display = ARCHETYPE_CARDS[displayIndex]
        const next = ARCHETYPE_CARDS[nextIndex]

        return (
          <ArchetypeMagnifierCard
            key={slot}
            name={display.name}
            image={display.image}
            incomingName={next.name}
            incomingImage={next.image}
            crossfadeActive={isFading}
            onHoverChange={(hovered) => setSlotHovered(slot, hovered)}
          />
        )
      })}
    </div>
  )
}
