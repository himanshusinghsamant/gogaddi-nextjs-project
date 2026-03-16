import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCarByHandle } from "@lib/data/cars"
import { TestDriveBookingPageForm } from "@modules/cars/components/test-drive-booking-modal"

export const metadata: Metadata = {
  title: "Book Test Drive | GoGaddi",
  description: "Schedule a free test drive for your selected car.",
}

export default async function TestDrivePage(props: {
  params: Promise<{ countryCode: string; handle: string }>
}) {
  const { countryCode, handle } = await props.params
  const { car } = await getCarByHandle(countryCode, handle)

  if (!car) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="content-container py-10 md:py-14">
        <div className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Book Test Drive
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] gap-8 lg:gap-12 items-start">
          <TestDriveBookingPageForm carId={car.id} carName={car.name} />
          <div className="hidden lg:block space-y-4 text-sm text-slate-600">
            <h2 className="text-lg font-bold text-slate-900 mb-2">{car.name}</h2>
            {car.city && <p>Preferred city: <span className="font-semibold">{car.city}</span></p>}
            <p>Our team will confirm your appointment and share the exact location and timing once you verify your email.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

