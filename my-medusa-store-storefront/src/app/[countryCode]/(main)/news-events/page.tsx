"use client"

import React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, ChevronRight, Search, TrendingUp } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { NEWS_AND_EVENTS } from "data/news-events"
import { PLACEHOLDER_IMAGE_URL } from "@lib/constants/placeholder-image"

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

export default function NewsAndEventsPage() {
  const [items, setItems] = useState<UiNewsItem[]>(() => [...NEWS_AND_EVENTS])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = items.filter((item) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return (
      item.title.toLowerCase().includes(q) ||
      item.excerpt.toLowerCase().includes(q)
    )
  })

  const featuredNews = filteredItems[0]
  const recentNews = filteredItems.slice(1, 7)
  const featuredImage = featuredNews?.image || getCarImageForIndex(0)
  const itemImages = filteredItems.map((item, idx) => item.image || getCarImageForIndex(idx))

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
              {filteredItems.map((item, idx) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group flex flex-col md:flex-row gap-8"
                >
                  <div className="relative w-full md:w-72 aspect-[4/3] shrink-0">
                    <Image
                      src={itemImages[idx] ?? PLACEHOLDER_IMAGE_URL}
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
                      Continue Reading <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </LocalizedClientLink>
                  </div>
                </motion.article>
              ))}
              {filteredItems.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                  No news articles match your search.
                </div>
              )}
            </div>
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