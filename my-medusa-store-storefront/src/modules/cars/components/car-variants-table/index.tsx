"use client"

import { useParams, useRouter } from "next/navigation"
import { formatCarPrice, getVersionPrice } from "@lib/util/format-car-price"
import type { CarVersion } from "@lib/data/cars"

type Props = {
  versions: CarVersion[]
  selectedVariantId: string | null
  carHandle: string
}

export default function CarVariantsTable({ versions, selectedVariantId, carHandle }: Props) {
  const router = useRouter()
  const { countryCode } = useParams() as { countryCode?: string }
  if (!versions?.length) return null

  const handleRowClick = (v: CarVersion) => {
    const qty = v.manage_inventory ? (v.inventory_quantity ?? 0) : null
    const inStock = qty === null || qty > 0
    if (!inStock) return
    const base = countryCode ? `/${countryCode}/cars/${carHandle}` : `/cars/${carHandle}`
    router.push(`${base}?variant_id=${encodeURIComponent(v.id)}`)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Variants</h3>
        <p className="text-sm text-gray-500 mt-0.5">Select a variant to see price and buy</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">SKU</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Fuel Type</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Transmission</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Ex Showroom Price (INR)</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Inventory</th>
            </tr>
          </thead>
          <tbody>
            {versions.map((v) => {
              const price = getVersionPrice(v.prices)
              const qty = v.manage_inventory ? (v.inventory_quantity ?? 0) : null
              const inventoryText = qty === null ? "—" : qty > 0 ? `${qty} available` : "0 available"
              const inStock = qty === null || qty > 0
              const isSelected = selectedVariantId === v.id
              const rowClass = `border-b border-gray-100 transition-colors ${
                isSelected ? "bg-blue-50 ring-1 ring-blue-200 ring-inset" : "hover:bg-gray-50/50"
              } ${inStock ? "cursor-pointer" : "opacity-75"}`

              return (
                <tr
                  key={v.id}
                  className={rowClass}
                  onClick={() => handleRowClick(v)}
                  role={inStock ? "button" : undefined}
                  tabIndex={inStock ? 0 : undefined}
                  onKeyDown={inStock ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleRowClick(v) } } : undefined}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{v.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{v.sku ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{v.fuel_type ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{v.transmission ?? "—"}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCarPrice(price)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${qty !== null && qty === 0 ? "text-red-600" : "text-gray-700"}`}>
                      {inventoryText}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
