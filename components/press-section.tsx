"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { ChevronDown, ChevronUp } from "lucide-react"


export function PressSection() {
  const [showAllImages, setShowAllImages] = useState(false)

  const pressImages = [
    {
      id: 1,
      src: "/imgs/prensa1.png",
      alt: "Fanny Torres en entrevista de televisión nacional",
      caption: "Entrevista en Radio Agricultura",
      date: "2024",
      url: "https://www.radioagricultura.cl/noticias/2023/10/01/fanny-torres-da-silva-entrevista/"
    },
    {
      id: 2,
      src: "/imgs/prensa2.png", 
      alt: "La Hora",
      caption: "La Hora",
      date: "2024",
      url: "https://lahora.cl/estilo-de-vida/2024/07/19/autoconocimiento-y-relaciones-humanas-el-eneagrama-como-herramienta-para-conocernos-y-comprender-nuestro-rol-en-la-sociedad/"
    },
    {
      id: 3,
      src: "/imgs/prensa3.png",
      alt: "Artículo en La Cuarta",
      caption: "Artículo destacado en La Cuarta",
      date: "2024"
    },
    {
      id: 4,
      src: "/imgs/prensa4.png",
      alt: "Participación en programa radial",
      caption: "Entrevista en Radio Cooperativa",
      date: "2024",
      url: "https://www.youtube.com/live/iT_lUkJXAmI"
    },
    {
      id: 5,
      src: "/imgs/prensa5.png",
      alt: "Nación Web",
      caption: "Artículo en Nación Web",
      date: "2024",
      url: "https://nacionweb.com.ar/la-autora-chilena-fanny-torres-silva-profundiza-en-el-autodescubrimiento-con-su-nuevo-libro-reconfigurando-el-ser-el-eneagrama-como-mapa-en-tiempos-de-crisis-2/"
    },
    {
      id: 6,
      src: "/imgs/prensa6.png",
      alt: "Corrientes de Tarde",
      caption: "Artículo en Corrientes de Tarde",
      date: "2024",
      url: "https://corrientesdetarde.com/index.php/bienestar-y-salud/revelando-los-nueve-arquetipos-del-eneagrama-reconfigurar-el-ser-de-fanny-torres-silva-proporciona-una-hoja-de-ruta-para-la-autocomprension-y-la-transformacion/"
    },
    {
      id: 7,
      src: "/imgs/prensa7.png",
      alt: "Entrevista en Conexión Abierta",
      caption: "Entrevista en Conexión Abierta",
      date: "2024",
      url: "https://www.youtube.com/watch?v=FMVyBESKl-Q"
    },
    {
      id: 8,
      src: "/imgs/prensa8.png",
      alt: "Entrevista Alunízate",
      caption: "Entrevista en Alunízate",
      date: "2024",
      url: "https://www.youtube.com/watch?v=WEY7ELHnsrc"
    },
    {
      id: 9,
      src: "/imgs/prensa9.png",
      alt: "Artículo en DataBA",
      caption: "Artículo en DataBA",
      date: "2024",
      url: "https://databa.ar/nota/5252/la-maestra-de-eneagrama-fanny-torres-silva-presenta-su-libro-reconfigurando-el-ser/"
    },
    {
      id: 10,
      src: "/imgs/prensa10.png",
      alt: "Artículo en Dequeruza",
      caption: "Artículo en dequeruza.ar",
      date: "2024",
      url: "https://dequeruza.ar/la-maestra-de-eneagrama-fanny-torres-silva-presenta-su-libro-reconfigurando-el-ser-el-eneagrama-como-mapa-en-tiempos-de-crisis-en-la-feria-internacional-del-libro-de-buenos-aires/"
    },
    {
      id: 11,
      src: "/imgs/prensa11.png",
      alt: "Artículo en norteenlinea.com",
      caption: "Artículo en norteenlinea.com",
      date: "2024",
      url: "https://norteenlinea.com/buenos-aires/la-maestra-de-eneagrama-fanny-torres-silva-presenta-su-libro-reconfigurando-el-ser-el-eneagrama-como-mapa-en-tiempos-de-crisis-en-la-feria-internacional-del-libro-de-buenos-aires"
    },
    {
      id: 12,
      src: "/imgs/prensa12.png",
      alt: "Latamnoticias",
      caption: "Artículo en Latam Noticias",
      date: "2024",
      url: "https://latamnoticias.com/informacion-general/fanny-torres-silva-presento-en-buenos-aires-su-libro-reconfigurando-el-ser-el-eneagrama-como-mapa-en-tiempos-de-crisis/"
    },
    {
      id: 13,
      src: "/imgs/prensa13.png",
      alt: "Artículo en Buenos Aires no duerme",
      caption: "Artículo en Buenos Aires No Duerme",
      date: "2024",
      url: "https://buenosairesnoduerme.com.ar/2024/05/04/fanny-torres-silva-la-maestra-de-eneagrama-presento-su-obra-en-la-feria-del-libro/"
    },
    {
      id: 14,
      src: "/imgs/prensa14.png",
      alt: "Artículo en el Portal Bonaerense",
      caption: "Artículo en el Portal Bonaerense",
      date: "2024",
      url: "https://elportalbonaerense.com.ar/la-maestra-de-eneagrama-fanny-torres-silva-presenta-su-libro-reconfigurando-el-ser-el-eneagrama-como-mapa-en-tiempos-de-crisis-en-la-feria-internacional-del-libro-de-buenos-aires/"
    },
    {
      id: 15,
      src: "/imgs/prensa15.png",
      alt: "Artículo en informa BA",
      caption: "Artículo en informa BA",
      date: "2024",
      url: "https://informaba.ar/la-maestra-de-eneagrama-fanny-torres-silva-presenta-su-libro-reconfigurando-el-ser-el-eneagrama-como-mapa-en-tiempos-de-crisis-en-la-feria-internacional-del-libro-de-buenos-aires/"
    },
    {
      id: 16,
      src: "/imgs/prensa16.png",
      alt: "Artículo en Panorama Directo",
      caption: "Artículo en Panorama Directo",
      date: "2024",
      url: "https://panoramadirecto.com/2024/05/fanny-torres-silva-presenta-reconfigurando-el-ser-el-eneagrama-como-mapa-en-tiempos-de-crisis-en-la-feria-del-libro.html"
    },
    {
      id: 17,
      src: "/imgs/prensa17.png",
      alt: "Artículo en La Capital del Sol",
      caption: "Artículo en La Capital del Sol USA",
      date: "2024",
      url: "https://lacapitaldelsol.com/fanny-torres-silva-presento-su-obra-reconfigurando-el-ser-el-eneagrama-como-mapa-en-tiempos-de-crisis-en-argentina/"
    },
    {
      id: 18,
      src: "/imgs/prensa18.png",
      alt: "Artículo en Telenews América",
      caption: "Artículo en Telenews América",
      date: "2024",
      url: "https://www.telenewsamerica.com/2024/05/fanny-torres-silva-la-maestra-de.html"
    }
  ]

  const imagesToShow = showAllImages ? pressImages : pressImages.slice(0, 6)

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Prensa y Medios</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Descubre las últimas apariciones en medios y cobertura de prensa de Fanny Torres Da Silva
            </p>
          </div>
        </div>
        
        <div className="mt-12">
          {/* Galería de imágenes */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {imagesToShow.map((image) => (
              <div key={image.id} className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                
                {/* Overlay con información */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Información de la imagen */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button
                    onClick={() => window.open(image.url, '_blank', 'noopener,noreferrer')}
                    className="text-left w-full hover:text-gray-200 transition-colors duration-200"
                    aria-label={`Leer más sobre: ${image.caption}`}
                  >
                    <p className="text-sm font-medium hover:underline">{image.caption}</p>
                    <p className="text-xs opacity-80">{image.date}</p>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Chevron para mostrar/ocultar imágenes adicionales */}
          {pressImages.length > 6 && (
            <div className="mt-8 text-center">
              <button 
                onClick={() => setShowAllImages(!showAllImages)}
                className="group flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:bg-gray-50"
                aria-label={showAllImages ? "Mostrar menos imágenes" : "Ver todas las imágenes"}
              >
                {showAllImages ? (
                  <ChevronUp className="h-6 w-6 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
                )}
              </button>
              <p className="mt-2 text-sm text-gray-500">
                {showAllImages ? "Mostrar menos" : "Ver más imágenes"}
              </p>
            </div>
          )}
          
          {/* Texto adicional */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Fanny Torres Da Silva ha sido reconocida en diversos medios de comunicación por su expertise en Eneagrama 
              y su contribución al desarrollo personal en Chile y Latinoamérica.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 