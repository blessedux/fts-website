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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, UserPlus, Filter, Mail, Edit, Trash2, Eye } from "lucide-react"
import { users as mockUsers } from "@/lib/db"

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching users from API
    const fetchUsers = async () => {
      try {
        setLoading(true)
        // In a real app, we would fetch from API
        // For now, use the mock data but simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        setUsers(mockUsers)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching users:", error)
        // Fallback to hardcoded data
        setUsers([
          {
            id: "1",
            name: "María González",
            email: "maria@ejemplo.com",
            role: "student",
            status: "active",
            courses: ["Curso Completo"],
            joinDate: "2023-05-10",
            lastLogin: "today",
          },
          {
            id: "2",
            name: "Admin",
            email: "admin@eneagrama.com",
            role: "admin",
            status: "active",
            courses: ["Todos"],
            joinDate: "2023-01-01",
            lastLogin: "today",
          },
        ])
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Convert our DB user format to display format
  const displayUsers = filteredUsers.map((user) => ({
    ...user,
    role: user.role === "admin" ? "admin" : "estudiante",
    status: user.status || "activo",
    courses: user.courses?.length > 0 ? user.courses : ["Ninguno"],
    lastLogin: user.lastLogin || "Reciente",
  }))

  return (
    <div className="container px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-gray-500 dark:text-gray-400">Administra los usuarios de la plataforma</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-rose-600 hover:bg-rose-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Usuario</DialogTitle>
                <DialogDescription>Crea una nueva cuenta de usuario para la plataforma.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Nombre
                  </label>
                  <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="email" className="text-right">
                    Email
                  </label>
                  <Input id="email" type="email" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="role" className="text-right">
                    Rol
                  </label>
                  <select id="role" className="col-span-3 rounded-md border p-2">
                    <option value="estudiante">Estudiante</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="password" className="text-right">
                    Contraseña
                  </label>
                  <Input id="password" type="password" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-rose-600 hover:bg-rose-700">Crear Usuario</Button>
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
              placeholder="Buscar usuarios..."
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
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Enviar Email
          </Button>
          <Button variant="outline" size="sm">
            Exportar
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <p>Cargando usuarios...</p>
            </div>
          ) : (
            <Table>
              <TableCaption>Lista de usuarios registrados en la plataforma.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Cursos</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead>Último Acceso</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "outline"}>
                        {user.role === "admin" ? "Administrador" : "Estudiante"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "activo" ? "success" : user.status === "inactivo" ? "destructive" : "warning"
                        }
                      >
                        {user.status === "activo" ? "Activo" : user.status === "inactivo" ? "Inactivo" : "Pendiente"}
                      </Badge>
                    </TableCell>
                    <TableCell>{Array.isArray(user.courses) ? user.courses.join(", ") : user.courses}</TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
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
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            <span>Enviar email</span>
                          </DropdownMenuItem>
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
    </div>
  )
}
