import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RadioProgramSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Radio Programs</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Tune in to our insightful radio programs and podcasts
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Show</CardTitle>
              <CardDescription>Every Monday at 8 PM</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Join us for our weekly discussion on personal growth and development
              </p>
              <Button variant="link" className="mt-4">
                Listen Now
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Special Interviews</CardTitle>
              <CardDescription>Monthly Series</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Exclusive interviews with industry leaders and experts
              </p>
              <Button variant="link" className="mt-4">
                View Archive
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Live Q&A</CardTitle>
              <CardDescription>Bi-weekly Sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Interactive sessions where we answer your questions live
              </p>
              <Button variant="link" className="mt-4">
                Join Next Session
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 