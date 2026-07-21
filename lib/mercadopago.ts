/**
 * @deprecated Import from `@/lib/payments/*` instead.
 * Kept as a thin re-export so older imports keep working.
 */
export { createCheckoutPreference as createPreference } from "@/lib/payments/preference"
export { getMercadoPagoConfig, getPreferenceClient } from "@/lib/payments/client"
export { getDefaultMpCountry, requireMpAccessToken } from "@/lib/payments/env"
