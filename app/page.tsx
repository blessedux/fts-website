import type { Metadata } from "next"
import { LandingPageV2 } from "@/components/landing-v2/landing-page"
import { SITE_TAGLINE } from "@/lib/landing-v2/constants"

export const metadata: Metadata = {
  title: "Fanny Torres Da Silva | Psicoanálisis y autoconocimiento",
  description: SITE_TAGLINE,
  openGraph: {
    title: "Fanny Torres Da Silva — El viaje hacia el inconsciente",
    description: SITE_TAGLINE,
  },
}

export default function Home() {
  return <LandingPageV2 />
}
