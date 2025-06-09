import { MainNav } from "@/components/main-nav"
import { HeroSection } from "@/components/hero-section"
import { FeatureSection } from "@/components/feature-section"
import { CourseSection } from "@/components/course-section"
import { BookSection } from "@/components/book-section"
import { RetreatSection } from "@/components/retreat-section"
import { TestimonialSection } from "@/components/testimonial-section"
import { PressSection } from "@/components/press-section"
import { RadioProgramSection } from "@/components/radio-program-section"
import { Footer } from "@/components/footer"


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        <CourseSection />
        <BookSection />
        <RetreatSection />
        <PressSection />
        <RadioProgramSection />
        <TestimonialSection />
      </main>
      <Footer />
    </div>
  )
}
