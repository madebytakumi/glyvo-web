type ClassValue = string | false | null | undefined;

/** Minimal classnames joiner. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
