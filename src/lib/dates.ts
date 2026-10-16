// All learning-day logic uses Asia/Jerusalem calendar dates (YYYY-MM-DD strings).

const fmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Jerusalem',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function jerusalemDate(at: Date = new Date()): string {
  return fmt.format(at); // en-CA formats as YYYY-MM-DD
}

function toUtcDays(d: string): number {
  const [y, m, day] = d.split('-').map(Number);
  return Date.UTC(y, m - 1, day) / 86400000;
}

/** Whole calendar days from a to b (b - a). */
export function daysBetween(a: string, b: string): number {
  return Math.round(toUtcDays(b) - toUtcDays(a));
}

export function addDays(d: string, n: number): string {
  const ms = (toUtcDays(d) + n) * 86400000;
  return new Date(ms).toISOString().slice(0, 10);
}

export function isValidDate(d: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(toUtcDays(d)) && addDays(d, 0) === d;
}
