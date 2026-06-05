import { useEffect, type RefObject } from "react"

type UseHeroVideoAutoplayOptions = {
  enabled: boolean
  /** Simple loop on touch devices — avoids ping-pong CPU cost and iOS quirks */
  loop?: boolean
}

/**
 * Reliable muted autoplay for iOS Safari: playsInline + muted + retry on
 * loadeddata, visibilitychange, and the first user gesture (scroll/touch).
 */
export function useHeroVideoAutoplay(
  videoRef: RefObject<HTMLVideoElement | null>,
  { enabled, loop = false }: UseHeroVideoAutoplayOptions
) {
  useEffect(() => {
    const video = videoRef.current
    if (!video || !enabled) return undefined

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.loop = loop
    video.setAttribute("playsinline", "")
    video.setAttribute("webkit-playsinline", "")

    let gestureBound = false

    const tryPlay = () => {
      if (!video.paused && !video.ended) return
      void video.play().catch(() => undefined)
    }

    const bindGestureFallback = () => {
      if (gestureBound) return
      gestureBound = true
      window.addEventListener("touchstart", tryPlay, { once: true, passive: true })
      window.addEventListener("scroll", tryPlay, { once: true, passive: true })
    }

    tryPlay()
    bindGestureFallback()

    video.addEventListener("loadeddata", tryPlay)
    video.addEventListener("canplay", tryPlay)

    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay()
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      video.removeEventListener("loadeddata", tryPlay)
      video.removeEventListener("canplay", tryPlay)
      document.removeEventListener("visibilitychange", onVisibility)
      if (gestureBound) {
        window.removeEventListener("touchstart", tryPlay)
        window.removeEventListener("scroll", tryPlay)
      }
    }
  }, [videoRef, enabled, loop])
}
