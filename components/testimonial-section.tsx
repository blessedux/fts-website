import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"

export function TestimonialSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Lo que Dicen Nuestros Estudiantes</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Descubre cómo el Eneagrama ha transformado la vida de quienes han tomado nuestros cursos.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-4 lg:gap-8 mt-12">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 overflow-hidden rounded-full">
                  <Image
                    src="/imgs/test1.webp"
                    alt="Avatar"
                    fill
                    className="object-cover"
                    style={{ 
                      objectPosition: 'center',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Betty</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Eneatipo 2</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                "Hola   les comento 
                que entré al mundo del Eneagrama (desconocido para mí)   
                felizmente de la mano Fanny..con la cual descubrí y fui 
                conociendo una gran herramienta para autoevaluarnos /
                conocernos..nosotros y el prójimo..y así mejorar el 
                transcurrir por esta vida..Siempre muy agradecida a Fanny 
                que trasmite tan generosa y cálidamente su saber."
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 overflow-hidden rounded-full">
                  <Image
                    src="/imgs/test2.webp"
                    alt="Avatar"
                    fill
                    className="object-cover"
                    style={{ 
                      objectPosition: 'center',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Angélica Pizarro</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Eneatipo 6</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                "Para mí el 
                eneagrama ha sido en  mi vida un antes y un después...
                Antes vivía en automático sin dimensionar lo que realizaba 
                día a día, vivía en son de darle el gusto a todos..
                Cuando conocí el eneagrama me di cuenta que número 
                soy,   cómo pienso, cómo vivo y cómo actuo ante las 
                diferentes situaciones de la vida...
                Hoy con lo que he ido conociéndome y aprendiendo a 
                soltar y darme permiso a cumplir mis sueños, voy paso a 
                paso a mi ritmo y cada día me siento más feliz y libre de 
                hacer lo que pienso y deseo hacer dando el gusto a mi."
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 overflow-hidden rounded-full">
                  <Image
                    src="/imgs/test3.webp"
                    alt="Avatar"
                    fill
                    className="object-cover"
                    style={{ 
                      objectPosition: 'center',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Pamela Santander Robles</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Eneatipo 4</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                "En algún momento, 
                en algún Lugar, había un oráculo que afirmaba "Conócete 
                a ti y conocerás al Universo…". Cuánta razón tenía y qué 
                hermosa experiencia hacerlo con Fanny a través del 
                Eneagrama. Todos quieren estar 
                en la página, qué lindo."
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 overflow-hidden rounded-full">
                  <Image
                    src="/imgs/test4.webp"
                    alt="Avatar"
                    fill
                    className="object-cover"
                    style={{ 
                      objectPosition: 'center',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Diego Gonzales</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Eneatipo 9</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                "Estudiar eneagrama 
                ha significado para mí tener una conexión, entre mi mundo 
                interior y el resto de las personas. Tener conciencia y 
                claridad de quién soy y qué es lo que quiero para mí, me 
                ha permitido entenderme y entender a los que me rodean 
                con mayor libertad. Sin culpas y con 
                una tribu que nos acompañamos desde otra dimensión. 
                Con cariño y confianza."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
