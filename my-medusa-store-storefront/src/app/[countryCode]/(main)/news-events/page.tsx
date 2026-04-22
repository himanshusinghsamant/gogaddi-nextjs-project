"use client"

import React, { Suspense, useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { Calendar, ChevronLeft, ChevronRight, Search, TrendingUp } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { NEWS_AND_EVENTS } from "data/news-events"
import { PLACEHOLDER_IMAGE_URL } from "@lib/constants/placeholder-image"

/** Articles per page in the main feed (first item on page 1 is the featured hero, not counted here). */
const PAGE_SIZE = 6
/** Max page number buttons shown at once; Previous/Next jump by groups of this size (same pattern as inventory). */
const PAGINATION_WINDOW = 5

function buildNewsEventsHref(pageNum: number): string {
  if (pageNum < 2) return "/news-events"
  return `/news-events?page=${pageNum}`
}

const CAR_IMAGES_FROM_PUBLIC = [
  "/cars/peter-broomfield-m3m-lnR90uM-unsplash.jpg",
  "/cars/joshua-koblin-eqW1MPinEV4-unsplash.jpg",
  "/cars/olav-tvedt-6lSBynPRaAQ-unsplash.jpg",
  "/cars/pexels-pixabay-248704.jpg",
  "/cars/pexels-orestsv-2062555.jpg",
  "/cars/pexels-lalesh-168938.jpg",
  "/cars/stephan-louis-mN8H_fe040Y-unsplash.jpg",
  "/cars/pexels-alexgtacar-745150-1592384.jpg",
  "/cars/pexels-bertellifotografia-3007436.jpg",
  "/cars/pexels-vladalex94-1402787.jpg",
]

function getCarImageForIndex(index: number): string {
  return CAR_IMAGES_FROM_PUBLIC[index % CAR_IMAGES_FROM_PUBLIC.length] ?? PLACEHOLDER_IMAGE_URL
}

type UiNewsItem = {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  image?: string | null
}

function formatDate(value: string): string {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value || "—"
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
}

function mapStrapiNewsToUiItems(raw: any): UiNewsItem[] {
  const list = Array.isArray(raw?.data) ? raw.data : []
  return list
    .map((item: any) => {
      const attrs = item?.attributes ?? item
      const id = item?.id ?? item?.documentId
      const title = attrs?.title
      const slug = attrs?.slug
      if (!id || !title || !slug) return null
      const media = attrs?.coverImage
      const url = media?.data?.attributes?.url ?? media?.url ?? null
      const base = process.env.NEXT_PUBLIC_STRAPI_URL || ""
      const image =
        typeof url === "string"
          ? /^https?:\/\//i.test(url)
            ? url
            : `${base.replace(/\/$/, "")}${url.startsWith("/") ? "" : "/"}${url}`
          : null

      return {
        id: String(id),
        slug: String(slug),
        title: String(title),
        excerpt: String(attrs?.excerpt ?? ""),
        date: formatDate(String(attrs?.publishedAt ?? "")),
        image,
      } satisfies UiNewsItem
    })
    .filter(Boolean) as UiNewsItem[]
}

function NewsAndEventsPageContent() {
  const searchParams = useSearchParams()
  const [items, setItems] = useState<UiNewsItem[]>(() => [...NEWS_AND_EVENTS])
  const [searchQuery, setSearchQuery] = useState("")


  console.log("items ------>", items)

  const filteredItems = items.filter((item) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return (
      item.title.toLowerCase().includes(q) ||
      item.excerpt.toLowerCase().includes(q)
    )
  })

  const listCount = Math.max(0, filteredItems.length - 1)
  const totalPages = Math.max(1, Math.ceil(listCount / PAGE_SIZE))
  const rawPage = Number(searchParams.get("page")) || 1
  const page = Math.min(Math.max(1, rawPage), totalPages)

  const featuredNews = page === 1 ? filteredItems[0] : undefined
  const feedStart = 1 + (page - 1) * PAGE_SIZE
  const paginatedFeed = filteredItems.slice(feedStart, feedStart + PAGE_SIZE)
  const recentNews = filteredItems.slice(1, 7)
  const featuredImage = featuredNews?.image || getCarImageForIndex(0)

  const windowStart = Math.floor((page - 1) / PAGINATION_WINDOW) * PAGINATION_WINDOW + 1
  const windowEnd = Math.min(windowStart + PAGINATION_WINDOW - 1, totalPages)
  const prevGroupPage = windowStart > 1 ? windowStart - 1 : null
  const nextGroupPage = windowEnd < totalPages ? windowEnd + 1 : null

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_STRAPI_URL
    if (!base) return
    fetch(`${base.replace(/\/$/, "")}/api/news-items?populate=*&sort[0]=publishedAt:desc`)
      .then(async (res) => {
        if (!res.ok) return
        const body = await res.json().catch(() => null)
        const mapped = mapStrapiNewsToUiItems(body)
        if (mapped.length) setItems(mapped)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="content-container py-4 flex flex-wrap items-center justify-between gap-6">
          <div>
            <nav className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">
              Automotive Journal
            </nav>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
              News & <span className="text-slate-400">Events.</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search articles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="content-container py-10">
        {/* ── Featured Hero Article ── */}
        {featuredNews && (
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative rounded-[2.5rem] overflow-hidden bg-slate-900 mb-16 aspect-[16/9] md:aspect-[21/9]"
          >
            <Image
              src={featuredImage}
              alt={featuredNews.title}
              fill
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-0 p-8 md:p-16 max-w-3xl">
              <div className="flex items-center gap-3 text-blue-400 mb-4 font-bold text-xs uppercase tracking-widest">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px]">Hot Topic</span>
                <Calendar size={14} />
                {featuredNews.date}
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-6 leading-tight">
                {featuredNews.title}
              </h2>
              <LocalizedClientLink
                href={`/news-events/${featuredNews.slug}`}
                className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-white text-slate-950 font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
              >
                Read Featured Story <ChevronRight size={16} />
              </LocalizedClientLink>
            </div>
          </motion.article>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ── Main Feed ── */}
          <main className="lg:col-span-8 space-y-12">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
              <TrendingUp size={16} /> Latest Stories
            </h3>
            
            <div className="grid grid-cols-1 gap-12">
              {paginatedFeed.map((item, idx) => {
                const imageIdx = feedStart + idx
                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group flex flex-col md:flex-row gap-8"
                  >
                    <div className="relative w-full md:w-72 aspect-[4/3] shrink-0">
                      <Image
                        src={item.image || getCarImageForIndex(imageIdx)}
                        alt={item.title}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex flex-col justify-center py-2">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Calendar size={12} /> {item.date}
                      </span>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h2>
                      <p className="text-slate-500 line-clamp-3 text-sm leading-relaxed mb-6 font-medium">
                        {item.excerpt}
                      </p>
                      <LocalizedClientLink
                        href={`/news-events/${item.slug}`}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-950 flex items-center gap-2 transition-all"
                      >
                        Continue Reading{" "}
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </LocalizedClientLink>
                    </div>
                  </motion.article>
                )
              })}
              {filteredItems.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                  No news articles match your search.
                </div>
              )}
              {filteredItems.length > 0 && paginatedFeed.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                  No more stories on this page.
                </div>
              )}
            </div>

            {totalPages > 1 && filteredItems.length > 1 && (
              <nav
                className="mt-16 flex flex-col items-center gap-4"
                aria-label="News pagination"
              >
                <p className="text-xs font-semibold text-slate-500 tabular-nums">
                  Page {page} of {totalPages}
                  {totalPages > PAGINATION_WINDOW ? (
                    <span className="text-slate-400 font-medium">
                      {" "}
                      · Pages {windowStart}–{windowEnd}
                    </span>
                  ) : null}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  {prevGroupPage != null ? (
                    <LocalizedClientLink
                      href={buildNewsEventsHref(prevGroupPage)}
                      className="inline-flex items-center gap-1.5 min-h-12 px-4 rounded-xl text-sm font-bold border border-slate-200 bg-white text-slate-800 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                      aria-label={`Previous pages (go to page ${prevGroupPage})`}
                    >
                      <ChevronLeft size={18} strokeWidth={2.25} aria-hidden />
                      Previous
                    </LocalizedClientLink>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1.5 min-h-12 px-4 rounded-xl text-sm font-bold border border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed select-none"
                      aria-disabled="true"
                    >
                      <ChevronLeft size={18} strokeWidth={2.25} aria-hidden />
                      Previous
                    </span>
                  )}

                  <div
                    className="flex flex-wrap items-center justify-center gap-2"
                    role="group"
                    aria-label={`Page numbers ${windowStart} to ${windowEnd}`}
                  >
                    {Array.from({ length: windowEnd - windowStart + 1 }, (_, i) => windowStart + i).map(
                      (p) => {
                        const isCurrent = p === page
                        return (
                          <LocalizedClientLink
                            key={p}
                            href={buildNewsEventsHref(p)}
                            className={`
                                min-w-12 h-12 px-2 flex items-center justify-center rounded-xl text-sm font-bold transition-all tabular-nums
                                ${
                                  isCurrent
                                    ? "bg-slate-900 text-white shadow-lg ring-2 ring-slate-900/10 scale-105"
                                    : "bg-white text-slate-600 border border-slate-200 hover:border-blue-500 hover:text-blue-600"
                                }
                              `}
                            aria-current={isCurrent ? "page" : undefined}
                          >
                            {p}
                          </LocalizedClientLink>
                        )
                      }
                    )}
                  </div>

                  {nextGroupPage != null ? (
                    <LocalizedClientLink
                      href={buildNewsEventsHref(nextGroupPage)}
                      className="inline-flex items-center gap-1.5 min-h-12 px-4 rounded-xl text-sm font-bold border border-slate-200 bg-white text-slate-800 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                      aria-label={`Next pages (go to page ${nextGroupPage})`}
                    >
                      Next
                      <ChevronRight size={18} strokeWidth={2.25} aria-hidden />
                    </LocalizedClientLink>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1.5 min-h-12 px-4 rounded-xl text-sm font-bold border border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed select-none"
                      aria-disabled="true"
                    >
                      Next
                      <ChevronRight size={18} strokeWidth={2.25} aria-hidden />
                    </span>
                  )}
                </div>
              </nav>
            )}
          </main>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-4 space-y-10">
            {/* Trending Section */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Must Read</h4>
              <div className="space-y-8">
                {recentNews.map((n, idx) => (
                  <LocalizedClientLink key={n.id} href={`/news-events/${n.slug}`} className="group flex gap-4">
                    <div className="w-16 h-16 shrink-0 relative">
                       <Image
                         src={n.image || getCarImageForIndex(idx + 1)}
                         alt={n.title}
                         fill
                         className="object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all"
                       />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{n.date}</span>
                      <h5 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {n.title}
                      </h5>
                    </div>
                  </LocalizedClientLink>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function NewsEventsPageFallback() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="bg-white border-b border-slate-200">
        <div className="content-container py-4">
          <div className="h-8 w-48 rounded-lg bg-slate-100 animate-pulse" />
        </div>
      </div>
      <div className="content-container py-10">
        <div className="rounded-[2.5rem] bg-slate-200 aspect-[16/9] max-w-4xl animate-pulse mb-16" />
        <div className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
      </div>
    </div>
  )
}

export default function NewsAndEventsPage() {
  return (
    <Suspense fallback={<NewsEventsPageFallback />}>
      <NewsAndEventsPageContent />
    </Suspense>
  )
}