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
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight"> Nuestra plataforma</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Te ofrecemos múltiples formas de aprender y crecer a través del Eneagrama.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
          <div className="flex flex-col h-full rounded-lg border p-6 shadow-sm">
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="rounded-full bg-[#F5E6C3] p-3 dark:bg-[#8B6B2E]">
                  <Video className="h-6 w-6 text-[#D4AF37] dark:text-[#F5E6C3]" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center">Clases Online</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Sesiones en vivo vía Zoom.
              </p>
            </div>
            <div className="mt-auto pt-6">
              <a
                href="https://wa.me/+56997392515"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-[#F5E6C3] px-4 py-2 text-sm font-medium text-[#8B6B2E] shadow transition-colors hover:bg-[#8B6B2E] hover:text-[#F5E6C3] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5E6C3] disabled:pointer-events-none disabled:opacity-50"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Inscribirme
              </a>
            </div>
          </div>
          <div className="flex flex-col h-full rounded-lg border p-6 shadow-sm">
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="rounded-full bg-[#F5E6C3] p-3 dark:bg-[#8B6B2E]">
                  <Award className="h-6 w-6 text-[#D4AF37] dark:text-[#F5E6C3]" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center">Talleres Presenciales</h3>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1 text-center">
                <li>Talleres para profesores</li>
                <li>Talleres para empresas</li>
                <li>Talleres de crecimiento</li>
              </ul>
            </div>
            <div className="mt-auto pt-6">
              <a
                href="https://wa.me/+56997392515"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-[#F5E6C3] px-4 py-2 text-sm font-medium text-[#8B6B2E] shadow transition-colors hover:bg-[#8B6B2E] hover:text-[#F5E6C3] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5E6C3] disabled:pointer-events-none disabled:opacity-50"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Inscribirme
              </a>
            </div>
          </div>
          <div className="flex flex-col h-full rounded-lg border p-6 shadow-sm">
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="rounded-full bg-[#F5E6C3] p-3 dark:bg-[#8B6B2E]">
                  <Users className="h-6 w-6 text-[#D4AF37] dark:text-[#F5E6C3]" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center">Retiros</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Experiencias inmersivas para conectar profundamente con tu tipo de personalidad.
              </p>
            </div>
            <div className="mt-auto pt-6">
              <a
                href="https://wa.me/+56997392515"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-[#F5E6C3] px-4 py-2 text-sm font-medium text-[#8B6B2E] shadow transition-colors hover:bg-[#8B6B2E] hover:text-[#F5E6C3] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5E6C3] disabled:pointer-events-none disabled:opacity-50"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Inscribirme
              </a>
            </div>
          </div>
          <div className="flex flex-col h-full rounded-lg border p-6 shadow-sm">
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="rounded-full bg-[#F5E6C3] p-3 dark:bg-[#8B6B2E]">
                  <BookOpen className="h-6 w-6 text-[#D4AF37] dark:text-[#F5E6C3]" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center">Libro Oficial</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Adquiere el libro físico con todos los fundamentos del Eneagrama.
              </p>
            </div>
            <div className="mt-auto pt-6">
              <a
                href="/libro"
                className="inline-flex items-center justify-center rounded-md bg-[#F5E6C3] px-4 py-2 text-sm font-medium text-[#8B6B2E] shadow transition-colors hover:bg-[#8B6B2E] hover:text-[#F5E6C3] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5E6C3] disabled:pointer-events-none disabled:opacity-50"
              >
                Comprar Libro
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
