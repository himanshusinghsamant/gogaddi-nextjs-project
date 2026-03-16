import { Suspense } from "react"
import Image from "next/image"
import { retrieveCustomer } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import NavClient from "@modules/layout/templates/nav/nav-client"
import NavLinks from "@modules/layout/templates/nav/nav-links"
import HeaderSearchBar from "@modules/layout/components/header-search-bar"
import { User } from "lucide-react"

export default async function Nav() {
  const customer = await retrieveCustomer().catch(() => null)

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-all duration-200">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4 md:gap-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <LocalizedClientLink
            href="/"
            className="block hover:opacity-90 transition-opacity"
            data-testid="nav-store-link"
          >
            <Image
              src="/gogaddi-logo.webp"
              alt="GoGaddi"
              width={140}
              height={40}
              className="h-8 md:h-9 w-auto object-contain brightness-0"
              priority
            />
          </LocalizedClientLink>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <NavLinks
            links={[
              { href: "/", label: "Home", exact: true },
              { href: "/cars", label: "Browse Cars" },
            ]}
          />
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:block flex-1 max-w-md">
          <Suspense fallback={<div className="w-full h-10 rounded-xl bg-slate-100 animate-pulse" />}>
            <HeaderSearchBar />
          </Suspense>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Account Link (Desktop) */}
          <div className="hidden md:block">
            {customer ? (
              <LocalizedClientLink
                href="/account"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors group"
                data-testid="nav-account-link"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {customer.first_name?.charAt(0) ?? customer.email?.charAt(0) ?? "U"}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-slate-700 group-hover:text-slate-900 leading-none">
                    {customer.first_name ?? "Account"}
                  </p>
                </div>
              </LocalizedClientLink>
            ) : (
              <LocalizedClientLink
                href="/account"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all shadow-sm hover:shadow-md"
                data-testid="nav-account-link"
              >
                <User size={16} />
                <span>Login</span>
              </LocalizedClientLink>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Suspense>
              <NavClient customer={customer} />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  )
}
