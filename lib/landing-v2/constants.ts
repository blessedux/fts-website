export const LANDING_HERO_VIDEO =
  process.env.NEXT_PUBLIC_HERO_VIDEO ??
  "/videos/kling_20260604_VIDEO_Image1A_su_5310_0_1920.webm"

export const CONSULTA_SECTION_ID = "#consulta"

/** Calendario de reserva (widget de agendamiento) */
export const BOOKING_SECTION_ID = "#reserva-consulta"

/** Campaña temporal — consulta gratuita 30 min solo esta semana */
export const HERO_CAMPAIGN = {
  active: true,
  badge: "Esta semana",
  title: "Consulta inicial gratuita — 30 min",
  detail:
    "Agenda sin costo tu primera conversación de orientación. Presencial en CABA u online desde Chile.",
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
  { label: "Arquetipos", href: "/#arquetipos" },
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
  "La ansiedad.",
  "Los conflictos recurrentes.",
  "Las relaciones que se repiten.",
  "Las decisiones que parecen bloquearse.",
] as const

export const ENTERPRISE_INQUIRY_EMAIL =
  process.env.NEXT_PUBLIC_ENTERPRISE_EMAIL ?? "consultas@fannytorresdasilva.com"

export const OFFERINGS = [
  {
    id: "terapia",
    label: "Proceso terapéutico",
    title: "Sesiones con continuidad semanal",
    description:
      "Psicoanálisis y acompañamiento para quienes buscan un espacio regular de exploración interior — comprender patrones, historia y transformación en el tiempo.",
    locations: [
      { place: "CABA", mode: "Presencial" },
      { place: "Chile", mode: "Online" },
    ],
    ctaLabel: "Reservar consulta",
    ctaHref: CONSULTA_SECTION_ID,
  },
  {
    id: "empresas",
    label: "Organizaciones",
    title: "Charlas de eneagrama para empresas",
    description:
      "Talleres y conferencias sobre equipo, liderazgo y cultura organizacional. El eneagrama como mapa para leer dinámicas colectivas, no como etiqueta.",
    locations: [
      { place: "CABA", mode: null },
      { place: "Chile", mode: null },
      { place: "Internacional", mode: null },
    ],
    ctaLabel: "Consultar charlas",
    ctaHref: `mailto:${ENTERPRISE_INQUIRY_EMAIL}?subject=Charlas%20de%20eneagrama%20para%20empresas`,
  },
] as const
