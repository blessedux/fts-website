import Link from "next/link"
import Image from "next/image"
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
    <footer className="lv2-footer relative pt-20 pb-8 md:pt-24 md:pb-10 overflow-hidden bg-[var(--lv2-void)]">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity pointer-events-none">
        <Image
          src="/imgs/footer_bg_fts.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-right-top md:object-top"
          priority
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-16">
          <div className="min-w-0 flex-1">
            <p className="font-[family-name:var(--font-cormorant)] text-lg text-[var(--lv2-ivory)] tracking-wide">
              Fanny Torres Silva
            </p>
            <p className="lv2-body mt-3 max-w-xs text-sm">{SITE_TAGLINE}</p>

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

        <div className="mt-8 flex flex-col items-center gap-4 relative w-full">
          <div className="flex items-center gap-3">
            <Image
              src="/imgs/favicon.ico"
              alt="Fanny Torres Silva Logo"
              width={32}
              height={32}
              className="opacity-70 hover:opacity-100 transition-opacity duration-300"
            />
            <a
              href="https://mentemaestra.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden flex items-center justify-center w-8 h-8 rounded border border-[#b8954a]/30 bg-black/20 hover:bg-[#b8954a]/10 hover:border-[#b8954a]/60 transition-all duration-300 opacity-70 hover:opacity-100"
              aria-label="Mente Maestra Design"
              title="Diseñado por Mente Maestra"
            >
              <Image
                src="/MMLOGO.svg"
                alt="Mente Maestra Logo"
                width={16}
                height={16}
                className="w-4 h-4 invert opacity-90"
              />
            </a>
          </div>
          <p className="lv2-footer-copyright lv2-body text-center text-xs tracking-wider mt-0">
            © {new Date().getFullYear()} Fanny Torres Silva. Todos los derechos reservados.
          </p>
          <a
            href="https://mentemaestra.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex absolute right-0 bottom-0 items-center justify-center w-8 h-8 rounded border border-[#b8954a]/30 bg-black/20 hover:bg-[#b8954a]/10 hover:border-[#b8954a]/60 transition-all duration-300 opacity-70 hover:opacity-100"
            aria-label="Mente Maestra Design"
            title="Diseñado por Mente Maestra"
          >
            <Image
              src="/MMLOGO.svg"
              alt="Mente Maestra Logo"
              width={16}
              height={16}
              className="w-4 h-4 invert opacity-90"
            />
          </a>
        </div>
      </div>
    </footer>
  )
}
