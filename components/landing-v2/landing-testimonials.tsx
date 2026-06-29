"use client"

import { CircularTestimonials } from "@/components/ui/circular-testimonials"

const TESTIMONIALS = [
  {
    name: "Angélica",
    image: "/imgs/test1.webp",
    text: "Estaré siempre profundamente agradecida con Fanny. Su calidez, empatía y profunda sabiduría en el psicoanálisis y el Eneagrama me brindaron las herramientas necesarias para comprenderme de verdad y transformar positivamente mi forma de relacionarme con el mundo.",
  },
  {
    name: "Pamela",
    image: "/imgs/test2.webp",
    text: "Iniciar este camino con Fanny marcó un antes y un después en mi vida. Encontré un espacio seguro para soltar mandatos automáticos, comprender mis miedos profundos y aprender a decidir desde mi propia libertad. Un acompañamiento excepcional.",
  },
  {
    name: "Ramiro",
    image: "/imgs/test3.webp",
    text: "Una experiencia humana y terapéutica invaluable. La capacidad de Fanny para escuchar, descifrar bloqueos emocionales del inconsciente y guiarme a través del Eneagrama ha sido el mejor regalo que he podido recibir para mi desarrollo personal.",
  },
  {
    name: "Melina",
    image: "/imgs/test4.webp",
    text: "El trabajo terapéutico con Fanny ha sido una de las decisiones más importantes de mi vida. Su contención afectiva y claridad intelectual me han guiado hacia una mayor libertad interior y una relación mucho más compasiva conmigo misma.",
    objectPosition: "center 20%",
  },
  {
    name: "Victoria",
    image: "/imgs/test5.webp",
    text: "Gracias eternas a Fanny por su acompañamiento tan humano y profesional. Sus sesiones me permitieron salir del piloto automático, comprender mis patrones de comportamiento recurrentes y tomar decisiones de vida cruciales con total paz.",
    objectPosition: "center 20%",
  },
]

export function LandingTestimonials() {
  const mapped = TESTIMONIALS.map((item) => ({
    quote: item.text,
    name: item.name,
    designation: "Paciente",
    src: item.image,
    objectPosition: item.objectPosition,
  }))

  return (
    <section id="testimonios" className="relative border-t border-[#b8954a]/15 bg-[var(--lv2-void)] py-24 md:py-32 z-20 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="text-center mb-12">
          <p className="lv2-section-label mb-4">Testimonios</p>
          <h2 className="lv2-display text-3xl text-[#f4efe4] md:text-5xl">
            Historias de Transformación
          </h2>
          <div className="lv2-gold-line my-8 max-w-[120px] mx-auto" />
          <p className="lv2-body text-base md:text-lg max-w-2xl mx-auto text-[var(--lv2-ivory-muted)]">
            Palabras de quienes han transitado el proceso de autoconocimiento, psicoanálisis y Eneagrama, y la profunda gratitud hacia el camino recorrido.
          </p>
        </div>

        <div className="flex justify-center items-center">
          <CircularTestimonials
            testimonials={mapped}
            autoplay={true}
            colors={{
              name: "#f4efe4",
              designation: "var(--lv2-taupe)",
              testimony: "#e0d4c8",
              arrowBackground: "var(--lv2-ink)",
              arrowForeground: "var(--lv2-ivory)",
              arrowHoverBackground: "#b8954a",
            }}
            fontSizes={{
              name: "28px",
              designation: "13px",
              quote: "22px",
            }}
          />
        </div>
      </div>
    </section>
  )
}
