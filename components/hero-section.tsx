import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative w-full h-[100vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/imgs/fts_hero_background.png"
          alt="Background"
          fill
          sizes="100vw"
          quality={90}
          className="object-cover"
          priority
        />
      </div>
      
      <div className="container relative z-10 h-full px-4 md:px-6">
        <div className="grid h-full items-center gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                'Descubre el Poder del Eneagrama'
              </h1>
              <p className="max-w-[600px] text-gray-200 md:text-xl">
                Transforma tu vida aprendiedo de tu personalidad <br></br> y la de quienes te rodean. 
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
          <div className="relative h-full">
            <div className="absolute bottom-0 right-0 w-[600px] sm:w-[700px] lg:w-[900px] h-[110%]">
              <Image
                src="/imgs/fts_hero_top.png"
                alt="Fanny Torres Da Silva"
                fill
                sizes="(max-width: 768px) 600px, (max-width: 1200px) 700px, 900px"
                quality={90}
                className="object-contain object-bottom"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
