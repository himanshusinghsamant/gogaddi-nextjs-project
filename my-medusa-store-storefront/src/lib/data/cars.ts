"use server"

import { getCacheOptions, getAuthHeaders } from "./cookies"
import { listProducts } from "./products"
import { HttpTypes } from "@medusajs/types"

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type CarFeature = { feature_name: string; feature_value: string }

export type CarSpecification = { spec_group: string; spec_name: string; spec_value: string }

export type CarReview = {
  id: string
  reviewer_name: string
  rating: number
  review_text: string | null
  created_at: string
}

export type CarVersion = {
  id: string
  title: string
  sku: string | null
  fuel_type: string | null
  transmission: string | null
  prices: unknown
  inventory_quantity: number | null
  manage_inventory: boolean
}

export type RelatedCar = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
}

export type CarListItem = {
  id: string
  handle: string
  thumbnail: string | null
  images: string[]
  name: string
  subtitle: string | null
  brand: string | null
  model: string | null
  category_handles: string[]
  fuel_type: string | null
  transmission: string | null
  year: string | null
  km_driven: string | null
  color: string | null
  engine: string | null
  mileage: string | null
  owner: string | null
  city: string | null
  car_type: string | null
  customer_id: string | null
  availability: boolean
  price: number | null
  description: string | null
  features: CarFeature[]
  specifications: CarSpecification[]
  reviews: CarReview[]
  versions: CarVersion[]
  related_cars: RelatedCar[]
}

export type CarDetail = CarListItem

export type CarFilterOptions = {
  brands: string[]
  fuelTypes: string[]
  transmissions: string[]
  cities: string[]
  years: string[]
  owners: string[]
  models: string[]
}

// ─── API FUNCTIONS ────────────────────────────────────────────────────────────

function flattenMetadataFeatures(meta: any): CarFeature[] {
  const raw = meta?.features
  if (!raw || typeof raw !== "object") return []
  const out: CarFeature[] = []
  for (const group of Object.values(raw) as any[]) {
    if (!Array.isArray(group)) continue
    for (const item of group) {
      if (item?.key) out.push({ feature_name: item.key, feature_value: String(item.value ?? "") })
    }
  }
  return out
}

function flattenMetadataSpecifications(meta: any): CarSpecification[] {
  const raw = meta?.specifications
  if (!raw || typeof raw !== "object") return []
  const out: CarSpecification[] = []
  for (const [group, items] of Object.entries(raw) as [string, any][]) {
    if (!Array.isArray(items)) continue
    for (const item of items) {
      if (item?.key) out.push({ spec_group: group, spec_name: item.key, spec_value: String(item.value ?? "") })
    }
  }
  return out
}

function getVariantOptionValue(variant: any, optionTitle: string): string | null {
  const opts = variant?.options ?? []
  for (const o of opts) {
    if (o?.option?.title === optionTitle && o?.value) return String(o.value)
  }
  return null
}

/** Get a spec value from metadata.specifications (e.g. Transmission.Transmission Type → "Manual") */
function getSpecValue(meta: any, group: string, key: string): string | null {
  const groupList = meta?.specifications?.[group]
  if (!Array.isArray(groupList)) return null
  const item = groupList.find((i: any) => i?.key === key)
  return item?.value != null ? String(item.value) : null
}

const USD_TO_INR = typeof process !== "undefined" && process.env?.USD_TO_INR
  ? Number(process.env.USD_TO_INR)
  : 84
const EUR_TO_INR = typeof process !== "undefined" && process.env?.EUR_TO_INR
  ? Number(process.env.EUR_TO_INR)
  : 90

