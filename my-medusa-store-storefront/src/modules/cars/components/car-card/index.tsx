"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Fuel, Gauge, Calendar, MapPin, Heart } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { CarListItem } from "@lib/data/cars"
import {
  formatCarPrice,
  formatExShowroomOptionRowDisplay,
  hasMetadataListingPrice,
} from "@lib/util/format-car-price"
import { hasCarDisplayValue } from "@lib/util/has-car-display-value"
import { PLACEHOLDER_IMAGE_URL } from "@lib/constants/placeholder-image"

export default function CarCard({ car, featured = false }: { car: CarListItem; featured?: boolean }) {
  const displayImage = car.thumbnail || car.images?.[0] || PLACEHOLDER_IMAGE_URL
  const meta = car.metadata as Record<string, unknown> | undefined
  const stockInv = meta?.inventory
  const toDisplayText = (v: unknown) =>
    typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim()

  const specItems = [
    hasCarDisplayValue(car.year) && {
      label: "Year",
      icon: Calendar,
      value: toDisplayText(car.year),
    },
    hasCarDisplayValue(car.fuel_type) && {
      label: "Fuel",
      icon: Fuel,
      value: toDisplayText(car.fuel_type),
    },
    hasCarDisplayValue(car.mileage) && {
      label: "Mileage",
      icon: Gauge,
      value: toDisplayText(car.mileage),
    },
  ].filter(Boolean) as Array<{ label: string; icon: typeof Calendar; value: string }>

  const visibleOptions =
    car.product_options?.filter((opt) => {
      if (/ex showroom price.*inr/i.test(String(opt.title).trim()) && hasMetadataListingPrice(car)) {
        return true
      }
      return Array.isArray(opt.values) && opt.values.some((v) => hasCarDisplayValue(v))
    }) ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Image Section */}
      <div className="relative aspect-[16/8] overflow-hidden bg-gray-100">
        <LocalizedClientLink href={`/cars/${car.handle ?? car.id}`} className="block w-full h-full">
          <Image
            src={displayImage}
            alt={car.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </LocalizedClientLink>

        {/* Wishlist Button */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
          aria-label="Add to wishlist"
        >
          <Heart size={18} />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {featured && (
            <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
              Featured
            </span>
          )}
          {!car.availability && (
            <span className="px-3 py-1 bg-red-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
              Sold
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 truncate group-hover:text-blue-600 transition-colors">
            {car.name}
          </h3>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
             <MapPin size={12} />
             <span className="truncate">{car.city || "Available Online"}</span>
          </div>
            {car.engine && (
              <p className="text-[12px] text-gray-500 mt-1 line-clamp-1">
                {car.engine}
              </p>
            )}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-[11px] text-gray-500">
            {car.owner ? <span>Owner: {car.owner}</span> : null}
            {car.km_driven ? <span>{car.km_driven} km</span> : null}
            {stockInv != null && stockInv !== "" ? <span>Stock: {String(stockInv)}</span> : null}
          </div>
        </div>

        {specItems.length > 0 && (
          <div
            className={`grid gap-y-2 gap-x-1 mb-5 py-3 border-t border-b border-gray-50 ${
              specItems.length === 1 ? "grid-cols-1" : specItems.length === 2 ? "grid-cols-2" : "grid-cols-3"
            }`}
          >
            {specItems.map((spec, i) => {
              const Icon = spec.icon
              return (
                <div
                  key={spec.label}
                  className={`flex flex-col ${i > 0 ? "border-l border-gray-100 pl-3" : ""}`}
                >
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">{spec.label}</span>
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
                    <Icon size={12} className="text-blue-500 shrink-0" />
                    <span className="truncate">{spec.value}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {visibleOptions.length > 0 && (
          <div className="mb-4 space-y-1.5 border-t border-gray-50 pt-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Options</p>
            {visibleOptions.map((opt) => (
              <div key={opt.title} className="flex justify-between gap-2 text-xs">
                <span className="text-gray-500 shrink-0">{opt.title}</span>
                <span className="font-medium text-gray-800 text-right line-clamp-2">
                  {formatExShowroomOptionRowDisplay(car, opt.title, opt.values)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Price</p>
            <p className="text-xl font-black text-gray-900 tracking-tight">
              {formatCarPrice(car.price)}
            </p>
          </div>
          
          <LocalizedClientLink
            href={`/cars/${car.handle ?? car.id}`}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            <span className="inline md:hidden">View</span>
            <span className="hidden md:inline">View Details</span>
          </LocalizedClientLink>
        </div>
      </div>
    </motion.div>
  )
}
