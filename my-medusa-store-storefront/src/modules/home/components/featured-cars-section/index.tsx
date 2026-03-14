"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Fuel, Gauge, Share2, Heart } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { formatCarPrice } from "@lib/util/format-car-price"
import type { CarListItem } from "@lib/data/cars"
import { PLACEHOLDER_IMAGE_URL } from "@lib/constants/placeholder-image"

interface CarCardProps {
  car: CarListItem
  featured?: boolean
}

export function CarCard({ car, featured }: CarCardProps) {
  const displayImage = car.thumbnail || car.images?.[0] || PLACEHOLDER_IMAGE_URL

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
      className="group relative flex flex-col h-full rounded-[24px] bg-white border border-slate-200/80 overflow-hidden transition-all duration-300 ease-out hover:border-slate-300 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)]"
    >
      <div className="relative flex flex-col h-full w-full bg-white rounded-[24px] overflow-hidden">

        {/* Top Image Section */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
          <LocalizedClientLink href={`/cars/${car.handle ?? car.id}`} className="block w-full h-full">
            <motion.div
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              <Image
                src={displayImage}
                alt={car.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </motion.div>
          </LocalizedClientLink>

          {/* Action Overlay */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button className="p-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 text-slate-600 hover:text-red-500 transition-colors shadow-sm">
              <Heart size={16} />
            </button>
            <button className="p-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 text-slate-600 hover:text-blue-600 transition-colors shadow-sm">
              <Share2 size={16} />
            </button>
          </div>

          {featured && (
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white">
              Featured Deal
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="flex flex-col flex-1 p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
              {car.name}
            </h3>
          </div>

          <p className="text-2xl font-black text-slate-900 tracking-tighter mb-4">
            {formatCarPrice(car.price)}
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
            {car.car_type && (
              <p className="text-xs text-slate-500 truncate font-medium">
                {car.car_type === "Used" ? "Old" : car.car_type}
              </p>
            )}
            {car.year && <p className="text-xs text-slate-500 truncate">{car.year}</p>}
            {car.fuel_type && (
              <div className="flex items-center gap-1.5 text-slate-500">
                <Fuel size={12} className="text-blue-500 shrink-0" />
                <span className="text-xs font-medium truncate">{car.fuel_type}</span>
              </div>
            )}
            {car.transmission && <p className="text-xs text-slate-500 truncate">{car.transmission}</p>}
            <div className="flex items-center gap-1.5 text-slate-500">
              <Gauge size={12} className="text-blue-500 shrink-0" />
              <span className="text-xs font-medium truncate">{car.mileage ? `${car.mileage} kmpl` : "—"}</span>
            </div>
          </div>
          {car.city && <p className="text-xs text-slate-400 mt-2 truncate">{car.city}</p>}

          <div className="mt-6">
            <LocalizedClientLink
              href={`/cars/${car.handle ?? car.id}`}
              className="flex items-center justify-center w-full py-3 rounded-xl bg-slate-50 text-slate-900 text-sm font-bold transition-all group-hover:bg-blue-600 group-hover:text-white"
            >
              View Details
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function FeaturedCarsSection({ featuredCars }: { featuredCars: CarListItem[] }) {
  return (
    <section className="bg-[#F8FAFC] py-24">
      <div className="content-container">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-4xl font-black text-slate-900 tracking-tighter"
            >
              Featured <span className="text-blue-600">Inventory.</span>
            </motion.h2>
            <p className="text-slate-500 mt-2 font-light">Featured listings from verified sellers.</p>
          </div>

          <LocalizedClientLink
            href="/cars"
            className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-slate-200 text-sm font-bold text-slate-900 hover:border-blue-500 transition-all shadow-sm"
          >
            Explore Full Fleet
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {featuredCars.map((car) => (
            <CarCard key={car.id} car={car} featured />
          ))}
        </div>
      </div>
    </section>
  )
}
