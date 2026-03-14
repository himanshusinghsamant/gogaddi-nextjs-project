"use client"

import TextField from "@modules/common/components/text-field"

type Props = {
  priceMin: string
  priceMax: string
  onMinChange: (value: string) => void
  onMaxChange: (value: string) => void
  label?: string
  minPlaceholder?: string
  maxPlaceholder?: string
  className?: string
}

/** Reusable price range filter (min–max). */
export default function PriceFilter({
  priceMin,
  priceMax,
  onMinChange,
  onMaxChange,
  label = "Price range (₹)",
  minPlaceholder = "Min",
  maxPlaceholder = "Max",
  className = "",
}: Props) {
  return (
    <div className={className}>
      {label && (
        <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-1.5">
          {label}
        </h4>
      )}
      <div className="flex gap-2 items-center">
        <TextField
          type="number"
          placeholder={minPlaceholder}
          value={priceMin}
          onChange={(e) => onMinChange(e.target.value)}
          containerClassName="flex-1 text-sm"
          inputClassName="text-sm"
          inputMode="numeric"
        />
        <span className="text-slate-300 font-medium text-xs">–</span>
        <TextField
          type="number"
          placeholder={maxPlaceholder}
          value={priceMax}
          onChange={(e) => onMaxChange(e.target.value)}
          containerClassName="flex-1 text-sm"
          inputClassName="text-sm"
          inputMode="numeric"
        />
      </div>
    </div>
  )
}
