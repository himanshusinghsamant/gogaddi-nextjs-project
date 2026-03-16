"use client"

import { useCallback, useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { CarFilterOptions } from "@lib/data/cars"
import type { CategoryOption } from "@modules/cars/components/car-filters"
import { SlidersHorizontal, ChevronDown, Check, X } from "lucide-react"

type ActiveFilters = {
  category?: string
  carType?: string
  maxPrice?: string
  brand?: string
  fuelType?: string
  transmission?: string
  year?: string
  owner?: string
  model?: string
  city?: string
  sortBy?: string
}

type Props = {
  options: CarFilterOptions
  active: ActiveFilters
  categoryOptions: CategoryOption[]
  maxPriceOptions: CategoryOption[]
}

const SORT_OPTIONS = [
  { value: "", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
]

function FilterPill({
  label,
  value,
  options,
  onChange,
  placeholder = "All",
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (val: string) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const displayOptions = options.filter((o) => o.value !== "")

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  const selectedLabel = options.find((o) => o.value === value)?.label || placeholder
  const isActive = !!value

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1.5 h-9 px-3.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all ${
          isActive
            ? "bg-blue-50 border-blue-200 text-blue-700"
            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
        }`}
      >
        <span className="text-[10px] uppercase tracking-wider text-gray-400 mr-0.5">{label}</span>
        <span>{isActive ? selectedLabel.replace(/--|__/g, "") : placeholder}</span>
        <ChevronDown size={12} className={`opacity-50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {mounted && open && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setOpen(false)}
          />

          {/* Bottom Sheet */}
          <div className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{label}</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-2">
              {/* "All" option */}
              <button
                onClick={() => {
                  onChange("")
                  setOpen(false)
                }}
                className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-colors ${
                  !value ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{placeholder}</span>
                {!value && <Check size={18} />}
              </button>

              {displayOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-colors ${
                    value === opt.value
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{opt.label.replace(/--|__/g, "")}</span>
                  {value === opt.value && <Check size={18} />}
                </button>
              ))}
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  )
}

export default function MobileFilterBar({ options, active, categoryOptions, maxPriceOptions }: Props) {
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

  return (
    <div className="lg:hidden mb-6">
      <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
        <SlidersHorizontal size={14} />
        <span>Quick Filters</span>
      </div>
      
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
        {/** Category */}
        {categoryOptions.length > 0 && (
          <FilterPill
            label="Category"
            value={active.category ?? ""}
            options={categoryOptions}
            onChange={(v) => update("category", v)}
            placeholder="All categories"
          />
        )}

        <FilterPill
          label="Sort"
          value={active.sortBy ?? ""}
          options={SORT_OPTIONS}
          onChange={(v) => update("sortBy", v)}
          placeholder="Recommended"
        />

        <FilterPill
          label="Type"
          value={active.carType ?? ""}
          options={[
            { value: "Used", label: "Pre-owned" },
            { value: "New", label: "New" },
          ]}
          onChange={(v) => update("carType", v)}
        />

        <FilterPill
          label="Budget"
          value={active.maxPrice ?? ""}
          options={maxPriceOptions}
          onChange={(v) => update("maxPrice", v)}
          placeholder="Any Price"
        />

        {options.brands.length > 0 && (
          <FilterPill
            label="Brand"
            value={active.brand ?? ""}
            options={options.brands.map(b => typeof b === 'string' ? { value: b, label: b } : b)}
            onChange={(v) => update("brand", v)}
          />
        )}

        {options.fuelTypes.length > 0 && (
          <FilterPill
            label="Fuel"
            value={active.fuelType ?? ""}
            options={options.fuelTypes.map(f => typeof f === 'string' ? { value: f, label: f } : f)}
            onChange={(v) => update("fuelType", v)}
          />
        )}

        {options.transmissions.length > 0 && (
          <FilterPill
            label="Transmission"
            value={active.transmission ?? ""}
            options={options.transmissions.map(t => typeof t === 'string' ? { value: t, label: t } : t)}
            onChange={(v) => update("transmission", v)}
          />
        )}

        {options.years.length > 0 && (
          <FilterPill
            label="Year"
            value={active.year ?? ""}
            options={options.years.map(y => typeof y === 'string' ? { value: y, label: y } : y)}
            onChange={(v) => update("year", v)}
          />
        )}

        {(options.owners?.length ?? 0) > 0 && (
          <FilterPill
            label="Owner"
            value={active.owner ?? ""}
            options={options.owners!.map(o => typeof o === 'string' ? { value: o, label: o } : o)}
            onChange={(v) => update("owner", v)}
          />
        )}

        {(options.models?.length ?? 0) > 0 && (
          <FilterPill
            label="Model"
            value={active.model ?? ""}
            options={options.models!.map(m => typeof m === 'string' ? { value: m, label: m } : m)}
            onChange={(v) => update("model", v)}
          />
        )}

        {options.cities.length > 0 && (
          <FilterPill
            label="City"
            value={active.city ?? ""}
            options={options.cities.map(c => typeof c === 'string' ? { value: c, label: c } : c)}
            onChange={(v) => update("city", v)}
          />
        )}
      </div>
    </div>
  )
}
