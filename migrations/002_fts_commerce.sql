-- FTS Commerce tables (book orders, session invoices, AR manual requests)
-- Apply once via Supabase SQL Editor (or psql). Also auto-created at runtime
-- when DATABASE_URL is set (see lib/commerce/ensure-schema.ts).
-- Requires PostgreSQL 13+ (gen_random_uuid).

CREATE TABLE IF NOT EXISTS commerce_orders (
  id                  UUID        PRIMARY KEY,
  external_reference  TEXT        NOT NULL,
  country             TEXT        NOT NULL CHECK (country IN ('AR', 'CL')),
  status              TEXT        NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  items               JSONB       NOT NULL,
  total               INT         NOT NULL,
  buyer               JSONB       NOT NULL,
  mp_preference_id    TEXT,
  mp_payment_id       TEXT,
  paid_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_commerce_orders_external_ref
  ON commerce_orders (external_reference);
CREATE INDEX IF NOT EXISTS idx_commerce_orders_status
  ON commerce_orders (status);

CREATE TABLE IF NOT EXISTS commerce_session_invoices (
  id                      UUID        PRIMARY KEY,
  external_reference      TEXT        NOT NULL,
  booking_id              TEXT,
  country                 TEXT        NOT NULL CHECK (country IN ('AR', 'CL')),
  status                  TEXT        NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  client_name             TEXT        NOT NULL,
  client_email            TEXT        NOT NULL,
  title                   TEXT        NOT NULL,
  unit_price              INT         NOT NULL,
  currency                TEXT        NOT NULL CHECK (currency IN ('CLP', 'ARS')),
  total                   INT         NOT NULL,
  mp_preference_id        TEXT,
  init_point              TEXT,
  mp_payment_id           TEXT,
  paid_at                 TIMESTAMPTZ,
  checkout_email_sent_at  TIMESTAMPTZ,
  receipt_email_sent_at   TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_commerce_session_invoices_external_ref
  ON commerce_session_invoices (external_reference);
CREATE INDEX IF NOT EXISTS idx_commerce_session_invoices_status
  ON commerce_session_invoices (status);

CREATE TABLE IF NOT EXISTS commerce_ar_book_requests (
  id                   UUID        PRIMARY KEY,
  status               TEXT        NOT NULL,
  country              TEXT        NOT NULL CHECK (country = 'AR'),
  quantity             INT         NOT NULL,
  unit_price           INT         NOT NULL,
  total                INT         NOT NULL,
  currency             TEXT        NOT NULL CHECK (currency = 'ARS'),
  buyer                JSONB       NOT NULL,
  product_name         TEXT        NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  admin_email_sent_at  TIMESTAMPTZ
);
