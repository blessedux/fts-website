import type { Metadata } from "next"
import type React from "react"
import { LandingSubpageShell } from "@/components/landing-v2/landing-subpage-layout"

export const metadata: Metadata = {
  title: "Eneagrama para organizaciones | Fanny Torres Silva",
  description:
    "Charlas y talleres de eneagrama para empresas, equipos y liderazgo. Un mapa para leer dinámicas colectivas, no una etiqueta.",
}

export default function OrganizacionesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <LandingSubpageShell>{children}</LandingSubpageShell>
}
