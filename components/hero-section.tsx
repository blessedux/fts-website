"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Calculate blur: 0 at scroll 0, max 10px blur at scroll 200px (mobile only)
  const maxScroll = 200
  const maxBlur = 10
  const blurAmount = isMobile ? Math.min((scrollY / maxScroll) * maxBlur, maxBlur) : 0
  
  // Calculate scale: 1 at scroll 0, max 1.15 at scroll 200px (mobile only) to prevent background showing
  const maxScale = 1.15
  const scaleAmount = isMobile ? 1 + Math.min((scrollY / maxScroll) * (maxScale - 1), maxScale - 1) : 1

  return (
    <section className="relative w-full h-[100vh] overflow-hidden -mt-16">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/imgs/fts_hero_bg_2.webp"
          alt="Background"
          fill
          sizes="100vw"
          quality={90}
          className="object-cover object-[72%_center] md:object-center transition-all duration-300"
          style={{ 
            filter: `blur(${blurAmount}px)`,
            transform: `scale(${scaleAmount})`
          }}
          priority
        />
      </div>
      
      <div className="container relative z-10 h-full px-4 md:px-6 pt-16">
        <div className="flex flex-col h-full justify-end pb-8 md:pb-12">
          <div className="mb-6 md:mb-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                Descubre el Poder del Eneagrama
              </h1>
              <p className="max-w-[600px] text-gray-200 md:text-xl">
                Transforma tu vida aprendiendo de tu personalidad <br></br> y la de quienes te rodean. 
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center md:justify-start">
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
      </div>
    </section>
  )
}
