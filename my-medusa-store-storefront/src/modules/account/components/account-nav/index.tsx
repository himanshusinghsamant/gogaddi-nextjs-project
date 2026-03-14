"use client"

import { useParams, usePathname } from "next/navigation"
import { User, Car, PlusCircle, MapPin, Package, LayoutDashboard, LogOut } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"

const AccountNav = ({ customer }: { customer: HttpTypes.StoreCustomer | null }) => {
  const pathname = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  const basePath = `/${countryCode}/account`
  const isActive = (href: string) => {
    if (href === "/account") return pathname === basePath
    return pathname?.startsWith(`${basePath}${href.replace("/account", "")}`)
  }

  const linkClass = (href: string) =>
    `flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive(href)
        ? "bg-blue-50 text-blue-700 border border-blue-100"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
    }`

  const links = [
    { href: "/account", label: "Overview", icon: LayoutDashboard },
    { href: "/account/profile", label: "Profile", icon: User },
    { href: "/account/my-cars", label: "My Listings", icon: Car },
    { href: "/account/add-car", label: "Add Car", icon: PlusCircle },
    { href: "/account/addresses", label: "Addresses", icon: MapPin },
    { href: "/account/orders", label: "Orders", icon: Package },
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4" data-testid="account-nav">
      {/* User summary - desktop */}
      <div className="hidden lg:block mb-6">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {customer?.first_name?.charAt(0) ?? customer?.email?.charAt(0) ?? "?"}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 truncate">
              {customer?.first_name ?? "Account"}
            </p>
            <p className="text-xs text-slate-500 truncate">{customer?.email}</p>
          </div>
        </div>
      </div>

      {/* Mobile: back to account */}
      <div className="lg:hidden mb-4" data-testid="mobile-account-nav">
        {pathname !== basePath ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            data-testid="account-main-link"
          >
            ← Back to overview
          </LocalizedClientLink>
        ) : (
          <p className="text-sm font-semibold text-slate-700">
            Hello, {customer?.first_name ?? "Account"}
          </p>
        )}
      </div>

      <nav className="space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <LocalizedClientLink
            key={href}
            href={href}
            className={linkClass(href)}
            data-testid={href === "/account" ? "overview-link" : `${href.replace("/account/", "")}-link`}
          >
            <Icon size={20} className="shrink-0" />
            {label}
          </LocalizedClientLink>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-200 mt-2"
          data-testid="logout-button"
        >
          <LogOut size={20} className="shrink-0" />
          Log out
        </button>
      </nav>
    </div>
  )
}

export default AccountNav
