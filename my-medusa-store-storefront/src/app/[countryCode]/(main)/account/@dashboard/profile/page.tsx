import { Metadata } from "next"

import ProfilePhone from "@modules/account//components/profile-phone"
import ProfileBillingAddress from "@modules/account/components/profile-billing-address"
import ProfileEmail from "@modules/account/components/profile-email"
import ProfileName from "@modules/account/components/profile-name"
import ProfilePassword from "@modules/account/components/profile-password"

import { notFound } from "next/navigation"
import { listRegions } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your Medusa Store profile.",
}

export default async function Profile() {
  const customer = await retrieveCustomer()
  const regions = await listRegions()

  if (!customer || !regions) {
    notFound()
  }

  return (
    <div className="p-6 md:p-8 w-full" data-testid="profile-page-wrapper">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-500 text-sm mt-1">
          Update your name, email, phone and billing address.
        </p>
      </div>
      <div className="flex flex-col gap-8 w-full">
        <ProfileName customer={customer} />
        <hr className="border-slate-200" />
        <ProfileEmail customer={customer} />
        <hr className="border-slate-200" />
        <ProfilePhone customer={customer} />
        <hr className="border-slate-200" />
        <ProfileBillingAddress customer={customer} regions={regions} />
      </div>
    </div>
  )
}
