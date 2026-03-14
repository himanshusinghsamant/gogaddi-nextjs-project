"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { CarFilterOptions } from "@lib/data/cars"
import TextField from "@modules/common/components/text-field"
import SelectField from "@modules/common/components/select-field"
import Button from "@modules/common/components/button"
import BrandFilter from "@modules/cars/components/brand-filter"
import PriceFilter from "@modules/cars/components/price-filter"

export type CategoryOption = { value: string; label: string }

type ActiveFilters = {
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

type CarFiltersProps = {
  options: CarFilterOptions
  active: ActiveFilters
  categoryOptions?: CategoryOption[]
  maxPriceOptions?: CategoryOption[]
}

const SORT_OPTIONS = [
  { value: "", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
]

const COMPACT_INPUT = "car-filters-compact-input"

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-100 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
      <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-1.5">
        {title}
      </h4>
      {children}
    </div>
  )
}

export default function CarFilters({ options, active, categoryOptions = [], maxPriceOptions = [] }: CarFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const clearAll = () => {
    router.push(pathname)
  }

  const hasFilters = Object.values(active).some(Boolean)

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div
        className="bg-white rounded-2xl border border-slate-200/80 shadow-sm sticky top-20 flex flex-col max-h-[calc(100vh-6rem)] overflow-hidden"
        role="complementary"
        aria-label="Car filters"
      >
        <div className="flex items-center justify-between shrink-0 px-3 pt-3 pb-2 border-b border-slate-100">
          <h3 className="text-xs font-black uppercase tracking-[0.12em] text-slate-900">Filters</h3>
          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-700 py-1 px-2"
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-2 car-filters-viewport">
          <FilterSection title="Search">
            <TextField
              label=""
              placeholder="Name, model, brand..."
              value={active.query ?? ""}
              onChange={(e) => update("query", e.target.value)}
              containerClassName={`text-sm ${COMPACT_INPUT}`}
            />
          </FilterSection>

          {categoryOptions.length > 0 && (
            <FilterSection title="Category">
              <SelectField
                label=""
                options={categoryOptions}
                placeholder="All categories"
                value={active.category ?? ""}
                onChange={(e) => update("category", e.target.value)}
                containerClassName={COMPACT_INPUT}
              />
            </FilterSection>
          )}

          <FilterSection title="Car type">
            <SelectField
              label=""
              options={[
                { value: "", label: "All" },
                { value: "Used", label: "Old / Used" },
                { value: "New", label: "New" },
              ]}
              placeholder="All"
              value={active.carType ?? ""}
              onChange={(e) => update("carType", e.target.value)}
              containerClassName={COMPACT_INPUT}
            />
          </FilterSection>

          <FilterSection title="Sort by">
            <SelectField
              label=""
              options={SORT_OPTIONS}
              placeholder="Recommended"
              value={active.sortBy ?? ""}
              onChange={(e) => update("sortBy", e.target.value)}
              containerClassName={COMPACT_INPUT}
            />
          </FilterSection>

          {options.brands.length > 0 && (
            <FilterSection title="Brand">
              <BrandFilter
                options={options.brands}
                value={active.brand ?? ""}
                onChange={(v) => update("brand", v)}
                placeholder="All brands"
                label=""
              />
            </FilterSection>
          )}

          {options.fuelTypes.length > 0 && (
            <FilterSection title="Fuel type">
              <SelectField
                label=""
                options={options.fuelTypes}
                placeholder="All fuels"
                value={active.fuelType ?? ""}
                onChange={(e) => update("fuelType", e.target.value)}
                containerClassName={COMPACT_INPUT}
              />
            </FilterSection>
          )}

          {options.transmissions.length > 0 && (
            <FilterSection title="Transmission">
              <SelectField
                label=""
                options={options.transmissions}
                placeholder="All"
                value={active.transmission ?? ""}
                onChange={(e) => update("transmission", e.target.value)}
                containerClassName={COMPACT_INPUT}
              />
            </FilterSection>
          )}

          {options.cities.length > 0 && (
            <FilterSection title="City">
              <SelectField
                label=""
                options={options.cities}
                placeholder="All cities"
                value={active.city ?? ""}
                onChange={(e) => update("city", e.target.value)}
                containerClassName={COMPACT_INPUT}
              />
            </FilterSection>
          )}

          {options.years.length > 0 && (
            <FilterSection title="Year">
              <SelectField
                label=""
                options={options.years}
                placeholder="Any year"
                value={active.year ?? ""}
                onChange={(e) => update("year", e.target.value)}
                containerClassName={COMPACT_INPUT}
              />
            </FilterSection>
          )}

          {(options.owners?.length ?? 0) > 0 && (
            <FilterSection title="Owner">
              <SelectField
                label=""
                options={options.owners}
                placeholder="Any owner"
                value={active.owner ?? ""}
                onChange={(e) => update("owner", e.target.value)}
                containerClassName={COMPACT_INPUT}
              />
            </FilterSection>
          )}

          {(options.models?.length ?? 0) > 0 && (
            <FilterSection title="Model">
              <SelectField
                label=""
                options={options.models}
                placeholder="All models"
                value={active.model ?? ""}
                onChange={(e) => update("model", e.target.value)}
                containerClassName={COMPACT_INPUT}
              />
            </FilterSection>
          )}

          {maxPriceOptions.length > 0 && (
            <FilterSection title="Max price">
              <SelectField
                label=""
                options={maxPriceOptions}
                placeholder="Any budget"
                value={active.maxPrice ?? ""}
                onChange={(e) => update("maxPrice", e.target.value)}
                containerClassName={COMPACT_INPUT}
              />
            </FilterSection>
          )}

          <FilterSection title="Price range (₹)">
            <PriceFilter
              priceMin={active.priceMin ?? ""}
              priceMax={active.priceMax ?? ""}
              onMinChange={(v) => update("priceMin", v)}
              onMaxChange={(v) => update("priceMax", v)}
              label=""
            />
          </FilterSection>
        </div>
      </div>
    </aside>
  )
}
