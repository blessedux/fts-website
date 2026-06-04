export const EXPAND_INICIO_PROCESO_EVENT = "fts:expand-inicio-proceso"
export const INICIO_PROCESO_ID = "inicio-proceso"

export function dispatchExpandInicioProceso() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(EXPAND_INICIO_PROCESO_EVENT))
}

export function scrollToInicioProceso() {
  if (typeof window === "undefined") return
  document.getElementById(INICIO_PROCESO_ID)?.scrollIntoView({ behavior: "smooth", block: "start" })
}
