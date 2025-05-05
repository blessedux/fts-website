"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Home, User, FileText, Award, Calendar, Settings, LogOut } from "lucide-react"
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
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

export function DashboardSidebar({ progress = 66 }: { progress?: number }) {
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
                <p className="font-medium leading-none">Usuario Demo</p>
                <p className="text-xs text-muted-foreground">usuario@ejemplo.com</p>
              </div>
            </div>
            <div className="mt-4 px-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Progreso del Curso</span>
                <span className="text-xs font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"} tooltip="Dashboard">
                  <Link href="/dashboard">
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname?.startsWith("/dashboard/curso")} tooltip="Mi Curso">
                  <Link href="/dashboard/curso">
                    <BookOpen className="h-5 w-5" />
                    <span>Mi Curso</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname?.startsWith("/dashboard/recursos")} tooltip="Recursos">
                  <Link href="/dashboard/recursos">
                    <FileText className="h-5 w-5" />
                    <span>Recursos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname?.startsWith("/dashboard/eventos")} tooltip="Eventos">
                  <Link href="/dashboard/eventos">
                    <Calendar className="h-5 w-5" />
                    <span>Eventos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/certificado"} tooltip="Certificado">
                  <Link href="/dashboard/certificado">
                    <Award className="h-5 w-5" />
                    <span>Certificado</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname?.startsWith("/dashboard/perfil")} tooltip="Mi Perfil">
                  <Link href="/dashboard/perfil">
                    <User className="h-5 w-5" />
                    <span>Mi Perfil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname?.startsWith("/dashboard/ajustes")} tooltip="Ajustes">
                  <Link href="/dashboard/ajustes">
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
