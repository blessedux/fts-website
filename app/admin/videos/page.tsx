"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, Video, MoreHorizontal, FileUp, Edit, Trash2, Eye, Play } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { videos as mockVideos } from "@/lib/db"

export default function AdminVideosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching videos from API
    const fetchVideos = async () => {
      try {
        setLoading(true)
        // In a real app, we would fetch from API
        // For now, use the mock data but simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        setVideos(mockVideos)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching videos:", error)
        // Fallback to empty array
        setVideos([])
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const filteredVideos = videos.filter((video) => video.title.toLowerCase().includes(searchQuery.toLowerCase()))

  // Translate status values for display
  const getDisplayStatus = (status: string) => {
    switch (status) {
      case "publicado":
        return "Publicado"
      case "procesando":
        return "Procesando"
      case "borrador":
        return "Borrador"
      default:
        return status
    }
  }

  return (
    <div className="container px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Videos</h1>
          <p className="text-gray-500 dark:text-gray-400">Administra los videos del curso</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-rose-600 hover:bg-rose-700">
                <FileUp className="mr-2 h-4 w-4" />
                Subir Video
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Subir Nuevo Video</DialogTitle>
                <DialogDescription>Sube un nuevo video para el curso.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título del video</Label>
                  <Input id="title" placeholder="Ej: Introducción al Eneagrama" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea id="description" placeholder="Describe el contenido del video..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="module">Módulo</Label>
                    <Select>
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
                    <Select>
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
                <div className="grid gap-2">
                  <Label htmlFor="file">Archivo de Video</Label>
                  <div className="rounded-lg border border-dashed border-gray-300 px-6 py-8 text-center">
                    <div className="mx-auto flex max-w-[100px] flex-col items-center">
                      <Video className="mb-2 h-10 w-10 text-gray-400" />
                      <p className="mb-1 text-sm">
                        <span className="font-semibold text-rose-600">Click para subir</span> o arrastra y suelta
                      </p>
                      <p className="text-xs text-gray-500">MP4, MOV o AVI (max. 500MB)</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="watermark" />
                  <Label htmlFor="watermark">Añadir marca de agua con el logo de Eneagrama</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Confirmo que tengo los derechos para usar este video en la plataforma</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-rose-600 hover:bg-rose-700">Subir Video</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar videos..."
              className="w-full pl-8 md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filtrar</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="published">Publicados</TabsTrigger>
          <TabsTrigger value="processing">Procesando</TabsTrigger>
          <TabsTrigger value="draft">Borradores</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <p>Cargando videos...</p>
                </div>
              ) : (
                <Table>
                  <TableCaption>Lista de videos del curso.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Título</TableHead>
                      <TableHead>Módulo</TableHead>
                      <TableHead>Duración</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Marca de Agua</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Vistas</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVideos.map((video) => (
                      <TableRow key={video.id}>
                        <TableCell className="font-medium">{video.title}</TableCell>
                        <TableCell>{video.module}</TableCell>
                        <TableCell>{video.duration}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              video.status === "publicado"
                                ? "success"
                                : video.status === "procesando"
                                  ? "warning"
                                  : "outline"
                            }
                          >
                            {getDisplayStatus(video.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {video.watermarked ? (
                            <Badge variant="success">Aplicada</Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </TableCell>
                        <TableCell>{video.uploadDate}</TableCell>
                        <TableCell>{video.views}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Abrir menú</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Play className="mr-2 h-4 w-4" />
                                <span>Reproducir</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Ver detalles</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                              </DropdownMenuItem>
                              {!video.watermarked && (
                                <DropdownMenuItem>
                                  <Video className="mr-2 h-4 w-4" />
                                  <span>Añadir marca de agua</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Eliminar</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="published" className="mt-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Mostrando solo videos publicados...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="mt-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Mostrando solo videos en procesamiento...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft" className="mt-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Mostrando solo borradores...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
