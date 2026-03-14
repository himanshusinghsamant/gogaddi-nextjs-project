import { Suspense } from "react"
import Image from "next/image"
import { retrieveCustomer } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import NavClient from "@modules/layout/templates/nav/nav-client"
import NavLinks from "@modules/layout/templates/nav/nav-links"
import HeaderSearchBar from "@modules/layout/components/header-search-bar"

export default async function Nav() {
  const customer = await retrieveCustomer().catch(() => null)

  return (
    <div className="sticky top-0 inset-x-0 z-50 pointer-events-none">
      <header className="max-w-7xl mx-auto pointer-events-auto px-2 md:px-4 py-2 md:py-4">
        <nav className="relative flex items-center justify-between h-16 px-6 rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.12)]">
          
          {/* Logo with subtle scale effect */}
          <LocalizedClientLink
            href="/"
            className="flex items-center shrink-0 transition-transform duration-300 hover:scale-105 active:scale-95"
            data-testid="nav-store-link"
          >
            <Image
              src="/gogaddi-logo.png"
              alt="GoGaddi - India's Trusted Car Marketplace"
              width={160}
              height={44}
              className="h-8 w-auto object-contain"
              priority
            />
          </LocalizedClientLink>

          {/* Desktop links - Modern Pill Design */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1 rounded-xl border border-gray-200/50">
            <NavLinks
              links={[
                { href: "/", label: "Home", exact: true },
                { href: "/cars", label: "Browse Cars" },
              ]}
            />
          </div>

          {/* Header search - navigates to /cars with query */}
          <div className="hidden md:flex flex-1 min-w-0 max-w-xl mx-2 lg:mx-4">
            <Suspense fallback={<div className="w-full h-10 rounded-xl bg-slate-100 animate-pulse" />}>
              <HeaderSearchBar />
            </Suspense>
          </div>

          {/* Right side - Dynamic Account Interaction */}
          <div className="flex items-center gap-4">
            {customer ? (
              <div className="hidden md:flex">
                <LocalizedClientLink
                  href="/account"
                  className="group flex items-center gap-3 pl-1 pr-4 py-1 rounded-full border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all duration-300"
                  data-testid="nav-account-link"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform">
                    <span className="text-white font-bold text-xs uppercase">
                      {customer.first_name?.charAt(0) ?? customer.email?.charAt(0) ?? "U"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold leading-none">Account</span>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                      {customer.first_name ?? "User"}
                    </span>
                  </div>
                </LocalizedClientLink>
              </div>
            ) : (
              <div className="hidden md:flex">
                <LocalizedClientLink
                  href="/account"
                  className="relative overflow-hidden group px-6 py-2 text-sm font-semibold text-blue-600 transition-all duration-300"
                  data-testid="nav-account-link"
                >
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-blue-50 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 rounded-lg" />
                </LocalizedClientLink>
              </div>
            )}

            {/* Mobile hamburger wrapper */}
            <div className="md:border-l border-gray-200 md:pl-4">
              <Suspense fallback={<div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />}>
                <NavClient customer={customer} />
              </Suspense>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}