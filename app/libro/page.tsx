import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

export default function BookPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex justify-center">
                <div className="relative h-[500px] w-[350px] overflow-hidden rounded-lg shadow-xl bg-white">
                  <Image
                    src="/imgs/portada_libro_final.png"
                    alt="Libro de Eneagrama por Fanny Torres Da Silva"
                    width={350}
                    height={500}
                    className="object-contain"
                    priority
                    quality={100}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    El Libro Oficial del Eneagrama
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">Por Fanny Torres Da Silva</p>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <svg className="h-4 w-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <svg className="h-4 w-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <svg className="h-4 w-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <svg className="h-4 w-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">(128 reseñas)</span>
                </div>
                <div className="text-3xl font-bold">$24.990 CLP</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Envío a todo Chile. Tiempo estimado de entrega: 3-5 días hábiles.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                    Comprar Ahora
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="detalles" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-8">
              <div>
                <h2 className="text-2xl font-bold">Descripción</h2>
                <div className="mt-4 space-y-4">
                  <p>
                    Este libro es una guía completa para comprender y aplicar el Eneagrama en tu vida diaria. Escrito
                    por Fanny Torres Da Silva, experta en Eneagrama con más de 15 años de experiencia, este libro te
                    llevará en un viaje de autodescubrimiento y transformación personal.
                  </p>
                  <p>
                    A través de sus páginas, descubrirás los nueve tipos de personalidad del Eneagrama, sus
                    motivaciones, miedos, deseos y patrones de comportamiento. Aprenderás a identificar tu tipo
                    principal y a comprender cómo influye en tus relaciones, trabajo y desarrollo personal.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold">Contenido</h2>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Introducción al Eneagrama y su historia</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Descripción detallada de los 9 tipos de personalidad</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Alas, subtipos y niveles de desarrollo</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>El Eneagrama en las relaciones personales</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Aplicación del Eneagrama en el ámbito laboral</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Ejercicios prácticos y reflexiones</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Caminos de crecimiento para cada tipo</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold">Detalles del Producto</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="font-semibold">Formato</h3>
                    <p className="text-gray-500 dark:text-gray-400">Tapa blanda</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Páginas</h3>
                    <p className="text-gray-500 dark:text-gray-400">320</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Idioma</h3>
                    <p className="text-gray-500 dark:text-gray-400">Español</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">ISBN</h3>
                    <p className="text-gray-500 dark:text-gray-400">978-956-XXXXX-X-X</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Dimensiones</h3>
                    <p className="text-gray-500 dark:text-gray-400">15 x 23 cm</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Año de publicación</h3>
                    <p className="text-gray-500 dark:text-gray-400">2023</p>
                  </div>
                </div>
              </div>

              {/* PDF Previewer */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Previsualiza el libro</h2>
                <div className="w-full h-[600px] rounded-lg overflow-hidden border shadow">
                  <iframe
                    src="/imgs/Torres%20Silva_Fanny%2022-12-23%20tapa.pdf"
                    title="Previsualización del libro Eneagrama"
                    width="100%"
                    height="100%"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
