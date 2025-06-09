import Link from "next/link"
import { Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fanny Torres Silva. Todos los derechos reservados.
          </div>
          
          <div className="flex space-x-4">
            <Link 
              href="https://instagram.com/fanny.torres.silva" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Instagram
            </Link>
            <Link 
              href="https://linkedin.com/in/fanny-torres-silva" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
