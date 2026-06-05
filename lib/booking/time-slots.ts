import { getSlotEndHour, getSlotStartHour, getSlotStepMinutes } from "@/lib/booking/env";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Generate time slot starts from env config.
 * Defaults: 09:00–17:00 on the hour (9 slots for 60-min/18h config).
 * All values are read from env on each call; results are consistent within a request.
 */
export function getTimeSlots(): string[] {
  const startMin = getSlotStartHour() * 60;
  const endMin = getSlotEndHour() * 60;
  const step = getSlotStepMinutes();
  const slots: string[] = [];
  for (let m = startMin; m < endMin; m += step) {
    slots.push(`${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`);
  }
  return slots;
}

export function getSlotCount(): number {
  return getTimeSlots().length;
}
