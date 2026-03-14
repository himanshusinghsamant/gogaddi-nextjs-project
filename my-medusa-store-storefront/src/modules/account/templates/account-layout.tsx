import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ customer, children }) => {
  return (
    <div className="min-h-screen bg-slate-50" data-testid="account-page">
      <div className="content-container py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-10">
          {customer && (
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <AccountNav customer={customer} />
            </aside>
          )}
          <main className="min-w-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {children}
            </div>
            <div className="mt-10 p-6 md:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Need help?</h3>
              <p className="text-slate-600 text-sm mb-4">
                Get in touch or send an enquiry from our contact page.
              </p>
              <LocalizedClientLink
                href="/contact"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-700 hover:underline"
              >
                Contact us →
              </LocalizedClientLink>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
