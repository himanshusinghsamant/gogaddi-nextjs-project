"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Fuel, Gauge, Calendar, MapPin, Heart } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { CarListItem } from "@lib/data/cars"
import { formatCarPrice } from "@lib/util/format-car-price"
import { PLACEHOLDER_IMAGE_URL } from "@lib/constants/placeholder-image"

export default function CarCard({ car, featured = false }: { car: CarListItem; featured?: boolean }) {
  const displayImage = car.thumbnail || car.images?.[0] || PLACEHOLDER_IMAGE_URL

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
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
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
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-y-2 gap-x-1 mb-5 py-3 border-t border-b border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Year</span>
            <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
              <Calendar size={12} className="text-blue-500" />
              {car.year || "N/A"}
            </div>
          </div>
          <div className="flex flex-col border-l border-gray-100 pl-3">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Fuel</span>
            <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
              <Fuel size={12} className="text-blue-500" />
              <span className="truncate">{car.fuel_type || "N/A"}</span>
            </div>
          </div>
          <div className="flex flex-col border-l border-gray-100 pl-3">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Mileage</span>
            <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
              <Gauge size={12} className="text-blue-500" />
              <span className="truncate">{car.mileage ? `${car.mileage} km` : "N/A"}</span>
            </div>
          </div>
        </div>

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
