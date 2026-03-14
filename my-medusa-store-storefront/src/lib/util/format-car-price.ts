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
