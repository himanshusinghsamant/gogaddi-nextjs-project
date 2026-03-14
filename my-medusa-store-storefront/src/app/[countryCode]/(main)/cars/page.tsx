import { listCars, getCarFilterOptions } from "@lib/data/cars"
import type { CarListItem } from "@lib/data/cars"
import { getRootCategoriesForSitemap } from "@lib/data/categories"
import { Metadata } from "next"
import { Suspense } from "react"
import CarCard from "@modules/cars/components/car-card"
import CarFilters from "@modules/cars/components/car-filters"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "All Cars | GoGaddi",
  description: "Browse and filter thousands of cars. Find the best deal.",
}

const PAGE_SIZE = 12

/** Normalize to slug for consistent category filter comparison (value, not label). */
function toCategorySlug(s: string): string {
  return (s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

function getCarPriceNormalized(car: CarListItem): number {
  const p = car.price ?? 0
  return p >= 10000 ? p / 100 : p
}

function filterAndSort(
  cars: CarListItem[],
  params: {
    category?: string
    carType?: string
    maxPrice?: string
    brand?: string
    fuelType?: string
    transmission?: string
    city?: string
    year?: string
    owner?: string
    model?: string
    query?: string
    priceMin?: string
    priceMax?: string
    sortBy?: string
  }
): CarListItem[] {
  let result = [...cars]
  if (params.carType) {
    const type = params.carType.trim().toLowerCase()
    result = result.filter((c) => (c.car_type ?? "").toLowerCase() === type)
  }
  // Category filter: match by product's category_handles (Medusa categories). If no match, also match by
  // model/handle so that when a category option has the same value as a model (e.g. "maruti-suzuki-a-star"),
  // cars still show even if the product isn't linked to that category in the backend.
  if (params.category) {
    const categoryValue = params.category.trim()
    const categorySlug = toCategorySlug(categoryValue)
    result = result.filter((c) => {
      const handles = (c.category_handles ?? []) as string[]
      const inCategory = handles.some(
        (h) => (h && (h === categoryValue || toCategorySlug(h) === categorySlug))
      )
      if (inCategory) return true
      const modelSlug = c.model ? toCategorySlug(c.model) : ""
      const handleMatch = c.handle && (c.handle === categoryValue || toCategorySlug(c.handle) === categorySlug)
      const modelMatch = modelSlug && modelSlug === categorySlug
      return handleMatch || modelMatch
    })
  }
  if (params.brand) result = result.filter((c) => c.brand === params.brand)
  if (params.fuelType) result = result.filter((c) => c.fuel_type === params.fuelType)
  if (params.transmission) result = result.filter((c) => c.transmission === params.transmission)
  if (params.city) result = result.filter((c) => c.city === params.city)
  if (params.year) result = result.filter((c) => c.year === params.year)
  if (params.owner) result = result.filter((c) => c.owner === params.owner)
  if (params.model) result = result.filter((c) => c.model === params.model)
  if (params.query && params.query.trim()) {
    const q = params.query.trim().toLowerCase()
    result = result.filter(
      (c) =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.model && c.model.toLowerCase().includes(q)) ||
        (c.handle && c.handle.toLowerCase().includes(q)) ||
        (c.brand && c.brand.toLowerCase().includes(q))
    )
  }
  if (params.priceMin) {
    const min = Number(params.priceMin)
    result = result.filter((c) => getCarPriceNormalized(c) >= min)
  }
  if (params.priceMax) {
    const max = Number(params.priceMax)
    result = result.filter((c) => getCarPriceNormalized(c) <= max)
  }
  if (params.maxPrice) {
    if (params.maxPrice === "20_plus") {
      result = result.filter((c) => getCarPriceNormalized(c) >= 2000000)
    } else {
      const maxVal = Number(params.maxPrice)
      if (Number.isFinite(maxVal)) result = result.filter((c) => getCarPriceNormalized(c) <= maxVal)
    }
  }
  switch (params.sortBy) {
    case "price_asc":
      result.sort((a, b) => getCarPriceNormalized(a) - getCarPriceNormalized(b))
      break
    case "price_desc":
      result.sort((a, b) => getCarPriceNormalized(b) - getCarPriceNormalized(a))
      break
    case "newest":
      result.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0))
      break
    default:
      break
  }
  return result
}

type SearchParams = Promise<{
  category?: string
  carType?: string
  maxPrice?: string
  brand?: string
  fuelType?: string
  transmission?: string
  city?: string
  year?: string
  owner?: string
  model?: string
  query?: string
  priceMin?: string
  priceMax?: string
  sortBy?: string
  page?: string
}>

const MAX_PRICE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "--Max Price--" },
  { value: "300000", label: "--Max 3 Lacs--" },
  { value: "600000", label: "--Max 6 Lacs--" },
  { value: "1000000", label: "--Max 10 Lacs--" },
  { value: "2000000", label: "--Max 20 Lacs--" },
  { value: "20_plus", label: "--More 20 Lacs--" },
]

const FILTER_LABELS: Record<string, string> = {
  category: "Category",
  carType: "Type",
  maxPrice: "Max Price",
  brand: "Brand",
  fuelType: "Fuel",
  transmission: "Transmission",
  city: "City",
  year: "Year",
  owner: "Owner",
  model: "Model",
  query: "Search",
  priceMin: "Min price",
  priceMax: "Max price",
  sortBy: "Sort",
}

