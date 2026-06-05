-- FTS Bookings table
-- Apply once via Supabase SQL Editor (or psql on the session/direct URI).
-- Requires PostgreSQL 13+ (gen_random_uuid).

CREATE TABLE IF NOT EXISTS bookings (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  booked_on        DATE        NOT NULL,
  start_hm         TEXT        NOT NULL,
  duration_minutes INT         NOT NULL,
  guest_name       TEXT        NOT NULL,
  guest_email      TEXT        NOT NULL,
  guest_phone      TEXT        NOT NULL,
  modality         TEXT        NOT NULL CHECK (modality IN ('presencial', 'online')),
  notes            TEXT,
  status           TEXT        NOT NULL DEFAULT 'pending',
  ics_uid          TEXT        NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT bookings_status_chk   CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  CONSTRAINT bookings_unique_slot  UNIQUE (booked_on, start_hm)
);

CREATE INDEX IF NOT EXISTS idx_bookings_booked_on    ON bookings (booked_on);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_email  ON bookings (guest_email);
CREATE INDEX IF NOT EXISTS idx_bookings_status       ON bookings (status);
