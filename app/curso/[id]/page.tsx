"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Play, BookOpen, FileText, Award } from "lucide-react"
import Link from "next/link"

// Simulación de datos del curso
const courseModules = [
  {
    id: 1,
    title: "Introducción al Eneagrama",
    description: "Fundamentos y conceptos básicos",
    completed: true,
    locked: false,
    videoUrl: "#",
    content: "Contenido del módulo 1...",
    quiz: [
      {
        question: "¿Cuántos tipos de personalidad existen en el Eneagrama?",
        options: ["3", "7", "9", "12"],
        correctAnswer: "9",
      },
      {
        question: "¿Cuál es el propósito principal del Eneagrama?",
        options: [
          "Predecir el futuro",
          "Autoconocimiento y desarrollo personal",
          "Clasificar a las personas",
          "Determinar compatibilidad amorosa",
        ],
        correctAnswer: "Autoconocimiento y desarrollo personal",
      },
    ],
  },
  {
    id: 2,
    title: "Descubre tu Tipo",
    description: "Test y análisis de resultados",
    completed: true,
    locked: false,
    videoUrl: "#",
    content: "Contenido del módulo 2...",
    quiz: [
      {
        question: "¿Qué factores influyen en la determinación de tu tipo de Eneagrama?",
        options: [
          "Solo tus comportamientos externos",
          "Tus motivaciones internas, miedos y deseos",
          "Tu fecha de nacimiento",
          "Tu tipo de sangre",
        ],
        correctAnswer: "Tus motivaciones internas, miedos y deseos",
      },
    ],
  },
  {
    id: 3,
    title: "Centros de Inteligencia",
    description: "Mental, Emocional e Instintivo",
    completed: false,
    locked: false,
    videoUrl: "#",
    content: "Contenido del módulo 3...",
    quiz: [
      {
        question: "¿Cuáles son los tres centros de inteligencia en el Eneagrama?",
        options: [
          "Visual, auditivo y kinestésico",
          "Mental, emocional e instintivo",
          "Pasado, presente y futuro",
          "Consciente, subconsciente e inconsciente",
        ],
        correctAnswer: "Mental, emocional e instintivo",
      },
    ],
  },
  {
    id: 4,
    title: "Alas y Subtipos",
    description: "Influencias y variaciones",
    completed: false,
    locked: true,
    videoUrl: "#",
    content: "Contenido del módulo 4...",
    quiz: [],
  },
]

