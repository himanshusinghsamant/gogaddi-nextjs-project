"use client"

import { useCallback, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { CarFilterOptions } from "@lib/data/cars"
import TextField from "@modules/common/components/text-field"
import SelectField from "@modules/common/components/select-field"
import Button from "@modules/common/components/button"
import BrandFilter from "@modules/cars/components/brand-filter"
import PriceFilter from "@modules/cars/components/price-filter"
import { Filter, X } from "lucide-react"

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
    <aside className="w-full lg:w-72 shrink-0">
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-24 flex flex-col max-h-[calc(100vh-8rem)]"
        role="complementary"
        aria-label="Car filters"
      >
        <div className="flex items-center justify-between shrink-0 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Filters</h3>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-5 py-4 space-y-4">
          <TextField
            label="Search"
            placeholder="Search by name..."
            value={active.query ?? ""}
            onChange={(e) => update("query", e.target.value)}
            containerClassName={`text-sm ${COMPACT_INPUT}`}
          />

          {categoryOptions.length > 0 && (
            <SelectField
              label="Category"
              options={categoryOptions}
              placeholder="All categories"
              value={active.category ?? ""}
              onChange={(e) => update("category", e.target.value)}
              containerClassName={COMPACT_INPUT}
            />
          )}

          <SelectField
            label="Car type"
            options={[
              { value: "", label: "All Types" },
              { value: "Used", label: "Pre-Owned" },
              { value: "New", label: "Brand New" },
            ]}
            placeholder="All"
            value={active.carType ?? ""}
            onChange={(e) => update("carType", e.target.value)}
            containerClassName={COMPACT_INPUT}
          />

          <SelectField
            label="Sort by"
            options={SORT_OPTIONS}
            placeholder="Recommended"
            value={active.sortBy ?? ""}
            onChange={(e) => update("sortBy", e.target.value)}
            containerClassName={COMPACT_INPUT}
          />

          {options.brands.length > 0 && (
            <BrandFilter
              options={options.brands}
              value={active.brand ?? ""}
              onChange={(v) => update("brand", v)}
              placeholder="Select Brand"
              label="Brand"
            />
          )}

          {options.fuelTypes.length > 0 && (
            <SelectField
              label="Fuel type"
              options={options.fuelTypes}
              placeholder="All fuels"
              value={active.fuelType ?? ""}
              onChange={(e) => update("fuelType", e.target.value)}
              containerClassName={COMPACT_INPUT}
            />
          )}

          {options.transmissions.length > 0 && (
            <SelectField
              label="Transmission"
              options={options.transmissions}
              placeholder="All"
              value={active.transmission ?? ""}
              onChange={(e) => update("transmission", e.target.value)}
              containerClassName={COMPACT_INPUT}
            />
          )}

          {options.cities.length > 0 && (
            <SelectField
              label="City"
              options={options.cities}
              placeholder="All cities"
              value={active.city ?? ""}
              onChange={(e) => update("city", e.target.value)}
              containerClassName={COMPACT_INPUT}
            />
          )}

          {options.years.length > 0 && (
            <SelectField
              label="Year"
              options={options.years}
              placeholder="Any year"
              value={active.year ?? ""}
              onChange={(e) => update("year", e.target.value)}
              containerClassName={COMPACT_INPUT}
            />
          )}

          {(options.owners?.length ?? 0) > 0 && (
            <SelectField
              label="Owner"
              options={options.owners}
              placeholder="Any owner"
              value={active.owner ?? ""}
              onChange={(e) => update("owner", e.target.value)}
              containerClassName={COMPACT_INPUT}
            />
          )}

          {(options.models?.length ?? 0) > 0 && (
            <SelectField
              label="Model"
              options={options.models}
              placeholder="All models"
              value={active.model ?? ""}
              onChange={(e) => update("model", e.target.value)}
              containerClassName={COMPACT_INPUT}
            />
          )}

          {maxPriceOptions.length > 0 && (
            <SelectField
              label="Max price"
              options={maxPriceOptions}
              placeholder="Any budget"
              value={active.maxPrice ?? ""}
              onChange={(e) => update("maxPrice", e.target.value)}
              containerClassName={COMPACT_INPUT}
            />
          )}

          <PriceFilter
            priceMin={active.priceMin ?? ""}
            priceMax={active.priceMax ?? ""}
            onMinChange={(v) => update("priceMin", v)}
            onMaxChange={(v) => update("priceMax", v)}
            label="Price range (₹)"
          />
        </div>
      </div>
    </aside>
  )
}
