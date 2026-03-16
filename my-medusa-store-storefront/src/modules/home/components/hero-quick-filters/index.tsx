"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Car, Sparkles, User } from "lucide-react"

const FILTERS = [
  { href: "/cars?carType=Used", label: "Pre-Owned", icon: Car },
  { href: "/cars?carType=New", label: "New Arrivals", icon: Sparkles },
  { href: "/account/my-cars", label: "Sell Your Car", icon: User },
] as const

export default function HeroQuickFilters() {
  return (
    <div
      className="w-full mb-6 -mx-4 md:mx-0"
      role="group"
      aria-label="Quick filters"
    >
      <div className="flex md:flex-wrap gap-3 md:gap-4 px-4 md:px-0 overflow-x-auto md:overflow-visible no-scrollbar">
        {FILTERS.map((f) => (
          <LocalizedClientLink
            key={f.href}
            href={f.href}
            className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 hover:bg-white text-white hover:text-gray-900 backdrop-blur-md border border-white/20 hover:border-white transition-all duration-300 shrink-0 md:shrink"
          >
            <f.icon size={18} className="group-hover:text-blue-600 transition-colors" />
            <span className="font-semibold text-xs md:text-sm tracking-wide whitespace-nowrap">
              {f.label}
            </span>
          </LocalizedClientLink>
        ))}
      </div>
    </div>
  )
}
