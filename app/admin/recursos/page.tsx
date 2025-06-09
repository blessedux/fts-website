"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { FileText, FileUp, Search, Trash2, Edit, BookOpen, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminResourcesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const resources = [
    {
      id: 1,
      title: "Guía de Ejercicios Prácticos",
      type: "PDF",
      size: "2.4 MB",
      pages: 24,
      dateAdded: "10/05/2023",
      downloadCount: 156,
      modules: [1, 2, 3],
    },
    {
      id: 2,
      title: "Test de Identificación de Tipo",
      type: "PDF",
      size: "0.8 MB",
      pages: 8,
      dateAdded: "10/05/2023",
      downloadCount: 143,
      modules: [2],
    },
    {
      id: 3,
      title: "Tabla Comparativa de los 9 Tipos",
      type: "PDF",
      size: "0.5 MB",
      pages: 2,
      dateAdded: "15/05/2023",
      downloadCount: 128,
      modules: [1, 2, 3, 4],
    },
    {
      id: 4,
      title: "Guía de Relaciones entre Tipos",
      type: "PDF",
      size: "1.2 MB",
      pages: 12,
      dateAdded: "20/05/2023",
      downloadCount: 87,
      modules: [6],
    },
  ]

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestión de Recursos</h1>
        <p className="text-gray-500 dark:text-gray-400">Administra los recursos del curso</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="pdfs">PDFs</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>

          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar recursos..."
                className="w-full md:w-[200px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-rose-600 hover:bg-rose-700">
                  <FileUp className="mr-2 h-4 w-4" />
                  Subir Recurso
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Subir Nuevo Recurso</DialogTitle>
                  <DialogDescription>Sube un nuevo recurso para el curso.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Título del recurso</Label>
                    <Input id="title" placeholder="Ej: Guía de ejercicios" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo de recurso</Label>
                    <Select>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="modules">Módulos asociados</Label>
                    <Select>
                      <SelectTrigger id="modules">
                        <SelectValue placeholder="Seleccionar módulos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Módulo 1: Introducción al Eneagrama</SelectItem>
                        <SelectItem value="2">Módulo 2: Descubre tu Tipo</SelectItem>
                        <SelectItem value="3">Módulo 3: Centros de Inteligencia</SelectItem>
                        <SelectItem value="all">Todos los módulos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="file">Archivo</Label>
                    <div className="rounded-lg border border-dashed border-gray-300 px-6 py-8 text-center">
                      <div className="mx-auto flex max-w-[100px] flex-col items-center">
                        <FileText className="mb-2 h-10 w-10 text-gray-400" />
                        <p className="mb-1 text-sm">
                          <span className="font-semibold text-rose-600">Click para subir</span> o arrastra y suelta
                        </p>
                        <p className="text-xs text-gray-500">PDFs, videos o audios (max. 50MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button className="bg-rose-600 hover:bg-rose-700" disabled={isLoading}>
                    {isLoading ? "Subiendo..." : "Subir Recurso"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableCaption>Lista de recursos disponibles.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Tamaño</TableHead>
                    <TableHead>Páginas</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Descargas</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium">{resource.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-rose-600" />
                          <span>{resource.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{resource.size}</TableCell>
                      <TableCell>{resource.pages}</TableCell>
                      <TableCell>{resource.dateAdded}</TableCell>
                      <TableCell>{resource.downloadCount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Descargar</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pdfs" className="mt-0">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Mostrando solo recursos PDF...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="mt-0">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Mostrando solo recursos de video...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
