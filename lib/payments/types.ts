/** Mercado Pago country contexts supported in Commerce v1. */
export type MpCountry = "AR" | "CL"

export const MP_COUNTRIES: MpCountry[] = ["AR", "CL"]

/** Mercado Pago site_id expected for each country account. */
export const MP_SITE_BY_COUNTRY: Record<MpCountry, string> = {
  AR: "MLA",
  CL: "MLC",
}

/** ISO 4217 currency used when creating Checkout Pro preferences. */
export const MP_CURRENCY_BY_COUNTRY: Record<MpCountry, string> = {
  AR: "ARS",
  CL: "CLP",
}

export function isMpCountry(value: string): value is MpCountry {
  return value === "AR" || value === "CL"
}
