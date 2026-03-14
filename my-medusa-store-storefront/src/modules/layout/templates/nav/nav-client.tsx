"use client"

import { useState } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"

export default function NavClient({ customer }: { customer: HttpTypes.StoreCustomer | null }) {
  const [open, setOpen] = useState(false)
  const [mobileQuery, setMobileQuery] = useState("")
  const { countryCode } = useParams() as { countryCode: string }
  const pathname = usePathname() || `/${countryCode}`
  const router = useRouter()

  const handleLogout = async () => {
    await signout(countryCode)
    setOpen(false)
  }

  const links = [
    { href: `/${countryCode}`, label: "Home" },
    { href: `/${countryCode}/cars`, label: "Browse Cars" },
    ...(customer
      ? [
          { href: `/${countryCode}/account`, label: "My Account" },
          { href: `/${countryCode}/account/my-cars`, label: "My Listings" },
        ]
      : [{ href: `/${countryCode}/account`, label: "Login / Register" }]),
  ]

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        {open ? (
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)} />
          <div className="fixed top-16 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-lg p-4">
            <form
              className="mb-4"
              onSubmit={(e) => {
                e.preventDefault()
                const q = mobileQuery.trim()
                setOpen(false)
                router.push(`/${countryCode}/cars${q ? `?query=${encodeURIComponent(q)}` : ""}`)
              }}
            >
              <input
                type="search"
                value={mobileQuery}
                onChange={(e) => setMobileQuery(e.target.value)}
                placeholder="Search cars, brand, model..."
                className="w-full h-11 pl-4 pr-4 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
              />
            </form>
            <ul className="flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === l.href || pathname.startsWith(`${l.href}/`)
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                    aria-current={pathname === l.href || pathname.startsWith(`${l.href}/`) ? "page" : undefined}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              {customer && (
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
