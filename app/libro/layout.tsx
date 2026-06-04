import type { Metadata } from "next"
import type React from "react"
import { Cormorant_Garamond, DM_Sans, EB_Garamond } from "next/font/google"
import "@/styles/landing-v2.css"
import { LandingNav } from "@/components/landing-v2/landing-nav"
import { LandingFooter } from "@/components/landing-v2/landing-footer"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hero-sans",
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
})

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
})

export const metadata: Metadata = {
  title: "El libro oficial de eneagrama | Fanny Torres Da Silva",
  description:
    "Guía completa del eneagrama por Fanny Torres Da Silva. Historia, nueve tipos, relaciones y caminos de crecimiento personal.",
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`landing-v2 min-h-screen ${dmSans.variable} ${cormorant.variable} ${ebGaramond.variable}`}
    >
      <LandingNav />
      <main className="flex-1 pt-20 md:pt-24">{children}</main>
      <LandingFooter />
    </div>
  )
}
