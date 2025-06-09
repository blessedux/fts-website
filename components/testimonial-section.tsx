import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"

export function TestimonialSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Lo que Dicen Nuestros Estudiantes</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Descubre cómo el Eneagrama ha transformado la vida de quienes han tomado nuestros cursos.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">Carolina Mendoza</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tipo 2</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                "El curso de Fanny transformó mi forma de relacionarme con los demás. Ahora entiendo por qué actúo como
                lo hago y cómo puedo mejorar mis relaciones personales y profesionales."
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center gap-4">
                <div className="relative w-10 h-10 overflow-hidden rounded-full">
                  <Image
                    src="/imgs/union7.png"
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Rodrigo Valenzuela</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tipo 8</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                "Como líder de equipo, el Eneagrama me ha dado herramientas invaluables para entender las motivaciones
                de cada miembro y potenciar sus fortalezas. El enfoque de Fanny es práctico y transformador."
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">Valentina Rojas</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tipo 4</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                "El libro y el curso online se complementan perfectamente. He podido profundizar en mi autoconocimiento
                a mi propio ritmo y aplicar lo aprendido en mi día a día. Totalmente recomendado."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
