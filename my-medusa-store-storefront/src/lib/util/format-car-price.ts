const USD_TO_INR = typeof process !== "undefined" && process.env?.USD_TO_INR ? Number(process.env.USD_TO_INR) : 84
const EUR_TO_INR = typeof process !== "undefined" && process.env?.EUR_TO_INR ? Number(process.env.EUR_TO_INR) : 90

/**
 * Get price amount in paise (for INR) from variant/version prices array. Use with formatCarPrice.
 */
export function getVersionPrice(prices: unknown): number | null {
  const list = Array.isArray(prices) ? prices : []
  if (list.length === 0) return null
  const inr = list.find((p: any) => String(p?.currency_code).toLowerCase() === "inr")
  if (inr != null && inr.amount != null) {
    const amount = Number(inr.amount)
    return Number.isFinite(amount) ? amount : null
  }
  const usd = list.find((p: any) => String(p?.currency_code).toLowerCase() === "usd")
  const eur = list.find((p: any) => String(p?.currency_code).toLowerCase() === "eur")
  const price = usd ?? eur ?? list[0]
  if (!price || price.amount == null) return null
  const amount = Number(price.amount)
  if (!Number.isFinite(amount)) return null
  const currency = String(price.currency_code || "").toLowerCase()
  if (currency === "usd") return Math.round(amount * USD_TO_INR * 100)
  if (currency === "eur") return Math.round(amount * EUR_TO_INR * 100)
  return amount
}

/** Minimal shape for resolving listing price (avoids importing server `cars` module from clients). */
export type CarPriceLike = {
  price: number | null
  metadata?: { price?: unknown }
  /** Medusa product.options (Fuel Type, Ex Showroom Price, …) — used when metadata/variant price missing */
  product_options?: Array<{ title: string; values: string[] }>
}

