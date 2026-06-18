export const LANDING_HERO_VIDEO =
  process.env.NEXT_PUBLIC_HERO_VIDEO ??
  "/videos/kling_20260604_VIDEO_Image1A_su_5310_0_1920.webm"

/** Legacy outer-section anchor — kept so back-compat hash links still resolve */
export const CONSULTA_SECTION_ID = "#reserva-consulta"

/** Calendario de reserva (widget de agendamiento) */
export const BOOKING_SECTION_ID = "#reserva-consulta"

/** Campaña temporal — consulta gratuita 30 min solo esta semana */
export const HERO_CAMPAIGN = {
  active: true,
  badge: "Esta semana",
  title: "Consulta inicial gratuita — 30 min",
  detail:
    "Agenda sin costo tu primera conversación de orientación online.",
  /** Solo para el toast — el CTA del hero no menciona gratuita */
  ctaLabel: "Agendar consulta gratuita",
  /** Aparece 2 s después de cargar la landing */
  toastDelayMs: 2000,
} as const

export const SITE_TAGLINE =
  "Psicoanálisis y autoconocimiento para quienes buscan comprender profundamente su historia, sus patrones y su propósito."

export const FOOTER_SOCIAL = {
  whatsapp: "https://wa.me/56997392515",
  instagram: "https://www.instagram.com/fannytorresilva/",
  youtube: "https://www.youtube.com/@FannyTorresdasilva",
} as const

export const FOOTER_NAV = [
  { label: "Eneagrama", href: "/#eneagrama" },
  { label: "Eneatipos", href: "/#arquetipos" },
  { label: "Organizaciones", href: "/organizaciones" },
  { label: "Prensa", href: "/prensa" },
  { label: "Sobre mí", href: "/sobre-mi" },
  { label: "Libro", href: "/libro" },
  { label: "Reservar consulta", href: `/${CONSULTA_SECTION_ID}` },
] as const

/** Paleta de referencia (hojas / tierra) */
export const PALETTE = {
  taupe: "#967E66",
  brown: "#6A4128",
  espresso: "#3D2316",
  void: "#251105",
} as const

export const ARCHETYPE_CARDS = [
  {
    id: "alquimista",
    name: "El Alquimista",
    image: "/imgs/alquimista.webp",
    hint: "Transformación y sentido interior",
  },
  {
    id: "reformador",
    name: "El Reformador",
    image: "/imgs/reformador.webp",
    hint: "Orden, ética y búsqueda de integridad",
  },
  {
    id: "sombra",
    name: "La Sombra",
    image: "/imgs/sombra.webp",
    hint: "Lo que aún no ha podido nombrarse",
  },
] as const

export const SYMPTOMS = [
  "Ansiedad.",
  "Conflictos recurrentes.",
  "Repeticiones.",
  "Decisiones que se bloquean.",
] as const

export const ENTERPRISE_INQUIRY_EMAIL =
  process.env.NEXT_PUBLIC_ENTERPRISE_EMAIL ?? "consultas@fannytorresdasilva.com"

export const OFFERINGS = [
  {
    id: "terapia",
    label: "Psicoanálisis",
    title: "Sesiones con continuidad semanal",
    description:
      "Análisis personal para quienes buscan un espacio regular de exploración interior, trabajando desde el inconsciente.",
    locations: [
      { place: "CABA", mode: "Presencial" },
      { place: "Internacional", mode: "Online" },
    ],
    ctaLabel: "Reservar consulta",
    ctaHref: CONSULTA_SECTION_ID,
  },
  {
    id: "empresas",
    label: "Eneagrama",
    title: "Charlas para organizaciones empresariales y docentes. ",
    description:
      "Talleres y conferencias para equipos, líderes y cultura organizacional.",
    locations: [
      { place: "CABA", mode: "Presencial" },
      { place: "Internacional", mode: "Presencial" },
    ],
    ctaLabel: "Consultar charlas",
    ctaHref: "/organizaciones",
  },
] as const
