import Link from "next/link"
import { Linkedin, Instagram, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fanny Torres Silva. Todos los derechos reservados.
          </div>
          
          <div className="flex space-x-6">
            <Link 
              href="https://instagram.com/fanny.torres.silva" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link 
              href="https://linkedin.com/in/fanny-torres-silva" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link 
              href="https://wa.me/yourphonenumber" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
