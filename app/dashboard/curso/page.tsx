"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BookOpen, CheckCircle, Clock, Play } from "lucide-react"
import Link from "next/link"

export default function DashboardCoursePage() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simular carga de progreso
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="container px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mi Curso de Eneagrama</h1>
        <p className="text-gray-500 dark:text-gray-400">Avanza a tu ritmo y transforma tu comprensión del Eneagrama</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Curso Completo de Eneagrama</CardTitle>
            <CardDescription>Progreso general del curso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso general</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-rose-100 p-2 dark:bg-rose-900">
                    <Play className="h-4 w-4 text-rose-600 dark:text-rose-200" />
                  </div>
                  <div>
                    <p className="font-medium">Continúa donde lo dejaste</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Módulo 3: Centros de Inteligencia - Mental, Emocional e Instintivo
                    </p>
                  </div>
                  <Link href="/curso/3" className="ml-auto">
                    <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                      Continuar
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
            <CardDescription>Tu actividad en el curso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Módulos completados</span>
                </div>
                <span className="font-medium">2 de 9</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Tiempo de estudio</span>
                </div>
                <span className="font-medium">4h 37m</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Quizzes completados</span>
                </div>
                <span className="font-medium">6 de 18</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="modules">
          <TabsList>
            <TabsTrigger value="modules">Módulos</TabsTrigger>
            <TabsTrigger value="materials">Materiales</TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="mt-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((moduleId) => (
                <Card key={moduleId}>
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row md:items-center p-4">
                      <div className="mb-4 md:mb-0 md:mr-4 md:w-2/3">
                        <div className="flex items-center gap-2">
                          {moduleId <= 2 && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {moduleId === 3 && <Play className="h-5 w-5 text-yellow-500" />}
                          {moduleId > 3 && moduleId <= 9 && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
                              <span className="text-xs">{moduleId}</span>
                            </div>
                          )}
                          <h3 className="font-medium">
                            Módulo {moduleId}:{moduleId === 1 && " Introducción al Eneagrama"}
                            {moduleId === 2 && " Descubre tu Tipo"}
                            {moduleId === 3 && " Centros de Inteligencia"}
                            {moduleId === 4 && " Alas y Subtipos"}
                            {moduleId === 5 && " Niveles de Desarrollo"}
                            {moduleId === 6 && " Relaciones Interpersonales"}
                            {moduleId === 7 && " Aplicación Profesional"}
                            {moduleId === 8 && " Integración y Desintegración"}
                            {moduleId === 9 && " Proyecto Final"}
                          </h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {moduleId <= 2 && "Completado • "}
                          {moduleId === 3 && "En progreso • "}
                          {moduleId > 3 && "Pendiente • "}
                          Duración aproximada: 2-3 horas
                        </p>
                      </div>

                      <div className="flex justify-between items-center md:w-1/3">
                        <div className="flex items-center gap-1">
                          {moduleId <= 2 ? (
                            <>
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-xs text-green-600 dark:text-green-400">100%</span>
                            </>
                          ) : moduleId === 3 ? (
                            <>
                              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                              <span className="text-xs text-yellow-600 dark:text-yellow-400">40%</span>
                            </>
                          ) : (
                            <>
                              <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                              <span className="text-xs text-gray-500">0%</span>
                            </>
                          )}
                        </div>

                        <Link href={moduleId > 3 ? "#" : `/curso/${moduleId}`}>
                          <Button
                            size="sm"
                            variant={moduleId > 3 ? "outline" : "default"}
                            className={moduleId <= 3 ? "bg-rose-600 hover:bg-rose-700" : ""}
                            disabled={moduleId > 3}
                          >
                            {moduleId <= 2 ? "Repasar" : moduleId === 3 ? "Continuar" : "Bloqueado"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="materials" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Materiales Complementarios</CardTitle>
                <CardDescription>Recursos adicionales para profundizar tu aprendizaje</CardDescription>
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
                      <Button variant="outline" size="sm" className="ml-auto">
                        Descargar
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
                      <Button variant="outline" size="sm" className="ml-auto">
                        Descargar
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-rose-100 p-2 dark:bg-rose-900">
                        <BookOpen className="h-4 w-4 text-rose-600 dark:text-rose-200" />
                      </div>
                      <div>
                        <p className="font-medium">Tabla Comparativa de los 9 Tipos</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF - 2 páginas</p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">
                        Descargar
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-rose-100 p-2 dark:bg-rose-900">
                        <BookOpen className="h-4 w-4 text-rose-600 dark:text-rose-200" />
                      </div>
                      <div>
                        <p className="font-medium">Guía de Relaciones entre Tipos</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF - 12 páginas</p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">
                        Descargar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
