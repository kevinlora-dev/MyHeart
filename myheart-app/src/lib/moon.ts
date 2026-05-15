/**
 * Astronomical moon phase calculator.
 * Returns phase in [0,1): 0 = new, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter.
 */
export function moonPhaseAt(date: Date): {
  phase: number;
  illumination: number; // 0..1
  age: number; // days since new moon
  name: string;
} {
  // Algorithm from "Astronomical Algorithms" (Meeus), simplified.
  const synodic = 29.530588853;
  // Reference new moon: 2000-01-06 18:14 UTC (JD 2451550.1)
  const jd = toJulianDate(date);
  const daysSinceRef = jd - 2451550.1;
  let phase = (daysSinceRef / synodic) % 1;
  if (phase < 0) phase += 1;
  const age = phase * synodic;
  // Illumination = (1 - cos(2π * phase)) / 2
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  const name = phaseName(phase);
  return { phase, illumination, age, name };
}

function toJulianDate(date: Date): number {
  // From any Date (treated as UTC) to Julian Date
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() +
    (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) / 24;
  let Y = y, M = m;
  if (M <= 2) { Y -= 1; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5;
}

function phaseName(phase: number): string {
  if (phase < 0.03 || phase > 0.97) return 'Luna Nueva';
  if (phase < 0.22) return 'Creciente Iluminante';
  if (phase < 0.28) return 'Cuarto Creciente';
  if (phase < 0.47) return 'Gibosa Creciente';
  if (phase < 0.53) return 'Luna Llena';
  if (phase < 0.72) return 'Gibosa Menguante';
  if (phase < 0.78) return 'Cuarto Menguante';
  return 'Menguante Iluminante';
}