export default function CourseModulePage({ params }: { params: { id: string } }) {
  const moduleId = Number.parseInt(params.id)
  const module = courseModules.find((m) => m.id === moduleId) || courseModules[0]

  const [activeTab, setActiveTab] = useState("video")
  const [progress, setProgress] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<string[]>(Array(module.quiz?.length || 0).fill(""))
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizPassed, setQuizPassed] = useState(false)

  useEffect(() => {
    // Simular carga de progreso
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Verificar respuestas
    let correctAnswers = 0
    module.quiz?.forEach((q, index) => {
      if (quizAnswers[index] === q.correctAnswer) {
        correctAnswers++
      }
    })

    const passed = correctAnswers / (module.quiz?.length || 1) >= 0.7 // 70% para aprobar
    setQuizPassed(passed)
    setQuizSubmitted(true)
  }

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswers = [...quizAnswers]
    newAnswers[questionIndex] = answer
    setQuizAnswers(newAnswers)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-12">
            {/* Sidebar con módulos */}
            <aside className="lg:order-1">
              <div className="sticky top-24">
                <div className="mb-6">
                  <h2 className="text-xl font-bold">Tu Progreso</h2>
                  <div className="mt-2 flex items-center gap-2">
                    <Progress value={progress} className="h-2" />
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold">Módulos del Curso</h2>
                  <div className="space-y-1">
                    {courseModules.map((m) => (
                      <Link
                        key={m.id}
                        href={m.locked ? "#" : `/curso/${m.id}`}
                        className={`flex items-center gap-2 rounded-lg border p-3 ${
                          m.id === moduleId ? "border-rose-600 bg-rose-50 dark:bg-rose-950/20" : ""
                        } ${m.locked ? "cursor-not-allowed opacity-60" : "hover:bg-muted"}`}
                      >
                        {m.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : m.locked ? (
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                        )}
                        <div className="text-sm font-medium">{m.title}</div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-lg border bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-rose-600" />
                    <h3 className="font-semibold">Certificado</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Completa todos los módulos para obtener tu certificado de finalización.
                  </p>
                </div>
              </div>
            </aside>

            {/* Contenido principal */}
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold md:text-3xl">{module.title}</h1>
                <p className="text-gray-500 dark:text-gray-400">{module.description}</p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="video" className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    <span>Video</span>
                  </TabsTrigger>
                  <TabsTrigger value="content" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Contenido</span>
                  </TabsTrigger>
                  <TabsTrigger value="quiz" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Cuestionario</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="video" className="mt-6">
                  <Card>
                    <CardContent className="p-0">
                      <div className="aspect-video bg-black flex items-center justify-center">
                        <Play className="h-12 w-12 text-white opacity-70" />
                      </div>
                    </CardContent>
                    <CardHeader>
                      <CardTitle>{module.title} - Video</CardTitle>
                      <CardDescription>Duración: 15:32 minutos</CardDescription>
                    </CardHeader>
                  </Card>
                </TabsContent>

                <TabsContent value="content" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{module.title} - Material de Estudio</CardTitle>
                      <CardDescription>Lee detenidamente el siguiente contenido</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="prose dark:prose-invert max-w-none">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies
                          tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Donec auctor, nisl
                          eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
                        </p>
                        <h3>Conceptos clave</h3>
                        <ul>
                          <li>Punto 1: Lorem ipsum dolor sit amet</li>
                          <li>Punto 2: Consectetur adipiscing elit</li>
                          <li>Punto 3: Donec auctor, nisl eget ultricies</li>
                        </ul>
                        <p>
                          Donec auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl
                          sit amet nisl. Donec auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget
                          aliquam nisl nisl sit amet nisl.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="quiz" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{module.title} - Cuestionario</CardTitle>
                      <CardDescription>Responde correctamente para avanzar al siguiente módulo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {module.quiz && module.quiz.length > 0 ? (
                        <form onSubmit={handleQuizSubmit}>
                          <div className="space-y-6">
                            {module.quiz.map((q, index) => (
                              <div key={index} className="space-y-3">
                                <h3 className="font-medium">
                                  {index + 1}. {q.question}
                                </h3>
                                <div className="space-y-2">
                                  {q.options.map((option, optionIndex) => (
                                    <label
                                      key={optionIndex}
                                      className={`flex items-center gap-2 rounded-lg border p-3 ${
                                        quizSubmitted
                                          ? option === q.correctAnswer
                                            ? "border-green-600 bg-green-50 dark:bg-green-950/20"
                                            : quizAnswers[index] === option
                                              ? "border-red-600 bg-red-50 dark:bg-red-950/20"
                                              : ""
                                          : quizAnswers[index] === option
                                            ? "border-rose-600 bg-rose-50 dark:bg-rose-950/20"
                                            : "hover:bg-muted"
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name={`question-${index}`}
                                        value={option}
                                        checked={quizAnswers[index] === option}
                                        onChange={() => handleAnswerChange(index, option)}
                                        disabled={quizSubmitted}
                                        className="h-4 w-4 text-rose-600"
                                      />
                                      <span>{option}</span>
                                      {quizSubmitted && option === q.correctAnswer && (
                                        <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                                      )}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}

                            {quizSubmitted ? (
                              <div
                                className={`rounded-lg p-4 ${quizPassed ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-300"}`}
                              >
                                {quizPassed ? (
                                  <>
                                    <h3 className="font-semibold">¡Felicidades!</h3>
                                    <p>Has aprobado el cuestionario y puedes avanzar al siguiente módulo.</p>
                                    <div className="mt-4">
                                      <Link href={`/curso/${moduleId + 1}`}>
                                        <Button className="bg-rose-600 hover:bg-rose-700">Siguiente Módulo</Button>
                                      </Link>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <h3 className="font-semibold">Necesitas repasar</h3>
                                    <p>Revisa el contenido e intenta nuevamente.</p>
                                    <div className="mt-4">
                                      <Button
                                        onClick={() => {
                                          setQuizSubmitted(false)
                                          setQuizAnswers(Array(module.quiz?.length || 0).fill(""))
                                        }}
                                      >
                                        Intentar Nuevamente
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ) : (
                              <Button
                                type="submit"
                                className="bg-rose-600 hover:bg-rose-700"
                                disabled={quizAnswers.some((a) => a === "")}
                              >
                                Enviar Respuestas
                              </Button>
                            )}
                          </div>
                        </form>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-500 dark:text-gray-400">Este módulo no tiene cuestionario.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
