"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

export function MainNav() {
  const isMobile = useMobile()

  return (
    <>
      <div className="mr-4 hidden md:flex">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <div className="relative h-12 w-[300px]">
            <Image
              src="/imgs/enean_logo.svg"
              alt="Eneagrama | Fanny Torres Da Silva"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-between md:justify-end space-x-2 md:space-x-4">
        {isMobile && (
          <>
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-10 w-[200px]">
                <Image
                  src="/imgs/enean_logo.svg"
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
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <Link href="/" className="flex items-center space-x-2 mb-8">
                  <div className="relative h-12 w-[300px]">
                    <Image
                      src="/imgs/enean_logo.svg"
                      alt="Eneagrama | Fanny Torres Da Silva"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </Link>
                <nav className="flex flex-col space-y-4">
                  <Link href="/curso" className="text-lg font-medium">
                    Curso Completo
                  </Link>
                  <Link href="/login" className="text-lg font-medium">
                    Iniciar Sesión
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
