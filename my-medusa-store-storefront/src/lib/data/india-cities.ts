import citiesRaw from "./india-cities.json"

type CityRow = { id: string; name: string; state: string }

let cachedSorted: string[] | null = null

/**
 * Unique city names from Indian-Cities-JSON (major towns & cities across states/UTs), sorted A–Z.
 * Union with inventory-derived names in `getCarFilterOptions` so odd spellings still appear.
 */
export function getIndiaCityNamesSorted(): string[] {
  if (cachedSorted) return cachedSorted
  const arr = citiesRaw as CityRow[]
  const names = arr.map((c) => String(c.name ?? "").trim()).filter(Boolean)
  cachedSorted = Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, "en"))
  return cachedSorted
}
