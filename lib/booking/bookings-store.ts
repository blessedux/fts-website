import type postgres from "postgres";

export type BookingRow = {
  id: string;
  booked_on: string;
  start_hm: string;
  duration_minutes: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  modality: string;
  notes: string | null;
  status: string;
  ics_uid: string;
};

export async function listBusySlotsInRange(
  sql: ReturnType<typeof postgres>,
  fromYmd: string,
  toYmd: string,
): Promise<Record<string, string[]>> {
  const rows = await sql<{ booked_on: string; start_hm: string }[]>`
    SELECT booked_on::text AS booked_on, start_hm
    FROM bookings
    WHERE status IN ('confirmed', 'pending')
      AND booked_on >= ${fromYmd}::date
      AND booked_on <= ${toYmd}::date
  `;
  const out: Record<string, string[]> = {};
  for (const r of rows) {
    const ymd = r.booked_on.slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) continue;
    const hm = r.start_hm.trim().slice(0, 5);
    if (!/^\d{2}:\d{2}$/.test(hm)) continue;
    if (!out[ymd]) out[ymd] = [];
    out[ymd].push(hm);
  }
  return out;
}

export type CreateBookingInput = {
  booked_on: string;
  start_hm: string;
  duration_minutes: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  modality: string;
  notes: string | null;
  ics_uid: string;
};

export async function getBookingById(
  sql: ReturnType<typeof postgres>,
  id: string,
): Promise<BookingRow | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = await sql<BookingRow[]>`
    SELECT id::text AS id, booked_on::text AS booked_on, start_hm, duration_minutes,
           guest_name, guest_email, guest_phone, modality, notes, status, ics_uid
    FROM bookings
    WHERE id = ${id}::uuid
    LIMIT 1
  `;
  const r = rows[0];
  if (!r) return null;
  return { ...r, booked_on: r.booked_on.slice(0, 10) };
}

export async function createBooking(
  sql: ReturnType<typeof postgres>,
  input: CreateBookingInput,
): Promise<{ ok: true; id: string } | { ok: false; conflict: true }> {
  const rows = await sql<{ id: string }[]>`
    INSERT INTO bookings (
      booked_on, start_hm, duration_minutes, guest_name, guest_email,
      guest_phone, modality, notes, status, ics_uid
    ) VALUES (
      ${input.booked_on}::date,
      ${input.start_hm},
      ${input.duration_minutes},
      ${input.guest_name},
      ${input.guest_email},
      ${input.guest_phone},
      ${input.modality},
      ${input.notes},
      'pending',
      ${input.ics_uid}
    )
    ON CONFLICT (booked_on, start_hm) DO NOTHING
    RETURNING id
  `;
  if (rows.length === 0) return { ok: false, conflict: true };
  return { ok: true, id: rows[0].id };
}

export async function confirmBooking(
  sql: ReturnType<typeof postgres>,
  id: string,
): Promise<
  | { ok: true; row: BookingRow }
  | { ok: false; reason: "not_found" | "already_confirmed" | "cancelled" }
> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return { ok: false, reason: "not_found" };
  }

  const rows = await sql<BookingRow[]>`
    UPDATE bookings
    SET status = 'confirmed'
    WHERE id = ${id}::uuid
      AND status = 'pending'
    RETURNING id::text AS id, booked_on::text AS booked_on, start_hm, duration_minutes,
              guest_name, guest_email, guest_phone, modality, notes, status, ics_uid
  `;

  const row = rows[0];
  if (!row) {
    const existing = await getBookingById(sql, id);
    if (!existing) return { ok: false, reason: "not_found" };
    if (existing.status === "confirmed") {
      return { ok: false, reason: "already_confirmed" };
    }
    return { ok: false, reason: "cancelled" };
  }

  return { ok: true, row: { ...row, booked_on: row.booked_on.slice(0, 10) } };
}
