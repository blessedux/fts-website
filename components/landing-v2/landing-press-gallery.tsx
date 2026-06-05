"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { PRESS_ITEMS, type PressItem } from "@/lib/landing-v2/press"

type LandingPressGalleryProps = {
  initialCount?: number
  items?: PressItem[]
}

export function LandingPressGallery({
  initialCount = 6,
  items = PRESS_ITEMS,
}: LandingPressGalleryProps) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? items : items.slice(0, initialCount)

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((image) => (
          <PressCard key={image.id} image={image} />
        ))}
      </div>

      {items.length > initialCount && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="group mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--lv2-taupe)]/40 bg-[var(--lv2-espresso)]/40 transition-colors hover:border-[var(--lv2-taupe)]"
            aria-label={showAll ? "Mostrar menos imágenes" : "Ver todas las imágenes"}
          >
            {showAll ? (
              <ChevronUp className="h-5 w-5 text-[var(--lv2-ivory)]" strokeWidth={1.5} />
            ) : (
              <ChevronDown className="h-5 w-5 text-[var(--lv2-ivory)]" strokeWidth={1.5} />
            )}
          </button>
          <p className="lv2-body mt-3 text-sm">
            {showAll ? "Mostrar menos" : "Ver más imágenes"}
          </p>
        </div>
      )}
    </div>
  )
}

function PressCard({ image }: { image: PressItem }) {
  const content = (
    <>
      <div className="aspect-[4/3] overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          width={400}
          height={300}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      {image.caption ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--lv2-void)]/90 via-[var(--lv2-void)]/50 to-transparent p-4 pt-10">
          <p className="font-[family-name:var(--font-hero-sans)] text-sm text-[var(--lv2-ivory)]">
            {image.caption}
          </p>
          {image.date ? (
            <p className="mt-1 text-xs text-[var(--lv2-taupe)]">{image.date}</p>
          ) : null}
        </div>
      ) : null}
    </>
  )

  const className =
    "lv2-press-card group relative overflow-hidden border border-[var(--lv2-taupe)]/25 bg-[var(--lv2-espresso)]/20"

  if (image.url) {
    return (
      <a
        href={image.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} block transition-colors hover:border-[var(--lv2-taupe)]/50`}
      >
        {content}
      </a>
    )
  }

  return <article className={className}>{content}</article>
}
