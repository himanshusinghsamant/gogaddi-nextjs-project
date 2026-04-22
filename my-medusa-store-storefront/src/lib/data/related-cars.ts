import type { CarListItem } from "./cars"
import { getCarListPriceInRupees } from "@lib/util/format-car-price"

function normalizeBrandForRelated(brand: string | null | undefined): string {
  return (brand ?? "").trim().toLowerCase()
}

function normalizeKey(v: string | null | undefined): string {
  return (v ?? "").trim().toLowerCase()
}

function withinPct(a: number, b: number, pct: number): boolean {
  if (!Number.isFinite(a) || !Number.isFinite(b) || a <= 0 || b <= 0) return false
  const diff = Math.abs(a - b)
  const base = Math.max(a, b)
  return diff / base <= pct
}

export type RelatedCarPick = {
  car: CarListItem
  reason: string
  score: number
}

/**
 * Picks related listings for a car detail page using:
 * - relevance scoring (model/brand/body type/price band/city/specs)
 * - diversity (avoid repeating the same model)
 * - availability preference (available cars first)
 */
export function selectRelatedCars(
  current: CarListItem,
  inventory: CarListItem[],
  limit = 8
): RelatedCarPick[] {
  const others = inventory.filter((c) => c.id !== current.id)
  if (others.length === 0) return []

  const currentBrand = normalizeBrandForRelated(current.brand)
  const currentModel = normalizeKey(current.model)
  const currentType = normalizeKey(current.car_type)
  const currentCity = normalizeKey(current.city)
  const currentFuel = normalizeKey(current.fuel_type)
  const currentTrans = normalizeKey(current.transmission)
  const currentYear = Number(current.year) || null
  const currentPrice = getCarListPriceInRupees(current)

  const scored: RelatedCarPick[] = others.map((car) => {
    const b = normalizeBrandForRelated(car.brand)
    const m = normalizeKey(car.model)
    const t = normalizeKey(car.car_type)
    const city = normalizeKey(car.city)
    const fuel = normalizeKey(car.fuel_type)
    const tr = normalizeKey(car.transmission)
    const year = Number(car.year) || null
    const price = getCarListPriceInRupees(car)

    let score = 0
    if (!car.availability) score -= 1000

    const sameModel = !!currentModel && !!m && m === currentModel
    const sameBrand = !!currentBrand && !!b && b === currentBrand
    const sameType = !!currentType && !!t && t === currentType
    const sameCity = !!currentCity && !!city && city === currentCity
    const sameFuel = !!currentFuel && !!fuel && fuel === currentFuel
    const sameTrans = !!currentTrans && !!tr && tr === currentTrans

    if (sameModel) score += 70
    if (sameBrand) score += 40
    if (sameType) score += 20
    if (sameCity) score += 15
    if (sameFuel) score += 10
    if (sameTrans) score += 10

    if (currentYear != null && year != null) {
      const dy = Math.abs(year - currentYear)
      if (dy === 0) score += 10
      else if (dy === 1) score += 6
      else if (dy === 2) score += 3
    }

    if (currentPrice != null && price != null) {
      if (withinPct(currentPrice, price, 0.1)) score += 30
      else if (withinPct(currentPrice, price, 0.2)) score += 20
      else if (withinPct(currentPrice, price, 0.3)) score += 10
    }

    const reason =
      sameModel
        ? "Same model"
        : sameBrand
          ? "Same brand"
          : currentPrice != null && price != null && withinPct(currentPrice, price, 0.2)
            ? "Similar price"
            : sameType
              ? "Same body type"
              : sameCity
                ? "Same city"
                : sameFuel
                  ? "Same fuel"
                  : "Recommended"

    return { car, reason, score }
  })

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.car.id.localeCompare(b.car.id, "en")
  })

  // Diversity pass: prefer unique models first.
  const picked: RelatedCarPick[] = []
  const usedIds = new Set<string>()
  const usedModels = new Set<string>()

  const modelKey = (c: CarListItem) =>
    normalizeKey(c.model) || normalizeKey(c.name) || normalizeKey(c.handle)

  for (const item of scored) {
    if (picked.length >= limit) break
    if (usedIds.has(item.car.id)) continue
    const mk = modelKey(item.car)
    if (mk && usedModels.has(mk)) continue
    usedIds.add(item.car.id)
    if (mk) usedModels.add(mk)
    picked.push(item)
  }

  for (const item of scored) {
    if (picked.length >= limit) break
    if (usedIds.has(item.car.id)) continue
    usedIds.add(item.car.id)
    picked.push(item)
  }

  return picked.slice(0, limit)
}

// Back-compat (if any older usage exists)
export function selectCrossBrandRelatedCars(current: CarListItem, inventory: CarListItem[], limit = 8): CarListItem[] {
  return selectRelatedCars(current, inventory, limit).map((p) => p.car)
}
