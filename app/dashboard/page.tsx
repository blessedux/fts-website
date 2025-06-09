"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, BookOpen, Clock, Download, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DashboardPage() {
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching user progress from API
    const fetchUserProgress = async () => {
      try {
        setLoading(true)
        // Fetch data from our mock API
        const res = await fetch("/api/course/progress?userId=1")
        const data = await res.json()

        // Update progress state with the fetched data
        setProgress(data.progress || 66)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user progress:", error)
        // Fallback to default progress value
        setProgress(66)
        setLoading(false)
      }
    }

    fetchUserProgress()
  }, [])

  return (
    <>
      <div className="container px-4 py-6 md:px-6 md:py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mi Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Bienvenido de vuelta a tu curso de Eneagrama</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Progreso del Curso</CardTitle>
              <CardDescription>Continúa donde lo dejaste</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso general</span>
                  <span className="font-medium">{loading ? "Cargando..." : `${progress}%`}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="mt-6">
                <h3 className="mb-2 font-medium">Último módulo visto:</h3>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-rose-100 p-2 dark:bg-rose-900">
                      <Play className="h-4 w-4 text-rose-600 dark:text-rose-200" />
                    </div>
                    <div>
                      <p className="font-medium">Centros de Inteligencia</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Módulo 3 - Mental, Emocional e Instintivo
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/curso/3" className="w-full">
                <Button className="w-full bg-rose-600 hover:bg-rose-700">Continuar Aprendiendo</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Próximos Eventos</CardTitle>
              <CardDescription>Clases y retiros programados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-rose-100 p-2 dark:bg-rose-900">
                      <Clock className="h-4 w-4 text-rose-600 dark:text-rose-200" />
                    </div>
                    <div>
                      <p className="font-medium">Sesión Grupal: Preguntas y Respuestas</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">15 de Junio, 2023 - 19:00 hrs</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-rose-100 p-2 dark:bg-rose-900">
                      <Clock className="h-4 w-4 text-rose-600 dark:text-rose-200" />
                    </div>
                    <div>
                      <p className="font-medium">Retiro de Fin de Semana: Autoconocimiento</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">24-26 de Julio, 2023</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/eventos" className="w-full">
                <Button variant="outline" className="w-full">
                  Ver Todos los Eventos
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recursos</CardTitle>
              <CardDescription>Material complementario</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-rose-100 p-2 dark:bg-rose-900">
                      <BookOpen className="h-4 w-4 text-rose-600 dark:text-rose-200" />
                    </div>
                    <div>
                      <p className="font-medium">Guía de Ejercicios Prácticos</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PDF - 24 páginas</p>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-auto">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Descargar</span>
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-rose-100 p-2 dark:bg-rose-900">
                      <BookOpen className="h-4 w-4 text-rose-600 dark:text-rose-200" />
                    </div>
                    <div>
                      <p className="font-medium">Test de Identificación de Tipo</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PDF - 8 páginas</p>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-auto">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Descargar</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/recursos" className="w-full">
                <Button variant="outline" className="w-full">
                  Ver Todos los Recursos
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="modules">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="modules">Módulos del Curso</TabsTrigger>
              <TabsTrigger value="certificate">Mi Certificado</TabsTrigger>
              <TabsTrigger value="purchases">Mis Compras</TabsTrigger>
            </TabsList>

            <TabsContent value="modules" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((moduleId) => (
                  <Card key={moduleId} className={moduleId > 3 ? "opacity-60" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Módulo {moduleId}</CardTitle>
                        {moduleId <= 2 && (
                          <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-100">
                            Completado
                          </div>
                        )}
                        {moduleId === 3 && (
                          <div className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100">
                            En progreso
                          </div>
                        )}
                        {moduleId > 3 && (
                          <div className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            Bloqueado
                          </div>
                        )}
                      </div>
                      <CardDescription>
                        {moduleId === 1 && "Introducción al Eneagrama"}
                        {moduleId === 2 && "Descubre tu Tipo"}
                        {moduleId === 3 && "Centros de Inteligencia"}
                        {moduleId === 4 && "Alas y Subtipos"}
                        {moduleId === 5 && "Niveles de Desarrollo"}
                        {moduleId === 6 && "Relaciones Interpersonales"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Duración: 2-3 horas</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link href={moduleId > 3 ? "#" : `/curso/${moduleId}`} className="w-full">
                        <Button
                          variant={moduleId > 3 ? "outline" : "default"}
                          className={`w-full ${moduleId <= 3 ? "bg-rose-600 hover:bg-rose-700" : ""}`}
                          disabled={moduleId > 3}
                        >
                          {moduleId <= 2 ? "Repasar" : moduleId === 3 ? "Continuar" : "Bloqueado"}
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="certificate" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Certificado de Finalización</CardTitle>
                  <CardDescription>Completa el curso para obtener tu certificado</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <div className="relative h-[200px] w-[300px] overflow-hidden rounded-lg border">
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
                      <Award className="h-16 w-16 text-gray-300 dark:text-gray-700" />
                      <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Completa el 100% del curso para desbloquear tu certificado
                      </p>
                      <div className="mt-4 w-full max-w-[200px]">
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="purchases" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Compras</CardTitle>
                  <CardDescription>Tus compras recientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md">
                          <Image
                            src="/placeholder.svg?height=64&width=64"
                            alt="Curso de Eneagrama"
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">Curso Completo de Eneagrama</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Plan Premium</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Comprado el 10 de Mayo, 2023</p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="font-semibold">$129.990 CLP</p>
                          <p className="text-xs text-green-600 dark:text-green-400">Completado</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
