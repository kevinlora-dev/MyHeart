import { ANNIVERSARY } from './constants';

export interface Duration {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

export function timeBetween(start: Date, end: Date): Duration {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  let hours = end.getHours() - start.getHours();
  let minutes = end.getMinutes() - start.getMinutes();
  let seconds = end.getSeconds() - start.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }
  if (days < 0) {
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) { months += 12; years--; }

  const diffMs = end.getTime() - start.getTime();
  return {
    years, months, days, hours, minutes, seconds,
    totalDays: Math.floor(diffMs / 86400000),
    totalHours: Math.floor(diffMs / 3600000),
    totalMinutes: Math.floor(diffMs / 60000),
    totalSeconds: Math.floor(diffMs / 1000),
  };
}

export function durationSinceAnniversary(now: Date = new Date()): Duration {
  return timeBetween(ANNIVERSARY, now);
}

/** List of monthly anniversaries from start until N months ahead */
export function monthAnniversaries(monthsAhead = 18): Date[] {
  const list: Date[] = [];
  for (let i = 1; i <= monthsAhead; i++) {
    const d = new Date(ANNIVERSARY);
    d.setMonth(d.getMonth() + i);
    list.push(d);
  }
  return list;
}

export function nextAnniversary(now: Date = new Date()): Date {
  const list = monthAnniversaries(60);
  // End-of-day cutoff so the current "day 15" still counts as today's anniversary
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return list.find((d) => d.getTime() >= startOfToday) ?? list[list.length - 1];
}

export function isAnniversaryToday(now: Date = new Date()): boolean {
  return now.getDate() === ANNIVERSARY.getDate();
}
