import { createHmac, timingSafeEqual } from "crypto";

function getSecret(): string | null {
  const s = process.env.BOOKING_ICS_DOWNLOAD_SECRET?.trim();
  return s && s.length >= 16 ? s : null;
}

export function canSignBookingConfirmLinks(): boolean {
  return Boolean(getSecret());
}

export function signBookingConfirmToken(
  bookingId: string,
  expUnix: number,
): string {
  const secret = getSecret();
  if (!secret) throw new Error("BOOKING_ICS_DOWNLOAD_SECRET not configured");
  return createHmac("sha256", secret)
    .update(`confirm|${bookingId}|${expUnix}`)
    .digest("hex");
}

export function verifyBookingConfirmToken(
  bookingId: string,
  expUnix: number,
  sigHex: string,
): boolean {
  const secret = getSecret();
  if (!secret) return false;
  if (!/^[0-9a-f]{64}$/i.test(sigHex)) return false;
  const expected = createHmac("sha256", secret)
    .update(`confirm|${bookingId}|${expUnix}`)
    .digest("hex");
  try {
    return timingSafeEqual(
      Buffer.from(sigHex, "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
  }
}

/** 7-day signed confirm link expiry. */
export function bookingConfirmExpirySeconds(): number {
  return 60 * 60 * 24 * 7;
}

export function buildBookingConfirmUrl(
  siteUrl: string,
  bookingId: string,
): string | null {
  if (!canSignBookingConfirmLinks()) return null;
  const expUnix =
    Math.floor(Date.now() / 1000) + bookingConfirmExpirySeconds();
  const sig = signBookingConfirmToken(bookingId, expUnix);
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/api/bookings/confirm?id=${encodeURIComponent(bookingId)}&e=${expUnix}&sig=${sig}`;
}