export default async function CarsListingPage(props: {
  params: Promise<{ countryCode: string }>
  searchParams: SearchParams
}) {
  const sp = await props.searchParams
  const { countryCode } = await props.params

  const { cars, error } = await listCars(countryCode)
  const [filterOptions, rootCategories] = await Promise.all([
    getCarFilterOptions(cars),
    getRootCategoriesForSitemap(),
  ])

  // value = slug for URL/filter; label = display only e.g. { value: "maruti-suzuki-alto-800", label: "--Maruti Suzuki Alto 800--" }
  const categoryOptions = (() => {
    const flat: { value: string; label: string }[] = [{ value: "", label: "--All Categories--" }]
    for (const root of rootCategories) {
      const name = (root as any).name
      const handle = (root as any).handle
      const value = handle && /^[a-z0-9-]+$/i.test(handle) ? handle : (name ? toCategorySlug(name) : handle || "")
      if (value && name) flat.push({ value, label: `--${name}--` })
      const children = (root as any).category_children ?? []
      for (const child of children) {
        const childName = child?.name
        const childHandle = child?.handle
        const childValue = childHandle && /^[a-z0-9-]+$/i.test(childHandle) ? childHandle : (childName ? toCategorySlug(childName) : childHandle || "")
        if (childValue && childName) flat.push({ value: childValue, label: `--${childName}--` })
      }
    }
    return flat
  })()

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="content-container py-12">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-amber-800 max-w-md mx-auto text-center">
            <p className="font-bold text-lg">Unable to load cars</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const filtered = filterAndSort(cars, sp)
  const page = Math.max(1, Number(sp.page) || 1)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeFilters = {
    category: sp.category,
    carType: sp.carType,
    maxPrice: sp.maxPrice,
    brand: sp.brand,
    fuelType: sp.fuelType,
    transmission: sp.transmission,
    city: sp.city,
    year: sp.year,
    owner: sp.owner,
    model: sp.model,
    query: sp.query,
    priceMin: sp.priceMin,
    priceMax: sp.priceMax,
    sortBy: sp.sortBy,
  }

  const maxPriceOptionsForSidebar: { value: string; label: string }[] = [
    { value: "", label: "Any budget" },
    { value: "300000", label: "Max 3 Lacs" },
    { value: "600000", label: "Max 6 Lacs" },
    { value: "1000000", label: "Max 10 Lacs" },
    { value: "2000000", label: "Max 20 Lacs" },
    { value: "20_plus", label: "20+ Lacs" },
  ]

  const hasFilters = Object.values(activeFilters).some(Boolean)
  const filterEntries = Object.entries(activeFilters).filter(([, v]) => v)

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <section className="bg-white border-b border-slate-200">
        <div className="content-container py-8 md:py-10">
          <nav className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">
            <LocalizedClientLink href="/" className="hover:text-blue-600 transition-colors">
              Home
            </LocalizedClientLink>
            <span className="mx-2">/</span>
            <span className="text-slate-900">Cars</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
            {sp.brand ? `${sp.brand} Cars` : "All Cars"}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {filtered.length} {filtered.length === 1 ? "car" : "cars"} found
            {sp.brand && ` for "${sp.brand}"`}
            {sp.city && ` in ${sp.city}`}
          </p>
        </div>
      </section>

      <div className="content-container py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Side filter bar: category, price, and all filters */}
          <Suspense fallback={<div className="lg:w-72 shrink-0 h-64 bg-slate-100 rounded-2xl animate-pulse" />}>
            <CarFilters
              options={filterOptions}
              active={activeFilters}
              categoryOptions={categoryOptions}
              maxPriceOptions={maxPriceOptionsForSidebar}
            />
          </Suspense>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Active filter chips */}
            {hasFilters && filterEntries.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active:</span>
                {filterEntries.map(([key, val]) => {
                  let displayVal = val
                  if (key === "category") displayVal = categoryOptions.find((o) => o.value === val)?.label ?? val
                  else if (key === "maxPrice") displayVal = MAX_PRICE_OPTIONS.find((o) => o.value === val)?.label ?? val
                  return (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-blue-100"
                    >
                      {FILTER_LABELS[key] ?? key}: {displayVal}
                    </span>
                  )
                })}
                <LocalizedClientLink
                  href="/cars"
                  className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors ml-1"
                >
                  Clear all
                </LocalizedClientLink>
              </div>
            )}

            {paginated.length === 0 ? (
              <div className="text-center py-20 px-4">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6 text-4xl">
                  🚗
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">No cars found</h3>
                <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">
                  Try adjusting your filters or clear them to see more listings.
                </p>
                <LocalizedClientLink
                  href="/cars"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-2xl transition-colors"
                >
                  Clear filters
                </LocalizedClientLink>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                  {paginated.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav className="flex justify-center gap-2 mt-12" aria-label="Pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                      const params = new URLSearchParams()
                      Object.entries(activeFilters).forEach(([k, v]) => v && params.set(k, v))
                      params.set("page", String(p))
                      const isCurrent = p === page
                      return (
                        <LocalizedClientLink
                          key={p}
                          href={`/cars?${params.toString()}`}
                          className={`
                            min-w-[44px] h-11 flex items-center justify-center rounded-xl text-sm font-bold border transition-all
                            ${isCurrent
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50"}
                          `}
                          aria-current={isCurrent ? "page" : undefined}
                        >
                          {p}
                        </LocalizedClientLink>
                      )
                    })}
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
