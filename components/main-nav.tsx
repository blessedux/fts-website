"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

export function MainNav() {
  const isMobile = useMobile()

  return (
    <>
      <div className="mr-4 hidden md:flex">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <div className="relative h-8 w-[200px]">
            <Image
              src="/FTSlogo.png"
              alt="Eneagrama | Fanny Torres Da Silva"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Inicio</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Servicios</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-[#D4AF37] to-[#8B6B2E] p-6 no-underline outline-none focus:shadow-md"
                        href="/curso"
                      >
                        <div className="mt-4 mb-2 text-lg font-medium text-white">Curso Completo de Eneagrama</div>
                        <p className="text-sm leading-tight text-white/90">
                          Descubre tu tipo de personalidad y transforma tu vida con nuestro curso autoguiado.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/clases" title="Clases y Retiros">
                    Sesiones en vivo y retiros para profundizar en el Eneagrama.
                  </ListItem>
                  <ListItem href="/certificaciones" title="Certificaciones">
                    Conviértete en un profesional certificado del Eneagrama.
                  </ListItem>
                  <ListItem href="/libro" title="Libro Oficial">
                    Adquiere el libro físico con todos los fundamentos del Eneagrama.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/sobre-mi" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Sobre Mí</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contacto" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Contacto</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex flex-1 items-center justify-between md:justify-end space-x-2 md:space-x-4">
        {isMobile && (
          <>
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-8 w-[150px]">
                <Image
                  src="/FTS title logo.png"
                  alt="Eneagrama | Fanny Torres Da Silva"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <Link href="/" className="flex items-center space-x-2 mb-8">
                  <div className="relative h-8 w-[200px]">
                    <Image
                      src="/FTS title logo.png"
                      alt="Eneagrama | Fanny Torres Da Silva"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </Link>
                <nav className="flex flex-col space-y-4">
                  <Link href="/" className="text-lg font-medium">
                    Inicio
                  </Link>
                  <Link href="/curso" className="text-lg font-medium">
                    Curso Completo
                  </Link>
                  <Link href="/clases" className="text-lg font-medium">
                    Clases y Retiros
                  </Link>
                  <Link href="/certificaciones" className="text-lg font-medium">
                    Certificaciones
                  </Link>
                  <Link href="/libro" className="text-lg font-medium">
                    Libro Oficial
                  </Link>
                  <Link href="/sobre-mi" className="text-lg font-medium">
                    Sobre Mí
                  </Link>
                  <Link href="/contacto" className="text-lg font-medium">
                    Contacto
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </>
        )}
        <div className="hidden md:flex">
          <Link href="/curso">
            <Button variant="default" className="mr-2">
              Comprar Curso
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Iniciar Sesión</Button>
          </Link>
        </div>
      </div>
    </>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"
