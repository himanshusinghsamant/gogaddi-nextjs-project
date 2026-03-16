"use client"

import React from "react"
import { motion } from "framer-motion"
import { Clock, ArrowUpRight } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { CarListItem } from "@lib/data/cars"
import CarCard from "@modules/cars/components/car-card"

export default function LatestArrivals({ latestCars }: { latestCars: CarListItem[] }) {
  // Container variants for staggered children animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
  }

  return (
    <section className="bg-white py-20 overflow-hidden">
      <div className="content-container">
        {/* Header with Progress-like border */}
        <div className="flex items-end justify-between mb-12 border-b border-slate-100 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
                Live Updates
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
              Latest <span className="text-slate-400 font-light">Arrivals.</span>
            </h2>
          </div>

          <LocalizedClientLink
            href="/cars?sortBy=newest"
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Browse Newest
            <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-all">
              <ArrowUpRight size={14} />
            </div>
          </LocalizedClientLink>
        </div>

        {/* Staggered Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {latestCars.map((car, idx) => (
            <motion.div key={car.id} variants={itemVariants} className="relative">
              {/* "Just In" Badge for the first two items */}
              {idx < 2 && (
                <div className="absolute -top-2 -right-2 z-20 bg-slate-900 text-white text-[9px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-black/20 italic tracking-widest">
                  <Clock size={10} className="text-indigo-400" />
                  JUST IN
                </div>
              )}

              <CarCard car={car} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Utility Link (Mobile Only) */}
        <div className="mt-10 sm:hidden">
          <LocalizedClientLink
            href="/cars?sortBy=newest"
            className="flex items-center justify-center w-full py-4 rounded-2xl bg-slate-50 text-slate-900 text-sm font-bold border border-slate-200"
          >
            View All New Listings
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
