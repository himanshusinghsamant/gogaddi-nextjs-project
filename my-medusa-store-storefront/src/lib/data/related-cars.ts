import type { CarListItem } from "./cars"

function normalizeBrandForRelated(brand: string | null | undefined): string {
  return (brand ?? "").trim().toLowerCase()
}

/**
 * Picks related listings for a car detail page: prefer other brands and maximize brand diversity.
 * Falls back to same-brand (or any) inventory when the catalog is small.
 */
export function selectCrossBrandRelatedCars(
  current: CarListItem,
  inventory: CarListItem[],
  limit = 8
): CarListItem[] {
  const currentBrand = normalizeBrandForRelated(current.brand)
  const others = inventory.filter((c) => c.id !== current.id)
  if (others.length === 0) return []

  const fromOtherBrands = others.filter((c) => normalizeBrandForRelated(c.brand) !== currentBrand)
  const fromSameBrand = others.filter((c) => normalizeBrandForRelated(c.brand) === currentBrand)

  const picked: CarListItem[] = []
  const seenId = new Set<string>()
  const add = (car: CarListItem) => {
    if (seenId.has(car.id)) return
    seenId.add(car.id)
    picked.push(car)
  }

  const seenBrand = new Set<string>()
  for (const car of fromOtherBrands) {
    if (picked.length >= limit) break
    const b = normalizeBrandForRelated(car.brand)
    const key = b || `_n_${car.id}`
    if (seenBrand.has(key)) continue
    seenBrand.add(key)
    add(car)
  }

  if (picked.length < limit) {
    for (const car of fromOtherBrands) {
      if (picked.length >= limit) break
      add(car)
    }
  }

  if (picked.length < limit) {
    for (const car of fromSameBrand) {
      if (picked.length >= limit) break
      add(car)
    }
  }

  return picked.slice(0, limit)
}
