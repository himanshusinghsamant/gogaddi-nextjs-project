"use client"

import { motion } from "framer-motion"
import CarCard from "@modules/cars/components/car-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { CarListItem } from "@lib/data/cars"
import { ArrowRight } from "lucide-react"

export default function FeaturedCarsSection({ featuredCars }: { featuredCars: CarListItem[] }) {
  return (
    <section className="bg-white pt-10">
      <div className="content-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4"
            >
              Featured <span className="text-blue-600">Inventory</span>
            </motion.h2>
            <p className="text-gray-500 text-lg max-w-2xl">
              Explore our hand-picked selection of premium vehicles, verified for quality and performance.
            </p>
          </div>

          <LocalizedClientLink
            href="/cars"
            className="group flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200"
          >
            View All Cars
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredCars.map((car) => (
            <CarCard key={car.id} car={car} featured />
          ))}
        </div>
      </div>
    </section>
  )
}