/** Minimum ex-showroom whole rupees from Medusa product option "Ex Showroom Price (INR)" value list. */
export function getMinExShowroomRupeesFromProductOptions(
  productOptions: Array<{ title: string; values: string[] }> | undefined
): number | null {
  if (!Array.isArray(productOptions) || productOptions.length === 0) return null
  const ex = productOptions.find((o) => /ex showroom price.*inr/i.test(String(o.title).trim()))
  if (!ex?.values?.length) return null
  const nums = ex.values
    .map((v) => Number(String(v).replace(/,/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0)
  if (!nums.length) return null
  return Math.min(...nums)
}

/**
 * Whole-rupee INR for filters/sorting — aligned with how listings are priced in data:
 * - Prefer `metadata.price` (major units, e.g. seed/admin "550000" = ₹5.5L).
 * - Else `price` from Medusa mapping (stored as paise when ≥ typical rupee scale) using same rule as `formatCarPrice`.
 * - Else minimum **Ex Showroom Price (INR)** from `product_options` when present.
 */
export function getCarListPriceInRupees(car: CarPriceLike): number | null {
  const meta = car.metadata ?? {}
  const metaNum = meta?.price != null && meta?.price !== "" ? Number(meta.price) : NaN
  if (Number.isFinite(metaNum) && metaNum > 0) {
    return metaNum
  }
  const p = car.price
  if (p != null && Number.isFinite(Number(p))) {
    const n = Number(p)
    return n >= 10000 ? n / 100 : n
  }
  const fromOpts = getMinExShowroomRupeesFromProductOptions(car.product_options)
  if (fromOpts != null) return fromOpts
  return null
}

const LAC = 100_000
const CR = 10_000_000

/**
 * Parse min/max price filter input into whole rupees (same basis as `getCarListPriceInRupees`).
 *
 * Supported:
 * - **Crore:** `1.2 cr`, `1.2cr`, `2 crore`
 * - **Lac / lakh:** `5.5 l`, `6 lac`, `8L`, `5.5lakhs`
 * - **Full rupees:** `550000`, `8,50,000` (commas stripped)
 * - **Plain number:** `≥ 100000` → rupees; **decimal** (e.g. `5.5`) → lakhs; **integer 1–999** → lakhs (e.g. `8` = ₹8 L)
 * - **Integer 1000–99999** → rupees (e.g. `85000`)
 */
export function parsePriceFilterInputToRupees(raw: string | undefined): number | null {
  if (raw == null) return null
  const trimmed = String(raw).trim().replace(/,/g, "")
  if (!trimmed) return null

  const lower = trimmed.toLowerCase().replace(/\s+/g, " ").trim()
  const compact = lower.replace(/\s/g, "")

  let m =
    lower.match(/^([\d.]+)\s*(crores|crore|cr)$/) || compact.match(/^([\d.]+)(crores|crore|cr)$/)
  if (m) {
    const n = Number(m[1])
    if (!Number.isFinite(n) || n < 0) return null
    return Math.round(n * CR)
  }

  m =
    lower.match(/^([\d.]+)\s*(lac|lacs|lakh|lakhs|l)$/) || compact.match(/^([\d.]+)(lac|lacs|lakh|lakhs|l)$/)
  if (m) {
    const n = Number(m[1])
    if (!Number.isFinite(n) || n < 0) return null
    return Math.round(n * LAC)
  }

  if (!/^[\d.]+$/.test(compact)) return null
  const n = Number(compact)
  if (!Number.isFinite(n) || n < 0) return null

  if (n >= 100_000) return Math.round(n)

  if (compact.includes(".")) return Math.round(n * LAC)

  if (Number.isInteger(n) && n > 0 && n < 1000) return Math.round(n * LAC)

  return Math.round(n)
}

/**
 * Parse optional min/max, then enforce **min ≤ max** (swap if needed). Used for filters and URL params.
 */
export function normalizePriceRangeBounds(
  rawMin: string | undefined,
  rawMax: string | undefined
): { minRupees: number | null; maxRupees: number | null } {
  const minN = rawMin?.trim() ? parsePriceFilterInputToRupees(rawMin) : null
  const maxN = rawMax?.trim() ? parsePriceFilterInputToRupees(rawMax) : null
  let lo = minN
  let hi = maxN
  if (lo != null && hi != null && lo > hi) {
    ;[lo, hi] = [hi, lo]
  }
  return { minRupees: lo, maxRupees: hi }
}

/** Same as `normalizePriceRangeBounds` but returns strings for `priceMin` / `priceMax` query keys (whole rupees). */
export function normalizePriceRangeForQuery(
  rawMin: string | undefined,
  rawMax: string | undefined
): { priceMin: string | null; priceMax: string | null } {
  const { minRupees, maxRupees } = normalizePriceRangeBounds(rawMin, rawMax)
  return {
    priceMin: minRupees != null ? String(minRupees) : null,
    priceMax: maxRupees != null ? String(maxRupees) : null,
  }
}

/**
 * Format car price for display (INR). Safe to use in client or server.
 * Amount may be in paise/smallest unit (e.g. from Medusa) — we normalize for display.
 */
export function formatCarPrice(amount: number | null): string {
  if (amount == null) return "Price on request"
  const value = amount >= 10000 ? amount / 100 : amount
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * One product option row for UI — numeric ex-showroom values are formatted as ₹ like listings.
 */
export function formatCatalogOptionValuesDisplay(title: string, values: string[]): string {
  if (!values.length) return "—"
  if (/ex showroom price.*inr/i.test(title.trim())) {
    return values
      .map((v) => {
        const n = Number(String(v).replace(/,/g, ""))
        if (!Number.isFinite(n)) return v
        return formatCarPrice(Math.round(n * 100))
      })
      .join(" · ")
  }
  return values.join(" · ")
}

/** `metadata.price` is set (asking / listing price in INR major units). */
export function hasMetadataListingPrice(car: { metadata?: { price?: unknown } }): boolean {
  const metaNum =
    car.metadata?.price != null && car.metadata?.price !== ""
      ? Number(car.metadata.price)
      : NaN
  return Number.isFinite(metaNum) && metaNum > 0
}

/**
 * "Ex Showroom Price (INR)" option row: when the listing has `metadata.price`, show the same figure as
 * the card/detail headline (`car.price`). Otherwise show catalog option values (trim prices).
 */
export function formatExShowroomOptionRowDisplay(
  car: { price: number | null; metadata?: { price?: unknown } },
  optionTitle: string,
  optionValues: string[]
): string {
  if (!/ex showroom price.*inr/i.test(String(optionTitle).trim())) {
    return formatCatalogOptionValuesDisplay(optionTitle, optionValues)
  }
  if (hasMetadataListingPrice(car) && car.price != null) {
    return formatCarPrice(car.price)
  }
  return formatCatalogOptionValuesDisplay(optionTitle, optionValues)
}
