import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Fanny Torres Da Silva. Todos los derechos reservados.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/terminos">
            <p className="text-sm text-muted-foreground">Términos y Condiciones</p>
          </Link>
          <Link href="/privacidad">
            <p className="text-sm text-muted-foreground">Política de Privacidad</p>
          </Link>
        </div>
        <div className="flex gap-4">
          <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Facebook className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Instagram</span>
          </Link>
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Twitter</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
