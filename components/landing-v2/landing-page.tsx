import { Cormorant_Garamond, DM_Sans, EB_Garamond } from "next/font/google"
import "@/styles/landing-v2.css"
import { LandingNav } from "@/components/landing-v2/landing-nav"
import { HeroVideoRevealBlock } from "@/components/landing-v2/hero-video-reveal-block"
import { LandingEneagrama } from "@/components/landing-v2/landing-eneagrama"
import { LandingOfferings } from "@/components/landing-v2/landing-offerings"
import { LandingArchetypes } from "@/components/landing-v2/landing-archetypes"
import { LandingAbout } from "@/components/landing-v2/landing-about"
import { LandingConsultaParallax } from "@/components/landing-v2/landing-consulta-parallax"
import { LandingTestimonials } from "@/components/landing-v2/landing-testimonials"
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

export function LandingPageV2() {
  return (
    <div
      className={`landing-v2 min-h-screen ${dmSans.variable} ${cormorant.variable} ${ebGaramond.variable}`}
    >
      <LandingNav />
      <main>
        <HeroVideoRevealBlock />
        <div className="lv2-eneagram-caminos-group" data-lv2-bridge>
          <div className="lv2-eneagrama-pin sticky top-0 z-[1]">
            <LandingEneagrama />
          </div>
          <LandingOfferings />
        </div>
        <LandingArchetypes />
        <LandingAbout />
        <LandingConsultaParallax />
        <LandingTestimonials />
      </main>
      <LandingFooter />
    </div>
  )
}
