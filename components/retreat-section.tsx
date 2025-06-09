import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Clock, Users, Mountain, Heart, CheckCircle } from "lucide-react"
import Link from "next/link"

export function RetreatSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            Experiencias Transformadoras
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Sumérgete en experiencias inmersivas donde podrás conectar profundamente contigo mismo y con otros 
              buscadores del desarrollo personal a través del Eneagrama.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {/* Retiro Fin de Semana */}
          <Card className="flex flex-col h-full">
            <CardHeader>
              <div className="rounded-full bg-[#F5E6C3] p-3 w-fit dark:bg-[#8B6B2E]">
                <Mountain className="h-6 w-6 text-[#D4AF37] dark:text-[#F5E6C3]" />
              </div>
              <CardTitle>Curso introductorio</CardTitle>
              <CardDescription>Autoconocimiento y Transformación</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Una experiencia para profundizar en tu tipo de personalidad 
                  y desarrollar herramientas prácticas de crecimiento personal.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-[#D4AF37]" />
                    <span>por definir</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-[#D4AF37]" />
                    <span>Online por Zoom</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-[#D4AF37]" />
                    <span>-</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-[#D4AF37]" />
                    <span>Cantidad de participantes</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-2xl font-bold text-[#D4AF37]">Gratis</div>
                  <p className="text-xs text-gray-500"></p>
                </div>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <a
                href="https://wa.me/+56997392515?text=Hola,%20me%20interesa%20el%20Curso%20Introductorio%20de%20Eneagrama"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-md bg-[#D4AF37] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#BFA030] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] disabled:pointer-events-none disabled:opacity-50"
              >
                Reservar Lugar
              </a>
            </div>
          </Card>

          {/* Retiro Intensivo */}
          <Card className="flex flex-col h-full border-[#D4AF37] bg-gradient-to-b from-[#F5E6C3]/20 to-white dark:from-[#8B6B2E]/20 dark:to-gray-950">
            <CardHeader>
              <div className="rounded-full bg-[#D4AF37] px-3 py-1 text-sm font-semibold text-black w-fit mx-auto">
                Más Popular
              </div>
              <div className="rounded-full bg-[#F5E6C3] p-3 w-fit dark:bg-[#8B6B2E] mt-4">
                <Heart className="h-6 w-6 text-[#D4AF37] dark:text-[#F5E6C3]" />
              </div>
              <CardTitle>Retiro Intensivo de 3 Días</CardTitle>
              <CardDescription>Inmersión Completa en el Eneagrama</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Una experiencia transformadora de tres días donde vivirás una inmersión profunda 
                  en el Eneagrama con talleres y sesiones grupales.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-[#D4AF37]" />
                    <span>Próxima fecha: 15-17 de Agosto</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-[#D4AF37]" />
                    <span>Chile</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-[#D4AF37]" />
                    <span>3 días / 2 noche</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-[#D4AF37]" />
                    <span>Cupo: 20 max</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-2xl font-bold text-[#D4AF37]">$350.000 CLP</div>
                  <p className="text-xs text-gray-500">Incluye alojamiento, alimentación y talleres</p>
                </div>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <a
                href="https://wa.me/+56997392515?text=Hola,%20me%20interesa%20el%20Retiro%20Intensivo%20de%203%20D%C3%ADas"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-md bg-[#D4AF37] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#BFA030] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] disabled:pointer-events-none disabled:opacity-50"
              >
                Reservar Lugar
              </a>
            </div>
          </Card>

          {/* Taller Buenos Aires */}
          <Card className="flex flex-col h-full">
            <CardHeader>
              <div className="rounded-full bg-[#F5E6C3] p-3 w-fit dark:bg-[#8B6B2E]">
                <Heart className="h-6 w-6 text-[#D4AF37] dark:text-[#F5E6C3]" />
              </div>
              <CardTitle>Taller Presencial</CardTitle>
              <CardDescription>3 de Julio, 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Una experiencia práctica y personalizada para profundizar en el Eneagrama 
                  en un ambiente íntimo y colaborativo.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-[#D4AF37]" />
                    <span>3 de Julio, 2024</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-[#D4AF37]" />
                    <span>Buenos Aires, Argentina</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-[#D4AF37]" />
                    <span>1 sesión</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-[#D4AF37]" />
                    <span>Máximo 10 personas</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-2xl font-bold text-[#D4AF37]">$25.000 ARS</div>
                  <p className="text-xs text-gray-500">Incluye merienda</p>
                </div>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <a
                href="https://wa.me/+56997392515?text=Hola,%20me%20interesa%20el%20Taller%20Presencial%20en%20Buenos%20Aires"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-md bg-[#D4AF37] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#BFA030] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] disabled:pointer-events-none disabled:opacity-50"
              >
                Inscribirme
              </a>
            </div>
          </Card>
        </div>

        {/* Sección adicional con beneficios */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-8">¿Qué Incluyen Nuestros Retiros?</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-full bg-[#F5E6C3] p-3 dark:bg-[#8B6B2E]">
                <Heart className="h-6 w-6 text-[#D4AF37] dark:text-[#F5E6C3]" />
              </div>
              <h4 className="font-semibold">Alojamiento y alimentación</h4>
              <p className="text-sm text-gray-500 text-center">
                Trabajo individual adaptado a tu tipo de personalidad
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-full bg-[#F5E6C3] p-3 dark:bg-[#8B6B2E]">
                <Users className="h-6 w-6 text-[#D4AF37] dark:text-[#F5E6C3]" />
              </div>
              <h4 className="font-semibold">Dinámicas Grupales</h4>
              <p className="text-sm text-gray-500 text-center">
                Ejercicios colaborativos para el crecimiento mutuo
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-full bg-[#F5E6C3] p-3 dark:bg-[#8B6B2E]">
                <Mountain className="h-6 w-6 text-[#D4AF37] dark:text-[#F5E6C3]" />
              </div>
              <h4 className="font-semibold">Entorno Natural</h4>
              <p className="text-sm text-gray-500 text-center">
                Espacios diseñados para la reflexión y el descanso
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-full bg-[#F5E6C3] p-3 dark:bg-[#8B6B2E]">
                <Calendar className="h-6 w-6 text-[#D4AF37] dark:text-[#F5E6C3]" />
              </div>
              <h4 className="font-semibold">Material Exclusivo</h4>
              <p className="text-sm text-gray-500 text-center">
                Recursos y herramientas para continuar tu crecimiento
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/retiros">
            <Button size="lg" variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
              Ver Retiros pasados
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}