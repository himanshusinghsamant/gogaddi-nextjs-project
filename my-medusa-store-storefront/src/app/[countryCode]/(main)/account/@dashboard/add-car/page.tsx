import { Metadata } from "next"
import { redirect } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import SellCarForm from "@modules/cars/components/sell-car-form"

export const metadata: Metadata = {
  title: "Add Car | GoGaddi",
  description: "Submit your car for listing.",
}

export default async function AddCarPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const customer = await retrieveCustomer().catch(() => null)
  if (!customer) {
    redirect(`/${countryCode}/account?from=add-car`)
  }

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Add Car</h1>
        <p className="text-slate-500 text-sm mt-1">
          Submit your car for review. It will go live after admin approval.
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 md:p-8">
        <SellCarForm />
      </div>
    </div>
  )
}
