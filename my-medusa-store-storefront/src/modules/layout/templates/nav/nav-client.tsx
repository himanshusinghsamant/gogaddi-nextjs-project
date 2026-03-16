"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useParams, usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"
import { Menu, X, Search, ChevronRight, LogOut, User } from "lucide-react"

export default function NavClient({ customer }: { customer: HttpTypes.StoreCustomer | null }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mobileQuery, setMobileQuery] = useState("")
  const { countryCode } = useParams() as { countryCode: string }
  const pathname = usePathname() || `/${countryCode}`
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

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
      : []),
  ]

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        className="p-2 -mr-2 text-slate-700 hover:text-blue-600 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {mounted && createPortal(
        <>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
              open ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div 
            className={`fixed inset-y-0 right-0 z-[70] w-full max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
              open ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <span className="text-lg font-bold text-slate-900">Menu</span>
                <button 
                  onClick={() => setOpen(false)}
                  className="p-2 -mr-2 text-slate-500 hover:text-slate-900 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-slate-100">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const q = mobileQuery.trim()
                    setOpen(false)
                    router.push(`/${countryCode}/cars${q ? `?query=${encodeURIComponent(q)}` : ""}`)
                  }}
                  className="relative"
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="search"
                    value={mobileQuery}
                    onChange={(e) => setMobileQuery(e.target.value)}
                    placeholder="Search cars..."
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </form>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto py-2">
                <nav className="px-2 space-y-1">
                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        pathname === l.href || pathname.startsWith(`${l.href}/`)
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {l.label}
                      <ChevronRight size={16} className="opacity-50" />
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                {customer ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white border border-slate-200 text-red-600 font-medium text-sm hover:bg-red-50 hover:border-red-100 transition-colors"
                  >
                    <LogOut size={18} />
                    Sign out
                  </button>
                ) : (
                  <Link
                    href={`/${countryCode}/account`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    <User size={18} />
                    Login / Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  )
}
