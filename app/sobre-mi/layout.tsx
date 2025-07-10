import { MainNav } from '@/components/main-nav'
import { Footer } from '@/components/footer'
import { BackArrow } from "@/components/BackArrow";

export default function BioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <BackArrow href="/" />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
} 