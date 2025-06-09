"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VideoWatermark } from "@/components/admin/video-watermark"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function EditVideoPage({ params }: { params: { id: string } }) {
  const videoId = params.id

  // En un caso real, aquí cargaríamos los datos del video desde la API
  const videoData = {
    id: videoId,
    title: "Introducción al Eneagrama",
    description: "Este video presenta los conceptos básicos del Eneagrama y su historia.",
    module: "Módulo 1",
    status: "publicado",
    duration: "15:32",
    videoUrl: "https://example.com/video.mp4", // URL de ejemplo
  }

  return (
    <div className="container px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Link href="/admin/videos">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Editar Video</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">ID: {videoId}</p>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="watermark">Marca de Agua</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Video</CardTitle>
              <CardDescription>Edita la información básica del video</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" defaultValue={videoData.title} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" defaultValue={videoData.description} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="module">Módulo</Label>
                  <Select defaultValue="1">
                    <SelectTrigger id="module">
                      <SelectValue placeholder="Seleccionar módulo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Módulo 1: Introducción</SelectItem>
                      <SelectItem value="2">Módulo 2: Descubre tu Tipo</SelectItem>
                      <SelectItem value="3">Módulo 3: Centros de Inteligencia</SelectItem>
                      <SelectItem value="4">Módulo 4: Alas y Subtipos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select defaultValue="published">
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto bg-rose-600 hover:bg-rose-700">
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="watermark" className="mt-6">
          <VideoWatermark videoSrc="/placeholder.mp4" />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración Avanzada</CardTitle>
              <CardDescription>Ajustes adicionales para el video</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="visibility">Visibilidad</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="visibility">
                    <SelectValue placeholder="Seleccionar visibilidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estudiantes</SelectItem>
                    <SelectItem value="premium">Solo Plan Premium</SelectItem>
                    <SelectItem value="vip">Solo Plan VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="download">Permitir Descarga</Label>
                <Select defaultValue="no">
                  <SelectTrigger id="download">
                    <SelectValue placeholder="Seleccionar opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Sí, permitir descarga</SelectItem>
                    <SelectItem value="no">No permitir descarga</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="comments">Comentarios</Label>
                <Select defaultValue="enabled">
                  <SelectTrigger id="comments">
                    <SelectValue placeholder="Seleccionar opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Habilitados</SelectItem>
                    <SelectItem value="disabled">Deshabilitados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto bg-rose-600 hover:bg-rose-700">
                <Save className="mr-2 h-4 w-4" />
                Guardar Configuración
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
