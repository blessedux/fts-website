"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Simulación de login - aquí iría la integración con el sistema de autenticación
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Bienvenido de vuelta</h1>
              <p className="text-gray-500 dark:text-gray-400">Inicia sesión para acceder a tu curso de Eneagrama</p>
            </div>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Iniciar Sesión</CardTitle>
                    <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={onSubmit}>
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="email">Correo electrónico</Label>
                          <Input id="email" type="email" placeholder="nombre@ejemplo.com" required />
                        </div>
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="password">Contraseña</Label>
                            <Link
                              href="/recuperar-contrasena"
                              className="text-sm text-[#D4AF37] underline-offset-4 hover:underline"
                            >
                              ¿Olvidaste tu contraseña?
                            </Link>
                          </div>
                          <Input id="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full bg-[#D4AF37] hover:bg-[#BFA030] text-black font-semibold" disabled={isLoading}>
                          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Crear una cuenta</CardTitle>
                    <CardDescription>Regístrate para acceder a nuestros cursos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={onSubmit}>
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Nombre completo</Label>
                          <Input id="name" type="text" placeholder="Juan Pérez" required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email-register">Correo electrónico</Label>
                          <Input id="email-register" type="email" placeholder="nombre@ejemplo.com" required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="password-register">Contraseña</Label>
                          <Input id="password-register" type="password" required />
                        </div>
                        <Button type="submit" className="w-full bg-[#D4AF37] hover:bg-[#BFA030] text-black font-semibold" disabled={isLoading}>
                          {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center justify-center space-y-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Al registrarte, aceptas nuestros{" "}
                      <Link href="/terminos" className="text-[#D4AF37] underline-offset-4 hover:underline">
                        términos y condiciones
                      </Link>{" "}
                      y{" "}
                      <Link href="/privacidad" className="text-[#D4AF37] underline-offset-4 hover:underline">
                        política de privacidad
                      </Link>
                      .
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
