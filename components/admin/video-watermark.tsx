"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function VideoWatermark({ videoSrc }: { videoSrc: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [watermarkText, setWatermarkText] = useState("Eneagrama - Fanny Torres")
  const [watermarkPosition, setWatermarkPosition] = useState("bottom-right")
  const [watermarkOpacity, setWatermarkOpacity] = useState(70)
  const [watermarkSize, setWatermarkSize] = useState(24)
  const [watermarkColor, setWatermarkColor] = useState("#ffffff")
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null)
  const [useLogoImage, setUseLogoImage] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  // Cargar la imagen del logo
  useEffect(() => {
    const img = new Image()
    img.src = "/placeholder.svg?height=100&width=100" // Reemplazar con la URL real del logo
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setLogoImage(img)
    }
  }, [])

  // Manejar la reproducción del video
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("ended", handleEnded)
    }
  }, [])

  // Dibujar el watermark en el canvas
  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !isPlaying) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    const render = () => {
      // Ajustar el tamaño del canvas al video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Dibujar el frame del video
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Calcular posición del watermark
      let x = 20
      let y = 20

      if (watermarkPosition === "bottom-right") {
        x = canvas.width - (useLogoImage && logoImage ? logoImage.width / 2 : ctx.measureText(watermarkText).width) - 20
        y = canvas.height - (useLogoImage && logoImage ? logoImage.height / 2 : watermarkSize) - 20
      } else if (watermarkPosition === "bottom-left") {
        x = 20
        y = canvas.height - (useLogoImage && logoImage ? logoImage.height / 2 : watermarkSize) - 20
      } else if (watermarkPosition === "top-right") {
        x = canvas.width - (useLogoImage && logoImage ? logoImage.width / 2 : ctx.measureText(watermarkText).width) - 20
        y = 20 + (useLogoImage && logoImage ? logoImage.height / 2 : 0)
      }

      // Aplicar opacidad
      ctx.globalAlpha = watermarkOpacity / 100

      // Dibujar logo o texto
      if (useLogoImage && logoImage) {
        // Dibujar logo
        const logoWidth = logoImage.width / 2
        const logoHeight = logoImage.height / 2
        ctx.drawImage(logoImage, x - logoWidth / 2, y - logoHeight / 2, logoWidth, logoHeight)
      } else {
        // Dibujar texto
        ctx.font = `${watermarkSize}px Arial`
        ctx.fillStyle = watermarkColor
        ctx.fillText(watermarkText, x, y)
      }

      // Restaurar opacidad
      ctx.globalAlpha = 1.0

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [
    isPlaying,
    watermarkText,
    watermarkPosition,
    watermarkOpacity,
    watermarkSize,
    watermarkColor,
    useLogoImage,
    logoImage,
  ])

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused || video.ended) {
      video.play()
    } else {
      video.pause()
    }
  }

  const handleProcessVideo = () => {
    setIsProcessing(true)

    // Aquí iría la lógica para procesar el video con la marca de agua
    // En un caso real, se enviaría el canvas o la configuración a un servidor
    // para procesar el video completo

    // Simulamos el procesamiento
    setTimeout(() => {
      setIsProcessing(false)
      alert("¡Video procesado con éxito! La marca de agua ha sido aplicada.")
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
            <CardDescription>Previsualiza cómo se verá la marca de agua en el video</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="relative">
              <video ref={videoRef} src={videoSrc} className="hidden" controls width="640" height="360" />
              <canvas
                ref={canvasRef}
                className="max-h-[500px] w-full rounded-md object-contain"
                onClick={togglePlayPause}
              />
              {!isPlaying && (
                <Button
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-600 hover:bg-rose-700"
                  onClick={togglePlayPause}
                >
                  Reproducir
                </Button>
              )}
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={togglePlayPause}>
              {isPlaying ? "Pausar" : "Reproducir"}
            </Button>
            <Button className="bg-rose-600 hover:bg-rose-700" onClick={handleProcessVideo} disabled={isProcessing}>
              {isProcessing ? "Procesando..." : "Aplicar Marca de Agua"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuración de Marca de Agua</CardTitle>
            <CardDescription>Personaliza la apariencia de la marca de agua</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="logo">
              <TabsList className="w-full">
                <TabsTrigger value="logo" onClick={() => setUseLogoImage(true)}>
                  Logo
                </TabsTrigger>
                <TabsTrigger value="text" onClick={() => setUseLogoImage(false)}>
                  Texto
                </TabsTrigger>
              </TabsList>

              <TabsContent value="logo" className="space-y-4 pt-4">
                <div className="flex justify-center">
                  <div className="h-20 w-20 overflow-hidden rounded-md border">
                    {logoImage && (
                      <img
                        src={logoImage.src || "/placeholder.svg"}
                        alt="Logo"
                        className="h-full w-full object-contain"
                      />
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Cambiar Logo</Label>
                  <Input type="file" accept="image/*" />
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="watermark-text">Texto</Label>
                  <Input id="watermark-text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="watermark-size">Tamaño de Texto</Label>
                  <Slider
                    id="watermark-size"
                    min={12}
                    max={48}
                    step={1}
                    value={[watermarkSize]}
                    onValueChange={(value) => setWatermarkSize(value[0])}
                  />
                  <div className="text-right text-sm text-muted-foreground">{watermarkSize}px</div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="watermark-color">Color</Label>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md border" style={{ backgroundColor: watermarkColor }} />
                    <Input
                      id="watermark-color"
                      type="text"
                      value={watermarkColor}
                      onChange={(e) => setWatermarkColor(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <div className="mt-4 space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="watermark-position">Posición</Label>
                  <Select value={watermarkPosition} onValueChange={setWatermarkPosition}>
                    <SelectTrigger id="watermark-position">
                      <SelectValue placeholder="Seleccionar posición" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top-left">Superior Izquierda</SelectItem>
                      <SelectItem value="top-right">Superior Derecha</SelectItem>
                      <SelectItem value="bottom-left">Inferior Izquierda</SelectItem>
                      <SelectItem value="bottom-right">Inferior Derecha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="watermark-opacity">Opacidad</Label>
                  <Slider
                    id="watermark-opacity"
                    min={10}
                    max={100}
                    step={1}
                    value={[watermarkOpacity]}
                    onValueChange={(value) => setWatermarkOpacity(value[0])}
                  />
                  <div className="text-right text-sm text-muted-foreground">{watermarkOpacity}%</div>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
