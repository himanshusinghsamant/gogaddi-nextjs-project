/**
 * True when a listing/detail field should be shown (hide empty, N/A, dashes).
 */
export function hasCarDisplayValue(value: string | null | undefined): boolean {
  if (value == null) return false
  const t = String(value).trim()
  if (t === "") return false
  if (/^n\/?a$/i.test(t)) return false
  if (t === "—" || t === "-" || t === "–") return false
  return true
}
