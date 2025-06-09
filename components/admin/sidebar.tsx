"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Users,
  BookOpen,
  Video,
  FileText,
  BarChart2,
  Settings,
  LogOut,
  Home,
  CreditCard,
  MessageSquare,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

export function AdminSidebar() {
  const pathname = usePathname()
  const isMobile = useMobile()

  return (
    <SidebarProvider>
      {!isMobile && (
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>FT</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1 text-sm">
                <p className="font-medium leading-none">Administrador</p>
                <p className="text-xs text-muted-foreground">admin@eneagrama.com</p>
              </div>
            </div>
            <div className="mt-4 px-2">
              <Link href="/" className="text-xs text-muted-foreground hover:underline">
                Ver sitio público →
              </Link>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin"} tooltip="Dashboard">
                  <Link href="/admin">
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname?.startsWith("/admin/usuarios")} tooltip="Usuarios">
                  <Link href="/admin/usuarios">
                    <Users className="h-5 w-5" />
                    <span>Usuarios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname?.startsWith("/admin/cursos")} tooltip="Cursos">
                  <Link href="/admin/cursos">
                    <BookOpen className="h-5 w-5" />
                    <span>Cursos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname?.startsWith("/admin/videos")} tooltip="Videos">
                  <Link href="/admin/videos">
                    <Video className="h-5 w-5" />
                    <span>Videos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname?.startsWith("/admin/recursos")} tooltip="Recursos">
                  <Link href="/admin/recursos">
                    <FileText className="h-5 w-5" />
                    <span>Recursos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname?.startsWith("/admin/pagos")} tooltip="Pagos">
                  <Link href="/admin/pagos">
                    <CreditCard className="h-5 w-5" />
                    <span>Pagos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname?.startsWith("/admin/mensajes")} tooltip="Mensajes">
                  <Link href="/admin/mensajes">
                    <MessageSquare className="h-5 w-5" />
                    <span>Mensajes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname?.startsWith("/admin/estadisticas")}
                  tooltip="Estadísticas"
                >
                  <Link href="/admin/estadisticas">
                    <BarChart2 className="h-5 w-5" />
                    <span>Estadísticas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname?.startsWith("/admin/ajustes")} tooltip="Ajustes">
                  <Link href="/admin/ajustes">
                    <Settings className="h-5 w-5" />
                    <span>Ajustes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter>
            <Button variant="outline" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
      )}

      {/* Mobile trigger for sidebar */}
      {isMobile && (
        <SidebarTrigger className="fixed bottom-4 right-4 z-50 rounded-full bg-rose-600 p-4 text-white shadow-lg hover:bg-rose-700" />
      )}
    </SidebarProvider>
  )
}
