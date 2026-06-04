"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface Mouse {
  x: number
  y: number
  smoothX: number
  smoothY: number
  diff: number
}

interface Viewport {
  width: number
  height: number
}

class Particle {
  size: number
  x: number
  y: number
  el: SVGCircleElement

  constructor(
    x: number,
    y: number,
    size: number,
    particles: Particle[],
    color: string
  ) {
    this.size = size
    this.x = x
    this.y = y

    this.el = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    this.el.setAttribute("cx", this.x.toString())
    this.el.setAttribute("cy", this.y.toString())
    this.el.setAttribute("r", this.size.toString())
    this.el.setAttribute("fill", color)

    const tl = gsap.timeline()
    tl.to(this, {
      size: this.size * 2,
      ease: "power1.inOut",
      duration: 2,
    })
    tl.to(
      this,
      {
        size: 0,
        ease: "power4.in",
        duration: 4,
      },
      3
    )
    tl.call(() => this.kill(particles))
  }

  kill(particles: Particle[]) {
    const index = particles.indexOf(this)
    if (index > -1) {
      particles.splice(index, 1)
    }
    this.el.remove()
  }

  render() {
    this.el.setAttribute("cy", this.y.toString())
    this.el.setAttribute("cx", this.x.toString())
    this.el.setAttribute("r", this.size.toString())
  }
}

export type ParticleAnimationProps = {
  containerRef: React.RefObject<HTMLElement | null>
  maskId: string
  gooeyFilterId: string
  className?: string
  particleColor?: string
  enabled?: boolean
}

export function ParticleAnimation({
  containerRef,
  maskId,
  gooeyFilterId,
  className = "",
  particleColor = "#000",
  enabled = true,
}: ParticleAnimationProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapperRef = useRef<SVGGElement>(null)

  const mouseRef = useRef<Mouse>({
    x: 0,
    y: 0,
    smoothX: 0,
    smoothY: 0,
    diff: 0,
  })

  const viewportRef = useRef<Viewport>({ width: 0, height: 0 })
  const particlesRef = useRef<Particle[]>([])
  const animationIdRef = useRef<number | undefined>(undefined)
  const enabledRef = useRef(enabled)

  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      particlesRef.current.forEach((p) => p.kill(particlesRef.current))
      mouseRef.current.diff = 0
    }
  }, [enabled])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const mouse = mouseRef.current
    const viewport = viewportRef.current
    const particles = particlesRef.current

    const clearParticles = () => {
      particles.forEach((p) => p.kill(particles))
      particles.length = 0
    }

    const syncPointer = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect()
      mouse.x = clientX - rect.left
      mouse.y = clientY - rect.top
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!enabledRef.current) return
      syncPointer(e.clientX, e.clientY)
    }

    const onPointerEnter = (e: PointerEvent) => {
      syncPointer(e.clientX, e.clientY)
      mouse.smoothX = mouse.x
      mouse.smoothY = mouse.y
      mouse.diff = 0
    }

    const onResize = () => {
      const rect = container.getBoundingClientRect()
      viewport.width = Math.max(1, Math.round(rect.width))
      viewport.height = Math.max(1, Math.round(rect.height))

      if (svgRef.current) {
        svgRef.current.style.width = `${viewport.width}px`
        svgRef.current.style.height = `${viewport.height}px`

        const maskEl = svgRef.current.querySelector<SVGMaskElement>(`#${maskId}`)
        if (maskEl) {
          maskEl.setAttribute("width", String(viewport.width))
          maskEl.setAttribute("height", String(viewport.height))
          const backdrop = maskEl.querySelector("rect")
          if (backdrop) {
            backdrop.setAttribute("width", String(viewport.width))
            backdrop.setAttribute("height", String(viewport.height))
          }
        }
      }
    }

    const emitParticle = () => {
      if (!enabledRef.current || mouse.diff <= 0.01) return

      const particle = new Particle(
        mouse.smoothX,
        mouse.smoothY,
        mouse.diff * 0.2,
        particles,
        particleColor
      )
      particles.push(particle)
      wrapperRef.current?.prepend(particle.el)
    }

    const render = () => {
      mouse.smoothX += (mouse.x - mouse.smoothX) * 0.1
      mouse.smoothY += (mouse.y - mouse.smoothY) * 0.1
      mouse.diff = Math.hypot(mouse.x - mouse.smoothX, mouse.y - mouse.smoothY)

      emitParticle()

      particles.forEach((particle) => {
        particle.render()
      })

      animationIdRef.current = requestAnimationFrame(render)
    }

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(container)
    container.addEventListener("pointerenter", onPointerEnter)
    container.addEventListener("pointermove", onPointerMove, { passive: true })

    onResize()
    render()

    return () => {
      container.removeEventListener("pointerenter", onPointerEnter)
      container.removeEventListener("pointermove", onPointerMove)
      resizeObserver.disconnect()
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      clearParticles()
    }
  }, [containerRef, maskId, particleColor])

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      className={`pointer-events-none absolute inset-0 z-[8] h-full w-full ${className}`}
      aria-hidden
    >
      <defs>
        <filter id={gooeyFilterId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -7"
            result="goo"
          />
        </filter>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="100%"
          height="100%"
        >
          <rect width="100%" height="100%" fill="white" />
          <g ref={wrapperRef} filter={`url(#${gooeyFilterId})`} />
        </mask>
      </defs>
    </svg>
  )
}