/** Convert price to INR (in paise for formatCarPrice). Prefers INR; converts USD/EUR to INR. */
function pickPriceFromVariant(variant: any): number | null {
  const prices = variant?.prices ?? []
  if (!Array.isArray(prices) || prices.length === 0) return null
  const inrPrice = prices.find((p: any) => String(p?.currency_code).toLowerCase() === "inr")
  if (inrPrice != null && inrPrice.amount != null) {
    const amount = Number(inrPrice.amount)
    return Number.isFinite(amount) ? amount : null
  }
  const usdPrice = prices.find((p: any) => String(p?.currency_code).toLowerCase() === "usd")
  const eurPrice = prices.find((p: any) => String(p?.currency_code).toLowerCase() === "eur")
  const price = usdPrice ?? eurPrice ?? prices[0]
  if (!price || price.amount == null) return null
  const amount = Number(price.amount)
  if (!Number.isFinite(amount)) return null
  const currency = String(price.currency_code || "").toLowerCase()
  // Amount in major unit (e.g. dollars); convert to INR and return in paise (×100) for formatCarPrice
  if (currency === "usd") return Math.round(amount * USD_TO_INR * 100)
  if (currency === "eur") {
    return Math.round(amount * EUR_TO_INR * 100)
  }
  return amount
}

/** Derive brand from product title when categories/collection are missing (e.g. "Maruti Suzuki Swift" → "Maruti Suzuki") */
function deriveBrandFromTitle(title: string | null | undefined): string | null {
  if (!title || typeof title !== "string") return null
  const parts = title.trim().split(/\s+/)
  if (parts.length >= 2) return `${parts[0]} ${parts[1]}`
  if (parts.length === 1) return parts[0] || null
  return null
}

/** Get transmission from first variant that has it, or from specs */
function getTransmission(p: HttpTypes.StoreProduct, meta: any, firstVariant: any): string | null {
  const fromMeta = (meta.transmission as string) || null
  if (fromMeta) return fromMeta
  const fromVariant = getVariantOptionValue(firstVariant, "Transmission")
  if (fromVariant) return fromVariant
  const fromSpecs = getSpecValue(meta, "Transmission", "Transmission Type")
  if (fromSpecs) return fromSpecs
  const variants = (p.variants ?? []) as any[]
  for (const v of variants) {
    const t = getVariantOptionValue(v, "Transmission") || (v.transmission as string)
    if (t) return t
  }
  return null
}

function mapProductToCar(p: HttpTypes.StoreProduct): CarListItem {
  const firstVariant: any = p.variants?.[0]
  const meta: any = p.metadata ?? {}

  const brand =
    (p.collection as any)?.title ??
    (p.collection as any)?.name ??
    (p.categories as any[])?.[0]?.name ??
    deriveBrandFromTitle(p.title) ??
    null

  const fuel_type = (meta.fuel_type as string) ?? getVariantOptionValue(firstVariant, "Fuel Type")
  const transmission = getTransmission(p, meta, firstVariant)

  const images = (p.images ?? []).map((img: any) => img?.url).filter(Boolean)

  let price = pickPriceFromVariant(firstVariant)
  if (price == null && Array.isArray(p.variants)) {
    for (const v of p.variants as any[]) {
      price = pickPriceFromVariant(v)
      if (price != null) break
    }
  }

  const category_handles = ((p.categories as any[]) ?? [])
    .map((c: any) => c?.handle)
    .filter(Boolean) as string[]

  return {
    id: p.id!,
    handle: p.handle!,
    thumbnail: p.thumbnail ?? null,
    images,
    name: p.title ?? "",
    subtitle: (p as any).subtitle ?? null,
    brand,
    model: (meta.model as string) ?? (p as any).subtitle ?? p.handle ?? null,
    category_handles,
    fuel_type: fuel_type ?? null,
    transmission,
    year: (meta.year as string) ?? null,
    km_driven: (meta.km_driven as string) ?? null,
    color: (meta.color as string) ?? null,
    engine: (meta.engine as string) ?? null,
    mileage: (meta.mileage as string) ?? null,
    owner: (meta.owner as string) ?? null,
    city: (meta.city as string) ?? null,
    car_type: (meta.car_type as string) ?? null,
    customer_id: (meta.customer_id as string) ?? null,
    availability: (() => {
      const qty = firstVariant?.inventory_quantity
      const managed = firstVariant?.manage_inventory
      // If inventory is not tracked, treat as available
      if (!managed || qty === null || qty === undefined) return true
      return qty > 0
    })(),
    price: price ?? null,
    description: p.description ?? null,
    features: flattenMetadataFeatures(meta),
    specifications: flattenMetadataSpecifications(meta),
    // These are stored in a custom module in your backend; core products don't include them by default.
    reviews: [],
    versions: (p.variants ?? []).map((v: any) => ({
      id: v.id,
      title: v.title ?? "Variant",
      sku: v.sku ?? null,
      fuel_type: getVariantOptionValue(v, "Fuel Type"),
      transmission: getVariantOptionValue(v, "Transmission"),
      prices: v.prices,
      inventory_quantity: typeof v.inventory_quantity === "number" ? v.inventory_quantity : null,
      manage_inventory: Boolean(v.manage_inventory),
    })),
    related_cars: [],
  }
}

