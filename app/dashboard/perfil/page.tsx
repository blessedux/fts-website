"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Simulación de actualización de perfil
    setTimeout(() => {
      setIsLoading(false)
      // Aquí iría la lógica para actualizar el perfil
    }, 1500)
  }

  return (
    <div className="container px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-gray-500 dark:text-gray-400">Administra tu información personal y preferencias</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_3fr]">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" />
                <AvatarFallback>UD</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-bold">Usuario Demo</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">usuario@ejemplo.com</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Miembro desde Mayo 2023</p>
              </div>
              <Button variant="outline" className="w-full">
                Cambiar foto
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Tabs defaultValue="personal">
            <TabsList>
              <TabsTrigger value="personal">Información Personal</TabsTrigger>
              <TabsTrigger value="security">Seguridad</TabsTrigger>
              <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>Actualiza tu información personal</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onSubmit}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input id="name" defaultValue="Usuario Demo" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input id="email" type="email" defaultValue="usuario@ejemplo.com" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Teléfono</Label>
                          <Input id="phone" type="tel" defaultValue="+56 9 1234 5678" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="country">País</Label>
                          <Input id="country" defaultValue="Chile" />
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto bg-rose-600 hover:bg-rose-700" disabled={isLoading} onClick={onSubmit}>
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Seguridad</CardTitle>
                  <CardDescription>Actualiza tu contraseña y configuraciones de seguridad</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onSubmit}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="current_password">Contraseña actual</Label>
                        <Input id="current_password" type="password" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new_password">Nueva contraseña</Label>
                        <Input id="new_password" type="password" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="confirm_password">Confirmar nueva contraseña</Label>
                        <Input id="confirm_password" type="password" />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto bg-rose-600 hover:bg-rose-700" disabled={isLoading} onClick={onSubmit}>
                    {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notificaciones</CardTitle>
                  <CardDescription>Configura tus preferencias de notificaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h3 className="font-medium">Actualizaciones del curso</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Notificaciones cuando se agregue nuevo contenido
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="notifications-course" className="hidden">
                          Actualizaciones del curso
                        </Label>
                        <Input id="notifications-course" type="checkbox" className="h-4 w-4" defaultChecked />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h3 className="font-medium">Recordatorios</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Recordatorios de estudio y eventos</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="notifications-reminders" className="hidden">
                          Recordatorios
                        </Label>
                        <Input id="notifications-reminders" type="checkbox" className="h-4 w-4" defaultChecked />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h3 className="font-medium">Boletín y promociones</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Información sobre nuevos cursos y ofertas
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="notifications-newsletter" className="hidden">
                          Boletín y promociones
                        </Label>
                        <Input id="notifications-newsletter" type="checkbox" className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto bg-rose-600 hover:bg-rose-700" disabled={isLoading} onClick={onSubmit}>
                    {isLoading ? "Guardando..." : "Guardar Preferencias"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
