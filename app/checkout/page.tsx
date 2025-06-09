"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, CreditCard, Package } from "lucide-react"
import Image from "next/image"

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [productType, setProductType] = useState<"course" | "book">("course")
  const [includeShipping, setIncludeShipping] = useState<boolean>(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Simulación de procesamiento de pago - aquí iría la integración con Mercado Pago
    setTimeout(() => {
      setIsLoading(false)
      // Redirección a página de éxito o manejo de errores
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 space-y-2">
              <h1 className="text-3xl font-bold">Finalizar Compra</h1>
              <p className="text-gray-500 dark:text-gray-400">Completa tu información para procesar tu pedido</p>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_350px]">
              <div className="space-y-8">
                <Tabs defaultValue="course" onValueChange={(value) => setProductType(value as "course" | "book")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="course">Curso Online</TabsTrigger>
                    <TabsTrigger value="book">Libro Físico</TabsTrigger>
                  </TabsList>
                  <TabsContent value="course" className="space-y-4 pt-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md">
                          <Image
                            src="/placeholder.svg?height=64&width=64"
                            alt="Curso de Eneagrama"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">Curso Completo de Eneagrama</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Plan Premium</p>
                        </div>
                        <div className="ml-auto font-semibold">$129.990 CLP</div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="book" className="space-y-4 pt-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md">
                          <Image
                            src="/placeholder.svg?height=64&width=64"
                            alt="Libro de Eneagrama"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">Libro Oficial del Eneagrama</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Por Fanny Torres Da Silva</p>
                        </div>
                        <div className="ml-auto font-semibold">$24.990 CLP</div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-rose-600" />
                        <h3 className="font-semibold">Información de Envío</h3>
                      </div>
                      <div className="mt-4 grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="address">Dirección</Label>
                          <Input id="address" placeholder="Calle, número, depto." required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="region">Región</Label>
                            <Select>
                              <SelectTrigger id="region">
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="metropolitana">Metropolitana</SelectItem>
                                <SelectItem value="valparaiso">Valparaíso</SelectItem>
                                <SelectItem value="biobio">Biobío</SelectItem>
                                <SelectItem value="other">Otra</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="comuna">Comuna</Label>
                            <Input id="comuna" placeholder="Comuna" required />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Teléfono de contacto</Label>
                          <Input id="phone" type="tel" placeholder="+56 9 XXXX XXXX" required />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div>
                  <h2 className="mb-4 text-xl font-semibold">Información Personal</h2>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input id="name" placeholder="Nombre y apellidos" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input id="email" type="email" placeholder="nombre@ejemplo.com" required />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="mb-4 text-xl font-semibold">Método de Pago</h2>
                  <RadioGroup defaultValue="mercadopago" className="space-y-3">
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="mercadopago" id="mercadopago" />
                      <Label htmlFor="mercadopago" className="flex items-center gap-2 font-normal">
                        <Image src="/placeholder.svg?height=32&width=100" alt="Mercado Pago" width={100} height={32} />
                        <span>Mercado Pago</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="creditcard" id="creditcard" />
                      <Label htmlFor="creditcard" className="flex items-center gap-2 font-normal">
                        <CreditCard className="h-5 w-5" />
                        <span>Tarjeta de Crédito/Débito</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen del Pedido</CardTitle>
                    <CardDescription>Revisa los detalles de tu compra</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{productType === "course" ? "$129.990" : "$24.990"} CLP</span>
                      </div>
                      {productType === "book" && (
                        <div className="flex justify-between">
                          <span>Envío</span>
                          <span>$3.990 CLP</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{productType === "course" ? "$129.990" : "$28.980"} CLP</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-rose-600 hover:bg-rose-700" disabled={isLoading} onClick={onSubmit}>
                      {isLoading ? "Procesando..." : "Finalizar Compra"}
                    </Button>
                  </CardFooter>
                </Card>

                <div className="mt-4 rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Pago 100% Seguro</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Tus datos están protegidos y el proceso de pago es seguro a través de Mercado Pago.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
