'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export function RadioProgramSection() {
  return (
    <section className="relative w-full min-h-screen py-24">
      <div 
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{
          backgroundImage: 'url(/imgs/dejame-ver.jpg)',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-blue-900/60" />
      </div>
      <div className="container relative px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">Dejáme Ver</h2>
            <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              ECOMEDIOS AM 1220 · VIERNES 22 A 24 HS
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Programa Semanal</CardTitle>
              <CardDescription className="text-gray-200">Todos los Viernes a las 22hs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Únete a nuestra discusión semanal sobre crecimiento y desarrollo personal
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Entrevistas Especiales</CardTitle>
              <CardDescription className="text-gray-200">Serie Mensual</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Entrevistas exclusivas con líderes y expertos en desarrollo personal
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Preguntas y Respuestas</CardTitle>
              <CardDescription className="text-gray-200">Todos los episodios</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Sesiones interactivas donde respondemos tus preguntas en vivo
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col items-center space-y-4 mt-12">
          <a 
            href="https://www.youtube.com/live/WBuQkJ1Co50?si=UyPuHPhy-nj5h9L7"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button 
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-6 text-lg"
            >
              Ver Programa en Vivo
            </Button>
          </a>
          <Button 
            size="lg"
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-6 text-lg"
            onClick={() => window.open('https://www.youtube.com/@ecomedios4035/search?query=dejame%20ver', '_blank')}
          >
            Ver Programas Anteriores
          </Button>
        </div>
      </div>
    </section>
  )
} 