export async function listCars(
  countryCode: string
): Promise<{ cars: CarListItem[]; error?: string }> {
  try {
    const next = { ...(await getCacheOptions("cars")), revalidate: 60 }
    const {
      response: { products },
    } = await listProducts({
      countryCode,
      queryParams: {
        limit: 200,
        fields:
          "+images,+categories,+collection,*variants.prices,*variants.options,+variants.options.option,+metadata,+variants.inventory_quantity,+variants.manage_inventory",
      } as any,
    })

    const cars = (products ?? [])
      .filter((p) => !!p?.id && !!p?.handle)
      .map(mapProductToCar)

    return { cars }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error"
    return { cars: [], error: `Could not fetch cars from products: ${message}.` }
  }
}

/** Fetch reviews for a car (product) from the store API. */
async function fetchCarReviews(productId: string): Promise<CarReview[]> {
  const baseUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  const headers: Record<string, string> = {}
  if (publishableKey) headers["x-publishable-api-key"] = publishableKey
  try {
    const res = await fetch(`${baseUrl}/store/cars/${productId}/reviews`, {
      method: "GET",
      headers,
      next: { revalidate: 30 },
    })
    if (!res.ok) return []
    const data = (await res.json()) as { reviews?: CarReview[] }
    const list = data?.reviews ?? []
    return Array.isArray(list)
      ? list.map((r) => ({
          id: r.id,
          reviewer_name: r.reviewer_name ?? "Guest",
          rating: Number(r.rating) || 0,
          review_text: r.review_text ?? null,
          created_at: r.created_at ?? new Date().toISOString(),
        }))
      : []
  } catch {
    return []
  }
}

export async function getCarByHandle(
  countryCode: string,
  handle: string
): Promise<{ car: CarDetail | null; error?: string }> {
  try {
    const next = { ...(await getCacheOptions(`car-${handle}`)), revalidate: 60 }
    const {
      response: { products },
    } = await listProducts({
      countryCode,
      queryParams: {
        limit: 1,
        handle,
        fields:
          "+images,+categories,+collection,*variants.prices,*variants.options,+variants.options.option,+metadata,+variants.inventory_quantity,+variants.manage_inventory",
      } as any,
    })

    const p = (products ?? [])[0]
    if (!p) return { car: null }

    const car = mapProductToCar(p)
    const reviews = await fetchCarReviews(car.id)
    car.reviews = reviews
    return { car }
  } catch (err) {
    return { car: null, error: err instanceof Error ? err.message : "Network error" }
  }
}

