"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Search, Filter, MoreHorizontal, Eye, FileText, Mail, Download } from "lucide-react"
import { DateRangePicker } from "@/components/ui/date-range-picker"

export default function AdminPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  // Datos de ejemplo - En una app real, estos vendrían de una API
  const payments = [
    {
      id: "MP-12345",
      user: "María González",
      email: "maria@ejemplo.com",
      amount: 129990,
      product: "Curso Completo (Premium)",
      status: "completado",
      date: "10/05/2023",
      method: "Mercado Pago",
    },
    {
      id: "MP-12346",
      user: "Juan Pérez",
      email: "juan@ejemplo.com",
      amount: 89990,
      product: "Curso Básico",
      status: "completado",
      date: "15/05/2023",
      method: "Tarjeta de Crédito",
    },
    {
      id: "MP-12347",
      user: "Ana Rodríguez",
      email: "ana@ejemplo.com",
      amount: 199990,
      product: "Curso VIP",
      status: "completado",
      date: "20/05/2023",
      method: "Mercado Pago",
    },
    {
      id: "MP-12348",
      user: "Carlos Soto",
      email: "carlos@ejemplo.com",
      amount: 24990,
      product: "Libro Oficial",
      status: "pendiente",
      date: "25/05/2023",
      method: "Transferencia",
    },
    {
      id: "MP-12349",
      user: "Laura Vega",
      email: "laura@ejemplo.com",
      amount: 129990,
      product: "Curso Completo (Premium)",
      status: "rechazado",
      date: "01/06/2023",
      method: "Tarjeta de Crédito",
    },
  ]

  useEffect(() => {
    // Simulate loading payments from API
    const loadPayments = async () => {
      // In a real app, we would fetch from API
      // For now, simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 600))
      setLoading(false)
    }

    loadPayments()
  }, [])

  const filteredPayments = payments.filter(
    (payment) =>
      payment.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calcular estadísticas
  const totalAmount = payments
    .filter((p) => p.status === "completado")
    .reduce((sum, payment) => sum + payment.amount, 0)

  const pendingAmount = payments
    .filter((p) => p.status === "pendiente")
    .reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div className="container px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestión de Pagos</h1>
        <p className="text-gray-500 dark:text-gray-400">Administra los pagos y transacciones</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground">Ingresos Totales</p>
              <p className="text-3xl font-bold">${(totalAmount / 1000).toFixed(3)} CLP</p>
              <p className="text-xs text-green-600 dark:text-green-400">+15% desde el mes pasado</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground">Pagos Pendientes</p>
              <p className="text-3xl font-bold">${(pendingAmount / 1000).toFixed(3)} CLP</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">1 transacción pendiente</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground">Transacciones</p>
              <p className="text-3xl font-bold">{payments.length}</p>
              <p className="text-xs text-green-600 dark:text-green-400">+3 desde el mes pasado</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar pagos..."
              className="w-full pl-8 md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filtrar</span>
          </Button>
          <div className="hidden md:block">
            <DateRangePicker />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="completed">Completados</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="rejected">Rechazados</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <p>Cargando pagos...</p>
                </div>
              ) : (
                <Table>
                  <TableCaption>Lista de pagos y transacciones.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>
                          <div>
                            <p>{payment.user}</p>
                            <p className="text-xs text-muted-foreground">{payment.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{payment.product}</TableCell>
                        <TableCell>${(payment.amount / 1000).toFixed(3)} CLP</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              payment.status === "completado"
                                ? "success"
                                : payment.status === "pendiente"
                                  ? "warning"
                                  : "destructive"
                            }
                          >
                            {payment.status === "completado"
                              ? "Completado"
                              : payment.status === "pendiente"
                                ? "Pendiente"
                                : "Rechazado"}
                          </Badge>
                        </TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>{payment.method}</TableCell>
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
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Ver detalles</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Ver factura</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                <span>Enviar recibo</span>
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

        <TabsContent value="completed" className="mt-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Mostrando solo pagos completados...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Mostrando solo pagos pendientes...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Mostrando solo pagos rechazados...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
