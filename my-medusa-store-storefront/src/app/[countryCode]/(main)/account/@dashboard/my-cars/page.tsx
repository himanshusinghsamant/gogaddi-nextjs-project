import { Metadata } from "next"
import { redirect } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { listMyCarSubmissions } from "@lib/data/cars"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SubmissionCard from "@modules/cars/components/submission-card"

export const metadata: Metadata = {
  title: "My Listings | GoGaddi",
  description: "Track your car submission status.",
}

export default async function MyCarsPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const customer = await retrieveCustomer().catch(() => null)
  if (!customer) {
    redirect(`/${countryCode}/account?from=my-cars`)
  }

  const { submissions, error } = await listMyCarSubmissions()

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Listings</h1>
          <p className="text-slate-500 text-sm mt-1">
            {submissions.length} {submissions.length === 1 ? "submission" : "submissions"}
          </p>
        </div>
        <LocalizedClientLink
          href="/account/add-car"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          + Add Car
        </LocalizedClientLink>
      </div>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
        Cars go through an admin review before they appear in the marketplace. You will receive an
        email once your submission is approved or rejected.
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {submissions.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <span className="text-5xl block mb-4">🚗</span>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No listings yet</h3>
          <p className="text-slate-500 text-sm mb-6">
            Submit a car and our team will review it before publishing.
          </p>
          <LocalizedClientLink
            href="/account/add-car"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            + Add Your Car
          </LocalizedClientLink>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <SubmissionCard key={sub.id} sub={sub} />
          ))}
        </div>
      )}
    </div>
  )
}
