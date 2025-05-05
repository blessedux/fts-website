import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 h-[800px]">
        <Image
          src="/fts-background.png"
          alt="Background"
          fill
          sizes="100vw"
          quality={90}
          className="object-cover"
          priority
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                Descubre el Poder del Eneagrama
              </h1>
              <p className="max-w-[600px] text-gray-200 md:text-xl">
                Transforma tu vida comprendiendo tu personalidad y la de quienes te rodean. Aprende con Fanny Torres Da
                Silva, experta en Eneagrama.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/curso">
                <Button size="lg" className="bg-[#D4AF37] hover:bg-[#BFA030] text-black font-semibold">
                  Comenzar mi Viaje
                </Button>
              </Link>
              <Link href="/sobre-mi">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white/40">
                  Conocer a Fanny
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px] rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
              <Image
                src="/fanny-profile.jpg"
                alt="Fanny Torres Da Silva"
                fill
                sizes="(max-width: 768px) 350px, (max-width: 1200px) 400px, 500px"
                quality={90}
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
