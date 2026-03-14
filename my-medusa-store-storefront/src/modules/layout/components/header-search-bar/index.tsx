"use client"

import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export default function HeaderSearchBar() {
  const router = useRouter()
  const pathname = usePathname() || ""
  const searchParams = useSearchParams()
  const { countryCode } = useParams() as { countryCode: string }
  const isOnCarsPage = pathname.includes("/cars")
  const queryFromUrl = isOnCarsPage ? (searchParams.get("query") ?? "") : ""
  const [query, setQuery] = useState(queryFromUrl)

  useEffect(() => {
    setQuery(queryFromUrl)
  }, [queryFromUrl])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const q = (query ?? "").trim()
      const params = new URLSearchParams()
      if (q) params.set("query", q)
      router.push(`/${countryCode}/cars${params.toString() ? `?${params.toString()}` : ""}`)
    },
    [countryCode, query, router]
  )

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-md mx-2 md:mx-4" role="search">
      <label htmlFor="header-search" className="sr-only">
        Search cars by name, brand, model
      </label>
      <div className="relative">
        <input
          id="header-search"
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cars, brand, model..."
          className="w-full h-10 pl-4 pr-10 rounded-xl border border-slate-200 bg-white/90 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
          aria-label="Search cars"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          aria-label="Search"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  )
}
