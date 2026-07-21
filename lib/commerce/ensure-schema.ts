import { getDb, hasDatabase } from "@/lib/booking/db"

let schemaReady: Promise<void> | null = null

/**
 * Create commerce tables if missing. Safe to call on every request (runs once per isolate).
 */
export async function ensureCommerceSchema(): Promise<void> {
  const sql = getDb()
  if (!sql) return
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS commerce_orders (
          id                  UUID        PRIMARY KEY,
          external_reference  TEXT        NOT NULL,
          country             TEXT        NOT NULL,
          status              TEXT        NOT NULL,
          items               JSONB       NOT NULL,
          total               INT         NOT NULL,
          buyer               JSONB       NOT NULL,
          mp_preference_id    TEXT,
          mp_payment_id       TEXT,
          paid_at             TIMESTAMPTZ,
          created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
      await sql`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_commerce_orders_external_ref
          ON commerce_orders (external_reference)
      `
      await sql`
        CREATE TABLE IF NOT EXISTS commerce_session_invoices (
          id                      UUID        PRIMARY KEY,
          external_reference      TEXT        NOT NULL,
          booking_id              TEXT,
          country                 TEXT        NOT NULL,
          status                  TEXT        NOT NULL,
          client_name             TEXT        NOT NULL,
          client_email            TEXT        NOT NULL,
          title                   TEXT        NOT NULL,
          unit_price              INT         NOT NULL,
          currency                TEXT        NOT NULL,
          total                   INT         NOT NULL,
          mp_preference_id        TEXT,
          init_point              TEXT,
          mp_payment_id           TEXT,
          paid_at                 TIMESTAMPTZ,
          checkout_email_sent_at  TIMESTAMPTZ,
          receipt_email_sent_at   TIMESTAMPTZ,
          created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
      await sql`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_commerce_session_invoices_external_ref
          ON commerce_session_invoices (external_reference)
      `
      await sql`
        CREATE TABLE IF NOT EXISTS commerce_ar_book_requests (
          id                   UUID        PRIMARY KEY,
          status               TEXT        NOT NULL,
          country              TEXT        NOT NULL,
          quantity             INT         NOT NULL,
          unit_price           INT         NOT NULL,
          total                INT         NOT NULL,
          currency             TEXT        NOT NULL,
          buyer                JSONB       NOT NULL,
          product_name         TEXT        NOT NULL,
          created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          admin_email_sent_at  TIMESTAMPTZ
        )
      `
    })().catch((err) => {
      schemaReady = null
      throw err
    })
  }
  await schemaReady
}

/** File JSON store is local-only; Vercel requires DATABASE_URL. */
export function assertCommerceStoreAvailable(): void {
  if (hasDatabase()) return
  if (process.env.VERCEL) {
    throw new Error(
      "DATABASE_URL is required on Vercel for commerce checkout. Use the same Supabase transaction pooler URI as bookings.",
    )
  }
}

export function useCommerceDb(): boolean {
  return hasDatabase()
}
