"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AnimatedHighlight } from '@/components/ui/animated-highlight'
import { motion, AnimatePresence } from 'framer-motion'

export default function BioPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Profile Image Section */}
            <div className="relative aspect-square w-full max-w-md mx-auto">
              <Image
                src="/imgs/DSC_0198.jpg"
                alt="Fanny Torres Silva"
                fill
                className="object-cover object-top rounded-lg shadow-lg mx-auto"
                priority
              />
            </div>

            {/* Bio Content Section */}
            <AnimatePresence mode="wait">
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h1 className="text-4xl font-bold text-primary mb-8">Sobre la Autora</h1>
                <div className="prose prose-lg max-w-none space-y-6">
                  <motion.div 
                    className="leading-relaxed text-gray-800 dark:text-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <AnimatedHighlight index={0}>Fanny Torres Silva</AnimatedHighlight> es una destacada <AnimatedHighlight index={1}>Eneagramista</AnimatedHighlight> y experta en <AnimatedHighlight index={2}>desarrollo personal</AnimatedHighlight>, 
                    cuyo viaje profesional y académico refleja una pasión profunda por el <AnimatedHighlight index={3}>auto-conocimiento</AnimatedHighlight> 
                    y la <AnimatedHighlight index={4}>transformación</AnimatedHighlight>.
                  </motion.div>
                  <motion.div 
                    className="leading-relaxed text-gray-800 dark:text-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Su carrera comenzó en <AnimatedHighlight index={5}>Chile</AnimatedHighlight>, donde se formó como profesora, y pronto expandió sus 
                    horizontes en <AnimatedHighlight index={6}>Educación para la Creatividad</AnimatedHighlight> en Londres. Su sed de conocimiento la 
                    llevó a estudiar desde <AnimatedHighlight index={7}>Estados Unidos</AnimatedHighlight>, donde se certificó en <AnimatedHighlight index={8}>Programación 
                    Neurolingüística (PNL)</AnimatedHighlight> e <AnimatedHighlight index={9}>hipnosis Ericksoniana</AnimatedHighlight>, herramientas clave que enriquecen 
                    su enfoque único del Eneagrama.
                  </motion.div>
                  <motion.div 
                    className="leading-relaxed text-gray-800 dark:text-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    Actualmente, Fanny continúa su formación en <AnimatedHighlight index={10}>Psicoanálisis</AnimatedHighlight> en <AnimatedHighlight index={11}>Buenos Aires</AnimatedHighlight>, integrando 
                    un enfoque <AnimatedHighlight index={12}>multidisciplinario</AnimatedHighlight> en su práctica. Su amor por la <AnimatedHighlight index={13}>mitología griega</AnimatedHighlight> y su 
                    fascinación por la lectura no solo han forjado su perspectiva profesional, sino que 
                    también constituyen los pilares de su vida personal.
                  </motion.div>
                  <motion.div 
                    className="leading-relaxed text-gray-800 dark:text-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    Como autora, <AnimatedHighlight index={13}>Fanny Torres Silva</AnimatedHighlight> fusiona su entusiasmo por el aprendizaje con un firme 
                    compromiso con el <AnimatedHighlight index={14}>desarrollo personal</AnimatedHighlight>. Su enfoque <AnimatedHighlight index={15}>innovador</AnimatedHighlight> y su vasta experiencia 
                    hacen que su trabajo como Eneagramista sea una guía invaluable para quienes buscan 
                    una comprensión más profunda de sí mismos y desean transformar sus vidas de manera 
                    significativa.
                  </motion.div>
                </div>

                {/* Call to Action Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 pt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  <Button asChild className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#BFA030] text-black font-semibold">
                    <Link href="/libro">
                      Conoce mi Libro
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full sm:w-auto border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10">
                    <Link href="/curso">
                      Explora mis Cursos
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
} 