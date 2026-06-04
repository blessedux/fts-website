"use client"

import Image from "next/image"
import { useCallback, useRef, useState } from "react"

const ZOOM = 1.75
const IMAGE_WIDTH = 1024
const IMAGE_HEIGHT = 1536
const HOVER_PAD_X = 28
const HOVER_PAD_Y = 36

type ArchetypeMagnifierCardProps = {
  name: string
  image: string
  incomingName: string
  incomingImage: string
  crossfadeActive: boolean
  onHoverChange: (hovered: boolean) => void
}

export function ArchetypeMagnifierCard({
  name,
  image,
  incomingName,
  incomingImage,
  crossfadeActive,
  onHoverChange,
}: ArchetypeMagnifierCardProps) {
  const hoverRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [lens, setLens] = useState({
    x: 0,
    y: 0,
    size: 200,
    bgX: 50,
    bgY: 50,
    bgW: 400,
    bgH: 600,
  })

  const magnifySrc = crossfadeActive ? incomingImage : image
  const magnifyAlt = crossfadeActive ? incomingName : name

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const hoverEl = hoverRef.current
    const imgWrap = imageRef.current
    if (!hoverEl || !imgWrap) return

    const hoverRect = hoverEl.getBoundingClientRect()
    const imgRect = imgWrap.getBoundingClientRect()

    const lensSize = Math.min(
      Math.max(imgRect.width * 1.12, imgRect.height * 0.52, 200),
      320
    )
    const half = lensSize / 2

    const x = Math.max(half, Math.min(hoverRect.width - half, e.clientX - hoverRect.left))
    const y = Math.max(half, Math.min(hoverRect.height - half, e.clientY - hoverRect.top))

    const xInImage = e.clientX - imgRect.left
    const yInImage = e.clientY - imgRect.top

    setLens({
      x,
      y,
      size: lensSize,
      bgX: (xInImage / imgRect.width) * 100,
      bgY: (yInImage / imgRect.height) * 100,
      bgW: imgRect.width * ZOOM,
      bgH: imgRect.height * ZOOM,
    })
  }, [])

  const handleEnter = () => {
    setActive(true)
    onHoverChange(true)
  }

  const handleLeave = () => {
    setActive(false)
    onHoverChange(false)
  }

  return (
    <div
      ref={hoverRef}
      className={`lv2-archetype-hover-zone relative w-full ${active ? "cursor-none" : ""}`}
      style={{
        paddingLeft: HOVER_PAD_X,
        paddingRight: HOVER_PAD_X,
        paddingTop: HOVER_PAD_Y,
        paddingBottom: HOVER_PAD_Y,
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
    >
      <div ref={imageRef} className="lv2-archetype-card relative mx-auto w-full">
        {crossfadeActive ? (
          <div className="lv2-archetype-crossfade-stack relative w-full">
            <Image
              src={image}
              alt={name}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              className="lv2-archetype-fade-out block h-auto w-full"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            <Image
              src={incomingImage}
              alt={incomingName}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              className="lv2-archetype-fade-in lv2-archetype-crossfade-layer--overlay absolute inset-0 h-full w-full object-contain"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
        ) : (
          <Image
            key={image}
            src={image}
            alt={name}
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            className="block h-auto w-full"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        )}
      </div>

      {active && (
        <div
          className="pointer-events-none absolute inset-0 z-[2] rounded-sm bg-[var(--lv2-void)]/15"
          aria-hidden
        />
      )}

      {active && (
        <div
          className="lv2-magnifier-lens pointer-events-none absolute z-[3]"
          style={{
            width: lens.size,
            height: lens.size,
            left: lens.x - lens.size / 2,
            top: lens.y - lens.size / 2,
            backgroundImage: `url(${magnifySrc})`,
            backgroundSize: `${lens.bgW}px ${lens.bgH}px`,
            backgroundPosition: `${lens.bgX}% ${lens.bgY}%`,
            backgroundRepeat: "no-repeat",
          }}
          aria-hidden
        />
      )}

      <p className="sr-only">{magnifyAlt}</p>
    </div>
  )
}
