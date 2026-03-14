"use client"

import { User } from "lucide-react"

type Props = {
  name?: string | null
  email?: string | null
  phone?: string | null
  city?: string | null
  className?: string
}

/** Reusable card to display seller/owner contact info (e.g. on car detail or listing). */
export default function SellerCard({
  name,
  email,
  phone,
  city,
  className = "",
}: Props) {
  const hasAny = name || email || phone || city
  if (!hasAny) return null

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-slate-50/50 p-4 ${className}`}
      data-testid="seller-card"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">
          <User size={18} className="text-slate-600" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Seller
        </span>
      </div>
      {name && (
        <p className="font-semibold text-slate-900 text-sm">{name}</p>
      )}
      {city && (
        <p className="text-slate-600 text-sm mt-0.5">{city}</p>
      )}
      {email && (
        <a
          href={`mailto:${email}`}
          className="text-blue-600 hover:underline text-sm mt-1 block"
        >
          {email}
        </a>
      )}
      {phone && (
        <a
          href={`tel:${phone}`}
          className="text-blue-600 hover:underline text-sm mt-0.5 block"
        >
          {phone}
        </a>
      )}
    </div>
  )
}
