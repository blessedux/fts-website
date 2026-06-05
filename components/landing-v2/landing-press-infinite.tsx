"use client"

import Image from "next/image"
import { ExternalLink } from "lucide-react"
import {
  DraggableContainer,
  GridBody,
  GridItem,
} from "@/components/ui/infinite-drag-scroll"
import { PRESS_ITEMS } from "@/lib/landing-v2/press"

function PressGridItem({
  src,
  alt,
  caption,
  url,
}: {
  src: string
  alt: string
  caption: string
  url?: string
}) {
  const image = (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 144px, 256px"
      className="pointer-events-none object-cover"
      draggable={false}
    />
  )

  const content = (
    <>
      <div className="relative h-full w-full">{image}</div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--lv2-void)]/90 via-[var(--lv2-void)]/40 to-transparent px-3 pb-3 pt-10">
        <p className="lv2-body line-clamp-2 text-xs text-[var(--lv2-ivory)] md:text-sm">
          {caption}
        </p>
        {url ? (
          <span className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[var(--lv2-taupe)] md:text-xs">
            Ver artículo
            <ExternalLink className="h-3 w-3" strokeWidth={1.5} aria-hidden />
          </span>
        ) : null}
      </div>
    </>
  )

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block h-full w-full"
        aria-label={`${caption} — abrir enlace externo`}
      >
        {content}
      </a>
    )
  }

  return <div className="relative h-full w-full">{content}</div>
}

export function LandingPressInfinite() {
  return (
    <DraggableContainer variant="masonry" heightClassName="h-[100dvh]">
      <GridBody>
        {PRESS_ITEMS.map((item) => (
          <GridItem
            key={item.id}
            className="relative h-52 w-36 md:h-96 md:w-64"
          >
            <PressGridItem
              src={item.src}
              alt={item.alt}
              caption={item.caption}
              url={item.url}
            />
          </GridItem>
        ))}
      </GridBody>
    </DraggableContainer>
  )
}
