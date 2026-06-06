import Link from "next/link"
import { Instagram, Mail, MessageCircle, Youtube } from "lucide-react"
import {
  FOOTER_NAV,
  FOOTER_SOCIAL,
  SITE_TAGLINE,
} from "@/lib/landing-v2/constants"

const SOCIAL_LINKS = [
  {
    label: "WhatsApp",
    href: FOOTER_SOCIAL.whatsapp,
    Icon: MessageCircle,
  },
  {
    label: "YouTube",
    href: FOOTER_SOCIAL.youtube,
    Icon: Youtube,
  },
  {
    label: "Instagram",
    href: FOOTER_SOCIAL.instagram,
    Icon: Instagram,
  },
  {
    label: "Email",
    href: "mailto:info@consultoradejavu.cl",
    Icon: Mail,
  },
] as const

export function LandingFooter() {
  return (
    <footer className="lv2-footer border-t border-[var(--lv2-taupe)]/20 pt-12 pb-8 md:pt-14 md:pb-10">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-16">
          <div className="min-w-0 flex-1">
            <p className="font-[family-name:var(--font-cormorant)] text-lg text-[var(--lv2-ivory)] tracking-wide">
              Fanny Torres Silva
            </p>
            <p className="lv2-body mt-3 max-w-xl text-sm">{SITE_TAGLINE}</p>

            <ul className="mt-6 flex items-center gap-4" aria-label="Redes sociales">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lv2-footer-social-link"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav
            className="lv2-footer-nav shrink-0 md:text-right"
            aria-label="Navegación del sitio"
          >
            <p className="lv2-section-label mb-4 md:sr-only">Navegación</p>
            <ul className="flex flex-col gap-2.5">
              {FOOTER_NAV.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="lv2-footer-nav-link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="lv2-gold-line mt-10 max-w-full opacity-50" />

        <p className="lv2-footer-copyright lv2-body mt-6 text-center text-xs tracking-wider">
          © {new Date().getFullYear()} Fanny Torres Silva. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
