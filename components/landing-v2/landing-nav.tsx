import Link from "next/link"
import { CONSULTA_SECTION_ID } from "@/lib/landing-v2/constants"

export function LandingNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:h-20 md:px-10">
        <Link
          href="/"
          className="font-[family-name:var(--font-cormorant)] text-lg tracking-[0.2em] text-[var(--lv2-ivory)] uppercase md:text-xl"
        >
          Fanny Torres
        </Link>

        <a href={CONSULTA_SECTION_ID} className="lv2-btn-gold text-xs py-2 px-5">
          Reservar
        </a>
      </div>
    </header>
  )
}
