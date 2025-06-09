"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, BookOpen, Video, CreditCard, TrendingUp, ArrowUpRight, FileText } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  return (
    <div className="container px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-gray-500 dark:text-gray-400">Bienvenido al panel de administración de Eneagrama</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 dark:text-green-400">+12%</span> desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3.2M</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 dark:text-green-400">+8%</span> desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cursos Activos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 dark:text-green-400">+1</span> desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Videos Subidos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 dark:text-green-400">+5</span> desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>Últimas acciones en la plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-200" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Nuevo usuario registrado</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Hace 2 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                        <CreditCard className="h-4 w-4 text-green-600 dark:text-green-200" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Nueva venta: Curso Premium</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Hace 5 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
                        <Video className="h-4 w-4 text-yellow-600 dark:text-yellow-200" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Nuevo video subido: Módulo 4</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Hace 1 día</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ventas por Curso</CardTitle>
                  <CardDescription>Distribución de ventas por curso</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Curso Completo (Premium)</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                        <div className="h-2 rounded-full bg-rose-600" style={{ width: "65%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Curso Básico</span>
                        <span className="font-medium">25%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                        <div className="h-2 rounded-full bg-rose-600" style={{ width: "25%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Curso VIP</span>
                        <span className="font-medium">10%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                        <div className="h-2 rounded-full bg-rose-600" style={{ width: "10%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                  <CardDescription>Accesos directos a funciones comunes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <Link
                      href="/admin/usuarios/nuevo"
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-rose-600" />
                        <span className="text-sm font-medium">Añadir Usuario</span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                    <Link
                      href="/admin/videos/nuevo"
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted"
                    >
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-rose-600" />
                        <span className="text-sm font-medium">Subir Video</span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                    <Link
                      href="/admin/recursos/nuevo"
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-rose-600" />
                        <span className="text-sm font-medium">Añadir Recurso</span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                    <Link
                      href="/admin/estadisticas"
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted"
                    >
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-rose-600" />
                        <span className="text-sm font-medium">Ver Estadísticas</span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analíticas</CardTitle>
                <CardDescription>Datos detallados de rendimiento de la plataforma</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Gráficos de analíticas se mostrarán aquí</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Reportes</CardTitle>
                <CardDescription>Informes detallados de la plataforma</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Reportes se mostrarán aquí</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
