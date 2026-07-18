/**
 * utils/date.ts
 * Robust date parsing/formatting for timestamps coming from the database.
 *
 * Root cause of "Invalid Date" across the dashboard: the app uses Neon's
 * `neon-http` driver (drizzle-orm/neon-http), which returns Postgres
 * `timestamp` columns as raw text — e.g. "2025-01-15 10:30:00.123456+00"
 * (space-separated, microsecond precision, short-form offset) — instead of
 * JS Date objects or proper ISO-8601 strings. `new Date(...)` parses that
 * format inconsistently across engines (fails outright in Safari/WebKit,
 * and in some Node versions), which is what produced "Invalid Date" in the
 * orders table, order detail modal, customers table, and success page.
 *
 * These helpers normalize the string into unambiguous ISO-8601 before
 * parsing so dates render consistently everywhere, and fall back to a
 * harmless "—" instead of "Invalid Date" if a value truly can't be parsed.
 */

export function safeDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

  let str = String(value).trim();
  if (!str) return null;

  // "2025-01-15 10:30:00.123456+00" -> "2025-01-15T10:30:00.123456+00"
  if (str.includes(" ") && !str.includes("T")) {
    str = str.replace(" ", "T");
  }

  // JS Date only supports millisecond precision — truncate any extra
  // fractional digits: "...:00.123456+00" -> "...:00.123+00"
  str = str.replace(/(\.\d{3})\d+/, "$1");

  // Normalize a short-form offset ("+00", "-05") to "+00:00" / "-05:00".
  // Skip if it already has a colon or the string is UTC "Z".
  if (/[+-]\d{2}$/.test(str)) {
    str = str.replace(/([+-]\d{2})$/, "$1:00");
  }

  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDate(
  value: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = safeDate(value);
  if (!d) return "—";
  return d.toLocaleDateString(undefined, options ?? { year: "numeric", month: "long", day: "numeric" });
}

export function formatDateShort(value: string | Date | null | undefined): string {
  const d = safeDate(value);
  if (!d) return "—";
  return d.toLocaleDateString();
}

export function formatTime(value: string | Date | null | undefined): string {
  const d = safeDate(value);
  if (!d) return "—";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
