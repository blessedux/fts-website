"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [color, setColor] = useState(value || "#ffffff")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  useEffect(() => {
    if (!isPickerOpen || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Dibujar el gradiente de colores
    const gradientH = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradientH.addColorStop(0, "#ff0000")
    gradientH.addColorStop(1 / 6, "#ffff00")
    gradientH.addColorStop(2 / 6, "#00ff00")
    gradientH.addColorStop(3 / 6, "#00ffff")
    gradientH.addColorStop(4 / 6, "#0000ff")
    gradientH.addColorStop(5 / 6, "#ff00ff")
    gradientH.addColorStop(1, "#ff0000")

    ctx.fillStyle = gradientH
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Añadir gradiente blanco y negro
    const gradientV = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradientV.addColorStop(0, "rgba(255, 255, 255, 1)")
    gradientV.addColorStop(0.5, "rgba(255, 255, 255, 0)")
    gradientV.addColorStop(0.5, "rgba(0, 0, 0, 0)")
    gradientV.addColorStop(1, "rgba(0, 0, 0, 1)")

    ctx.fillStyle = gradientV
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [isPickerOpen])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const imageData = ctx.getImageData(x, y, 1, 1).data
    const selectedColor = `#${imageData[0].toString(16).padStart(2, "0")}${imageData[1].toString(16).padStart(2, "0")}${imageData[2].toString(16).padStart(2, "0")}`

    setColor(selectedColor)
    onChange(selectedColor)
  }

  return (
    <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-sm border" style={{ backgroundColor: color }} />
            <span>{color}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          <canvas
            ref={canvasRef}
            width={200}
            height={200}
            className="cursor-crosshair rounded-md"
            onClick={handleCanvasClick}
          />
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md border" style={{ backgroundColor: color }} />
            <input
              type="text"
              value={color}
              onChange={(e) => {
                setColor(e.target.value)
                onChange(e.target.value)
              }}
              className="w-full rounded-md border px-2 py-1 text-sm"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