export async function getCarFilterOptions(cars: CarListItem[]): Promise<CarFilterOptions> {
  const brands = Array.from(new Set((cars.map((c) => c.brand).filter(Boolean) as string[]))).sort()
  const fuelTypes = Array.from(new Set((cars.map((c) => c.fuel_type).filter(Boolean) as string[]))).sort()
  const transmissions = Array.from(new Set((cars.map((c) => c.transmission).filter(Boolean) as string[]))).sort()
  const cities = Array.from(new Set((cars.map((c) => c.city).filter(Boolean) as string[]))).sort()
  const years = Array.from(new Set((cars.map((c) => c.year).filter(Boolean) as string[]))).sort((a, b) => Number(b) - Number(a))
  const owners = Array.from(new Set((cars.map((c) => c.owner).filter(Boolean) as string[]))).sort()
  const models = Array.from(new Set((cars.map((c) => c.model).filter(Boolean) as string[]))).sort()
  return { brands, fuelTypes, transmissions, cities, years, owners, models }
}

export type SubmitReviewInput = {
  reviewer_name?: string
  rating: number
  review_text?: string
}

export async function submitCarReview(
  productId: string,
  input: SubmitReviewInput
): Promise<{ success: boolean; error?: string }> {
  const baseUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (publishableKey) headers["x-publishable-api-key"] = publishableKey
  try {
    const res = await fetch(`${baseUrl}/store/cars/${productId}/reviews`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        reviewer_name: input.reviewer_name ?? "Guest",
        rating: Math.min(5, Math.max(1, Number(input.rating) || 1)),
        review_text: input.review_text ?? "",
      }),
    })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      return { success: false, error: (d as any)?.message || `Failed (${res.status})` }
    }
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Network error" }
  }
}

export type SellCarInput = {
  title: string
  brand: string
  model: string
  price: number
  car_type?: string
  fuel_type: string
  transmission: string
  year: string
  km_driven: string
  city: string
  description: string
  color?: string
  engine?: string
  mileage?: string
  owner?: string
  images?: string[]
  customer_id?: string
}

export async function createCarListing(
  input: SellCarInput
): Promise<{ success: boolean; submission_id?: string; error?: string }> {
  const baseUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  const authHeaders = await getAuthHeaders()
  const token = "authorization" in authHeaders ? authHeaders.authorization : null
  if (!token) {
    return { success: false, error: "You must be signed in to list a car." }
  }
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: token,
  }
  if (publishableKey) headers["x-publishable-api-key"] = publishableKey
  try {
    const res = await fetch(`${baseUrl}/store/cars/create`, {
      method: "POST",
      headers,
      body: JSON.stringify(input),
    })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      return { success: false, error: (d as any)?.message || `Failed (${res.status})` }
    }
    const data = await res.json()
    return { success: true, submission_id: data.submission_id }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Network error" }
  }
}

export type SellerCarSubmission = {
  id: string
  title: string
  brand: string
  car_model: string
  year: string
  fuel_type: string
  transmission: string
  city: string
  expected_price: number
  status: "pending" | "approved" | "rejected" | "sold"
  product_id: string | null
  rejection_reason: string | null
  images: string[]
  created_at: string
}

export async function listMyCarSubmissions(): Promise<{
  submissions: SellerCarSubmission[]
  error?: string
}> {
  const baseUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  const authHeaders = await getAuthHeaders()
  const token = "authorization" in authHeaders ? authHeaders.authorization : null
  if (!token) {
    return { submissions: [], error: "Please sign in to view your listings." }
  }
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  const headers: Record<string, string> = {
    Authorization: token,
  }
  if (publishableKey) headers["x-publishable-api-key"] = publishableKey
  try {
    const res = await fetch(`${baseUrl}/store/seller-cars`, {
      method: "GET",
      headers,
      cache: "no-store",
    })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      return { submissions: [], error: (d as any)?.message || `Failed (${res.status})` }
    }
    const data = await res.json()
    return { submissions: data.submissions ?? [] }
  } catch (err) {
    return {
      submissions: [],
      error: err instanceof Error ? err.message : "Network error",
    }
  }
}
