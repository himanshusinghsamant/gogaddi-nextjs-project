"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type SubmissionCardData = {
  id: string
  title: string
  brand: string
  car_model: string
  year: string
  fuel_type: string
  transmission: string
  city: string
  expected_price: number
  status: "pending" | "approved" | "rejected" | "sold"
  product_id: string | null
  rejection_reason: string | null
  images: string[]
  created_at: string
}

const STATUS_CONFIG = {
  pending: {
    label: "Pending Review",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  approved: {
    label: "Approved — Live",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  sold: {
    label: "Sold",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
} as const

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Reusable card for a seller submission in My Listings. */
export default function SubmissionCard({ sub }: { sub: SubmissionCardData }) {
  const cfg = STATUS_CONFIG[sub.status] ?? STATUS_CONFIG.pending
  const firstImage = sub.images?.[0] ?? null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex gap-5 items-start">
      <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
        {firstImage ? (
          <img src={firstImage} alt={sub.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🚗</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{sub.title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {sub.year} · {sub.fuel_type} · {sub.transmission} · {sub.city}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <span className="font-semibold text-gray-900">{formatINR(sub.expected_price)}</span>
          <span className="text-gray-400">
            Submitted {new Date(sub.created_at).toLocaleDateString("en-IN")}
          </span>
        </div>
        {sub.status === "rejected" && sub.rejection_reason && (
          <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <strong>Reason:</strong> {sub.rejection_reason}
          </p>
        )}
        {sub.status === "approved" && sub.product_id && (
          <div className="mt-2">
            <LocalizedClientLink
              href="/cars"
              className="text-xs text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2"
            >
              View in marketplace →
            </LocalizedClientLink>
          </div>
        )}
      </div>
    </div>
  )
}
