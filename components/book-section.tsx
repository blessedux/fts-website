import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"


export function BookSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="flex justify-center">
            <div className="relative h-[500px] w-[375px] overflow-hidden rounded-lg shadow-xl">
              <Image
                src="/imgs/portada_libro_final.png"
                alt="Libro de Eneagrama por Fanny Torres Da Silva"
                fill
                sizes="(max-width: 768px) 100vw, 375px"
                priority
                className="object-contain"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                El Libro Oficial de Eneagrama
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Lleva contigo todos los conocimientos del Eneagrama en este completo libro escrito por Fanny Torres
                Silva.
              </p>
            </div>
            <ul className="grid gap-2 py-4">
              <li className="flex items-center gap-2">
                <div className="rounded-full bg-green-100 p-1 dark:bg-green-800">
                  <svg
                    className="h-4 w-4 text-green-600 dark:text-green-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span>Historia y orígenes de los 9 Eneatipos</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="rounded-full bg-green-100 p-1 dark:bg-green-800">
                  <svg
                    className="h-4 w-4 text-green-600 dark:text-green-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span>Qué es el Eneagrama?</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="rounded-full bg-green-100 p-1 dark:bg-green-800">
                  <svg
                    className="h-4 w-4 text-green-600 dark:text-green-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span>Eneatipos de la personalidad</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="rounded-full bg-green-100 p-1 dark:bg-green-800">
                  <svg
                    className="h-4 w-4 text-green-600 dark:text-green-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span>Envíos a todo el mundo</span>
              </li>
            </ul>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <div className="text-3xl font-bold">$24.990 CLP</div>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/libro">
                <Button size="lg" className="bg-[#D4AF37] hover:bg-[#BFA030] text-black font-semibold">
                  Comprar Ahora
                </Button>
              </Link>
              <Link href="/libro#detalles">
                <Button size="lg" variant="outline">
                  Ver Detalles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
