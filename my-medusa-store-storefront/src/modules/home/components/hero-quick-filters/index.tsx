"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const FILTERS = [
  { href: "/cars?carType=Used", label: "Old Cars", description: "Used & pre-owned" },
  { href: "/cars?carType=New", label: "New Cars", description: "Brand new" },
  { href: "/account/my-cars", label: "Your Cars", description: "Your listings" },
] as const

export default function HeroQuickFilters() {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8" role="group" aria-label="Quick filters">
      {FILTERS.map((f) => (
        <LocalizedClientLink
          key={f.href}
          href={f.href}
          className="group flex flex-col items-center min-w-[120px] md:min-w-[140px] px-5 py-3 rounded-xl bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/30 hover:border-yellow-400/60 text-white cursor-pointer transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.08)] hover:shadow-[0_0_28px_rgba(250,204,21,0.35),0_0_0_1px_rgba(250,204,21,0.2)] hover:ring-2 hover:ring-yellow-400/40"
        >
          <span className="font-bold text-sm md:text-base drop-shadow-md group-hover:text-yellow-200 transition-colors">{f.label}</span>
          <span className="text-xs text-blue-100 mt-0.5 opacity-90 group-hover:opacity-100 transition-opacity">{f.description}</span>
        </LocalizedClientLink>
      ))}
    </div>
  )
}
