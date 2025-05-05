// Este archivo contendría la configuración de Mercado Pago

// Ejemplo de configuración
import mercadopago from "mercadopago"

export function initMercadoPago() {
  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN is required")
  }

  mercadopago.configure({
    access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  })

  return mercadopago
}

export async function createPreference(items: any[], payer: any, backUrls: any) {
  const mp = initMercadoPago()

  const preference = {
    items,
    payer,
    back_urls: backUrls,
    auto_return: "approved",
    statement_descriptor: "Eneagrama - Fanny Torres",
    external_reference: `ORDER_${Date.now()}`,
  }

  try {
    const response = await mp.preferences.create(preference)
    return response.body
  } catch (error) {
    console.error("Error creating preference:", error)
    throw error
  }
}
