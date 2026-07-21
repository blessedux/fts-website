import { MercadoPagoConfig, Preference, User } from "mercadopago"
import { requireMpAccessToken } from "@/lib/payments/env"
import type { MpCountry } from "@/lib/payments/types"

export function getMercadoPagoConfig(country: MpCountry): MercadoPagoConfig {
  return new MercadoPagoConfig({
    accessToken: requireMpAccessToken(country),
    options: { timeout: 10_000 },
  })
}

export function getPreferenceClient(country: MpCountry): Preference {
  return new Preference(getMercadoPagoConfig(country))
}

export function getUserClient(country: MpCountry): User {
  return new User(getMercadoPagoConfig(country))
}

/** Smoke-check credentials: GET /users/me for the country seller account. */
export async function fetchMpSellerProfile(country: MpCountry) {
  const user = getUserClient(country)
  return user.get()
}
