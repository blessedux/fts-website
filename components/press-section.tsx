import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function PressSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Press & Media</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Discover our latest press coverage and media appearances
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Featured Article</CardTitle>
              <CardDescription>March 15, 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                "Transforming lives through innovative coaching techniques..."
              </p>
              <Button variant="link" className="mt-4">
                Read More
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Media Interview</CardTitle>
              <CardDescription>February 28, 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                "Expert insights on personal development and growth..."
              </p>
              <Button variant="link" className="mt-4">
                Watch Now
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Press Release</CardTitle>
              <CardDescription>January 10, 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                "Launching new coaching programs for professional development..."
              </p>
              <Button variant="link" className="mt-4">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 