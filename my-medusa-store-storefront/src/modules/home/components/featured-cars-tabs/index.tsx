"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import type { CarListItem } from "@lib/data/cars"
import { formatCarPrice } from "@lib/util/format-car-price"
import { PLACEHOLDER_IMAGE_URL } from "@lib/constants/placeholder-image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type TabKey = "featured" | "newest" | "more"

function CarMiniCard({ car }: { car: CarListItem }) {
  const img = car.thumbnail || car.images?.[0] || PLACEHOLDER_IMAGE_URL
  const carHref = `/cars/${car.handle ?? car.id}`

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group flex flex-col items-start p-4 rounded-3xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500"
    >
      <LocalizedClientLink href={carHref} className="block w-full">
        <div className="relative w-full aspect-[16/10] rounded-2xl bg-slate-50 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.08),transparent_70%)]" />
          <Image
            src={img}
            alt={car.name}
            fill
            className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </LocalizedClientLink>

      <div className="mt-5 w-full">
        <LocalizedClientLink href={carHref}>
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {car.name}
          </h3>
        </LocalizedClientLink>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">From</span>
          <p className="text-xl font-black text-slate-900">
            {formatCarPrice(car.price)}
          </p>
        </div>
        {(car.car_type || car.fuel_type || car.year) && (
          <p className="text-xs text-slate-500 mt-2">
            {[car.car_type === "Used" ? "Old" : car.car_type, car.year, car.fuel_type].filter(Boolean).join(" · ")}
          </p>
        )}

        <LocalizedClientLink
          href={carHref}
          className="mt-6 w-full py-3 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-600 flex items-center justify-center"
        >
          View Details
        </LocalizedClientLink>
      </div>
    </motion.div>
  )
}

export default function FeaturedCarsTabs({
  featured,
  newest,
  moreListings,
}: {
  featured: CarListItem[]
  newest: CarListItem[]
  moreListings: CarListItem[]
}) {
  const [active, setActive] = useState<TabKey>("featured")

  const data = useMemo(() => ({
    featured,
    newest,
    more: moreListings,
  }), [featured, newest, moreListings])

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "featured", label: "Featured" },
    { key: "newest", label: "Newest" },
    { key: "more", label: "More Listings" },
  ]

  return (
    <section className="bg-[#fcfcfd] py-20 overflow-hidden">
      <div className="content-container">
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.3em] mb-3 block">
              Browse by category
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
              Featured <span className="text-slate-400">Cars</span>
            </h2>
          </div>

          {/* Premium Tab Switcher */}
          <div className="relative flex p-1.5 bg-slate-100 rounded-2xl w-fit">
            {tabs.map((t) => {
              const isActive = t.key === active
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={`relative px-6 py-2.5 text-xs md:text-sm font-bold uppercase tracking-widest transition-colors z-10 ${
                    isActive ? "text-white" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-indigo-600 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Dynamic Grid */}
        <div className="min-h-[450px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {(data[active] ?? []).slice(0, 3).map((car) => (
                <CarMiniCard key={car.id} car={car} />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Browse All Footer */}
        <div className="mt-16 flex justify-center">
          <LocalizedClientLink
            href="/cars"
            className="group flex items-center gap-4 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <span className="text-xs font-black uppercase tracking-[0.3em]">View all cars</span>
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-indigo-600 group-hover:bg-indigo-50 transition-all">
              <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}