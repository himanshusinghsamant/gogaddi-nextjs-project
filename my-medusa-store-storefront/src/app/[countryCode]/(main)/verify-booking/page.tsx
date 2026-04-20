"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Status = "loading" | "success" | "already_verified" | "error"

function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<Status>("loading")
  const [message, setMessage] = useState("")
  const [booking, setBooking] = useState<{
    name?: string
    car_title?: string | null
    preferred_date?: string
    preferred_time?: string
    city?: string
  } | null>(null)

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("No verification token found in the URL.")
      return
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
      process.env.MEDUSA_BACKEND_URL ||
      "http://localhost:9000"

    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    fetch(`${backendUrl}/store/car-bookings/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(publishableKey ? { "x-publishable-api-key": publishableKey } : {}),
      },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (res.ok) {
          if (data.booking?.is_email_verified && data.booking?.status !== "email_verified") {
            setStatus("already_verified")
          } else {
            setStatus("success")
          }
          setBooking(data.booking ?? null)
          setMessage(data.message ?? "")
        } else {
          setStatus("error")
          setMessage(data?.message || "Verification failed. The link may be invalid or expired.")
        }
      })
      .catch(() => {
        setStatus("error")
        setMessage("Network error. Please try again later.")
      })
  }, [token])

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Verifying your email…</p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h2>
          <p className="text-gray-500 text-sm max-w-sm">{message}</p>
        </div>
        <LocalizedClientLink
          href="/cars"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          Browse Cars
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {status === "already_verified" ? "Already Verified!" : "Email Verified!"}
        </h2>
        <p className="text-gray-500 text-sm max-w-sm">
          {status === "already_verified"
            ? "Your email was already verified. Your booking is pending admin confirmation."
            : "Your test drive booking is confirmed. Our team will contact you soon."}
        </p>
      </div>

      {booking && (booking.car_title || booking.preferred_date) && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 text-left w-full max-w-xs space-y-2">
          {booking.name && (
            <Row label="Name" value={booking.name} />
          )}
          {booking.car_title && (
            <Row label="Car" value={booking.car_title} />
          )}
          {booking.preferred_date && (
            <Row label="Date" value={booking.preferred_date} />
          )}
          {booking.preferred_time && (
            <Row label="Time" value={booking.preferred_time} />
          )}
          {booking.city && (
            <Row label="City" value={booking.city} />
          )}
        </div>
      )}

      <div className="flex gap-3">
        <LocalizedClientLink
          href="/cars"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          Browse More Cars
        </LocalizedClientLink>
        <LocalizedClientLink
          href="/"
          className="px-6 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-sm transition-colors"
        >
          Go Home
        </LocalizedClientLink>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center gap-3">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-gray-900 text-right">{value}</span>
    </div>
  )
}

export default function VerifyBookingPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="content-container">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  )
}
