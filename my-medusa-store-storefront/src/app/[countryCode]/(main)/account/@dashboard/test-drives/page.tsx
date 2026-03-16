import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listMyTestDriveBookings } from "@lib/data/cars"
import { Calendar } from "lucide-react"

export const metadata: Metadata = {
  title: "Test Drive Bookings",
  description: "View your test drive booking status.",
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  email_verified: "Email verified",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
}

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  email_verified: "bg-blue-100 text-blue-800 border-blue-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-slate-100 text-slate-600 border-slate-200",
}

export default async function TestDrivesPage() {
  const { bookings, error } = await listMyTestDriveBookings()

  return (
    <div className="p-6 md:p-8 w-full" data-testid="test-drives-page-wrapper">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Test Drive Bookings</h1>
        <p className="text-slate-500 text-sm mt-1">
          View the status of your test drive requests.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="py-12 px-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 mx-auto mb-4">
            <Calendar size={28} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">No test drive bookings yet</h2>
          <p className="text-slate-500 text-sm mb-6">
            When you book a free test drive from a car page, it will show up here.
          </p>
          <LocalizedClientLink
            href="/cars"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 text-sm transition-colors"
          >
            Browse cars
          </LocalizedClientLink>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Car
                </th>
                <th className="pb-3 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Date &amp; time
                </th>
                <th className="pb-3 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  City
                </th>
                <th className="pb-3 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Booked on
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-4 pr-4">
                    <span className="font-medium text-slate-900">
                      {b.car_title || b.car_id}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-slate-600 text-sm">
                    {b.preferred_date} · {b.preferred_time}
                  </td>
                  <td className="py-4 pr-4 text-slate-600 text-sm">{b.city}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${STATUS_STYLE[b.status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}
                    >
                      {STATUS_LABEL[b.status] ?? b.status}
                    </span>
                  </td>
                  <td className="py-4 text-slate-500 text-sm">
                    {new Date(b.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
