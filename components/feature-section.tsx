import { BookOpen, Users, Award, Video } from "lucide-react"

export function FeatureSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-[#F5E6C3] px-3 py-1 text-sm dark:bg-[#8B6B2E]">
              Metodología Única
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Descubre Todo lo que Ofrecemos</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Nuestra plataforma te ofrece múltiples formas de aprender y crecer a través del Eneagrama.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-[#F5E6C3] p-3 dark:bg-[#8B6B2E]">
              <Video className="h-6 w-6 text-[#D4AF37] dark:text-[#F5E6C3]" />
            </div>
            <h3 className="text-xl font-bold">Clases Online</h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Sesiones en vivo vía Zoom con Fanny para profundizar en el Eneagrama.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-[#F5E6C3] p-3 dark:bg-[#8B6B2E]">
              <Award className="h-6 w-6 text-[#D4AF37] dark:text-[#F5E6C3]" />
            </div>
            <h3 className="text-xl font-bold">Certificaciones</h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Conviértete en un profesional certificado del Eneagrama.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-[#F5E6C3] p-3 dark:bg-[#8B6B2E]">
              <Users className="h-6 w-6 text-[#D4AF37] dark:text-[#F5E6C3]" />
            </div>
            <h3 className="text-xl font-bold">Retiros</h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Experiencias inmersivas para conectar profundamente con tu tipo de personalidad.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-[#F5E6C3] p-3 dark:bg-[#8B6B2E]">
              <BookOpen className="h-6 w-6 text-[#D4AF37] dark:text-[#F5E6C3]" />
            </div>
            <h3 className="text-xl font-bold">Libro Oficial</h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Adquiere el libro físico con todos los fundamentos del Eneagrama.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
