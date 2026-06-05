#!/usr/bin/env node
/**
 * Debug the booking availability API for the current month.
 * Run with the dev server active:
 *   npm run dev          (in one terminal)
 *   npm run booking:availability           (in another)
 *   npm run booking:availability -- --debug  (verbose)
 */

const base =
  process.env.BOOKING_AVAILABILITY_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:3000";

function monthRange(y, m0) {
  const from = `${y}-${String(m0 + 1).padStart(2, "0")}-01`;
  const last = new Date(y, m0 + 1, 0).getDate();
  const to = `${y}-${String(m0 + 1).padStart(2, "0")}-${String(last).padStart(2, "0")}`;
  return { from, to };
}

const debug = process.argv.includes("--debug");
const now = new Date();
const { from, to } = monthRange(now.getFullYear(), now.getMonth());
const url = `${base}/api/booking-availability?from=${from}&to=${to}${debug ? "&debug=1" : ""}`;

console.log("Fetching:", url, "\n");

const res = await fetch(url);
const text = await res.text();
let json;
try {
  json = JSON.parse(text);
} catch {
  console.error("Non-JSON response:", text.slice(0, 500));
  process.exit(1);
}

const slots = json.availableSlotsByDate || {};
const totalSlots = Object.values(slots).reduce((n, arr) => n + arr.length, 0);

const summary = {
  url,
  ok: res.ok,
  timezone: json.timezone,
  databaseConfigured: json.databaseConfigured,
  databaseConnected: json.databaseConnected,
  caldavConfigured: json.caldavConfigured,
  caldavOk: json.caldavOk,
  caldavError: json.caldavError,
  blockedDates: json.blockedDates,
  weekdaysWithAvailability: Object.keys(slots).length,
  totalOpenSlotStarts: totalSlots,
  availableSlotsByDate: slots,
};

if (debug && json._debug) summary.debug = json._debug;

console.log(JSON.stringify(summary, null, 2));
