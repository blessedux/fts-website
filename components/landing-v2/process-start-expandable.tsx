"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  EXPAND_INICIO_PROCESO_EVENT,
  INICIO_PROCESO_ID,
} from "@/lib/landing-v2/campaign-expand"
import { HERO_CAMPAIGN } from "@/lib/landing-v2/constants"

export function ProcessStartExpandable() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onExpand = () => setOpen(true)
    window.addEventListener(EXPAND_INICIO_PROCESO_EVENT, onExpand)
    return () => window.removeEventListener(EXPAND_INICIO_PROCESO_EVENT, onExpand)
  }, [])

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="lv2-process-start-card group scroll-mt-28"
    >
      <CollapsibleTrigger
        id={INICIO_PROCESO_ID}
        className="lv2-process-start-trigger w-full text-center"
      >
        <p className="lv2-section-label mb-2">Inicio del proceso</p>
        <p className="lv2-display text-2xl text-[var(--lv2-ivory)] md:text-3xl">
          {open
            ? "Comienza tu camino de exploración interior."
            : HERO_CAMPAIGN.active
              ? "Consulta inicial gratuita — 30 min"
              : "Comienza tu camino de exploración interior."}
        </p>
        {!open && (
          <p className="lv2-body mt-3 text-base text-[var(--lv2-ivory-muted)]">
            {HERO_CAMPAIGN.active
              ? "Toca para ver cómo agendar tu primera conversación de orientación."
              : "Toca para conocer el primer paso del acompañamiento."}
          </p>
        )}
        <span
          className="mx-auto mt-4 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--lv2-taupe)]/40 text-[var(--lv2-taupe)] transition-transform duration-300 group-data-[state=open]:rotate-180"
          aria-hidden
        >
          <ChevronDown size={18} strokeWidth={1.5} />
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent className="lv2-process-start-content">
        <div className="lv2-gold-line mx-auto my-8 max-w-[120px]" />
        <p className="lv2-body text-lg">
          {HERO_CAMPAIGN.active ? (
            <>
              Consulta inicial de orientación — 30 min, gratuita esta semana.
              <br />
              Presencial u online.
            </>
          ) : (
            <>
              Consulta inicial de orientación.
              <br />
              Presencial u online.
            </>
          )}
        </p>
        <p className="lv2-body mx-auto mt-6 max-w-xl text-base italic text-[var(--lv2-taupe)]">
          No estás reservando una reunión. Estás iniciando un proceso.
        </p>
        {HERO_CAMPAIGN.active && (
          <p className="lv2-body mt-6 text-sm text-[var(--lv2-ivory-muted)]">
            <span className="text-[var(--lv2-taupe)]">{HERO_CAMPAIGN.badge}:</span>{" "}
            {HERO_CAMPAIGN.detail}
          </p>
        )}
        <a href="#reserva-consulta" className="lv2-btn-gold mt-8 inline-block">
          Ir a reservar
        </a>
      </CollapsibleContent>
    </Collapsible>
  )
}
