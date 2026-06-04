import { useEffect, type RefObject } from "react"

type UsePingPongVideoOptions = {
  enabled: boolean
  /** When disabled, fall back to a normal loop (e.g. prefers-reduced-motion). */
  loopFallback?: boolean
}

/**
 * Ping-pong playback via manual reverse scrubbing (works when playbackRate -1 fails).
 */
export function usePingPongVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  { enabled, loopFallback = false }: UsePingPongVideoOptions
) {
  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    if (!enabled) {
      video.loop = loopFallback
      video.playbackRate = 1
      if (loopFallback) void video.play().catch(() => undefined)
      return undefined
    }

    let disposed = false
    let reverseRaf = 0

    const stopReverse = () => {
      cancelAnimationFrame(reverseRaf)
      reverseRaf = 0
    }

    const playForward = () => {
      if (disposed) return
      stopReverse()
      video.loop = false
      video.playbackRate = 1
      if (video.currentTime < 0.03) video.currentTime = 0
      void video.play().catch(() => undefined)
    }

    const scrubReverse = () => {
      if (disposed) return
      stopReverse()
      video.pause()

      const duration = video.duration
      if (!Number.isFinite(duration) || duration <= 0) {
        playForward()
        return
      }

      if (video.currentTime > duration - 0.05) {
        video.currentTime = duration - 0.05
      }

      let last = performance.now()

      const step = (now: number) => {
        if (disposed) return
        const dt = Math.min((now - last) / 1000, 0.05)
        last = now
        video.currentTime = Math.max(0, video.currentTime - dt)

        if (video.currentTime <= 0.02) {
          video.currentTime = 0
          playForward()
          return
        }

        reverseRaf = requestAnimationFrame(step)
      }

      reverseRaf = requestAnimationFrame(step)
    }

    const onEnded = () => {
      scrubReverse()
    }

    const start = () => {
      video.loop = false
      video.playbackRate = 1
      video.currentTime = 0
      void video.play().catch(() => undefined)
    }

    video.addEventListener("ended", onEnded)

    if (video.readyState >= 1) {
      start()
    } else {
      video.addEventListener("loadedmetadata", start, { once: true })
    }

    return () => {
      disposed = true
      stopReverse()
      video.removeEventListener("ended", onEnded)
      video.playbackRate = 1
      video.loop = false
    }
  }, [videoRef, enabled, loopFallback])
}
