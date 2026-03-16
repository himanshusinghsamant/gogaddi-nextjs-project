import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ customer, children }) => {
  // Premium full-width layout for guests (login / register views)
  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50" data-testid="account-page">
        <div className="content-container py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: Auth card */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/60 p-6 md:p-10 max-w-lg w-full mx-auto">
              {children}
            </div>

            {/* Right: Hero / value props */}
            <div className="hidden lg:block">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-950 to-blue-900 text-white p-10 h-full flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] uppercase text-blue-300 mb-4">
                    GoGaddi Account
                  </p>
                  <h2 className="text-3xl xl:text-4xl font-black leading-tight mb-4">
                    Manage your cars, bookings, and profile in one place.
                  </h2>
                  <p className="text-sm text-blue-100/90 max-w-md">
                    Track test drives, manage listings, and keep your details up to date with a premium, secure
                    experience tailored for car buyers and sellers.
                  </p>

                  <ul className="mt-8 space-y-3 text-sm text-blue-100/90">
                    <li className="flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 border border-blue-400/40 text-xs">
                        ✓
                      </span>
                      Access your test drive bookings and history.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 border border-blue-400/40 text-xs">
                        ✓
                      </span>
                      Manage and edit your car listings anytime.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 border border-blue-400/40 text-xs">
                        ✓
                      </span>
                      Secure account with fast sign‑in and recovery.
                    </li>
                  </ul>
                </div>

                <div className="mt-10 relative">
                  <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
                  <p className="text-xs text-blue-200/80">
                    Need help?{" "}
                    <LocalizedClientLink href="/contact" className="font-semibold underline underline-offset-4">
                      Contact support
                    </LocalizedClientLink>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Authenticated account dashboard layout
  return (
    <div className="min-h-screen bg-slate-50" data-testid="account-page">
      <div className="content-container py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-10">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <AccountNav customer={customer} />
          </aside>
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
