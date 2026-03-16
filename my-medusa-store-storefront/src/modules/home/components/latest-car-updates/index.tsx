"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { NEWS_AND_EVENTS } from "data/news-events"
import { PLACEHOLDER_IMAGE_URL } from "@lib/constants/placeholder-image"
import { ArrowRight, Calendar } from "lucide-react"

const CAR_IMAGES_FROM_PUBLIC = [
  "/cars/peter-broomfield-m3m-lnR90uM-unsplash.jpg",
  "/cars/joshua-koblin-eqW1MPinEV4-unsplash.jpg",
  "/cars/olav-tvedt-6lSBynPRaAQ-unsplash.jpg",
]

export default function LatestCarUpdates() {
  const items = NEWS_AND_EVENTS.slice(0, 3)
  const main = items[0]
  const rest = items.slice(1)
  const mainImage = CAR_IMAGES_FROM_PUBLIC[0] ?? PLACEHOLDER_IMAGE_URL
  const restImages = [CAR_IMAGES_FROM_PUBLIC[1], CAR_IMAGES_FROM_PUBLIC[2]]

  if (!main) return null

  return (
    <section className="bg-white overflow-hidden">
      <div className="content-container">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-4 block"
            >
              The GoGaddi Journal
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              Latest <span className="text-slate-400">Updates.</span>
            </h2>
          </div>
          <LocalizedClientLink
            href="/news-events"
            className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-colors"
          >
            Explore All News
            <span className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300">
              <ArrowRight size={16} />
            </span>
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Featured Article (Bento Large) */}
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 group relative"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-slate-100">
              <Image
                src={mainImage}
                alt={main.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 700px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                <div className="flex items-center gap-3 text-blue-400 mb-4">
                  <Calendar size={14} />
                  <span className="text-xs font-bold uppercase tracking-widest">{main.date}</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
                  {main.title}
                </h3>
                <p className="text-slate-300 line-clamp-2 mb-6 max-w-lg font-light leading-relaxed">
                  {main.excerpt}
                </p>
                <LocalizedClientLink
                  href="/news-events"
                  className="inline-flex items-center gap-2 text-white font-black text-xs uppercase tracking-[0.2em] group/btn"
                >
                  Read Article 
                  <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
                </LocalizedClientLink>
              </div>
            </div>
          </motion.article>

          {/* Secondary Updates (Sidebar) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {rest.map((n, idx) => (
              <motion.article
                key={n.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative flex flex-col sm:flex-row gap-6 p-6 rounded-[2rem] border border-slate-100 hover:bg-slate-50 transition-colors duration-300"
              >
                <div className="relative w-full sm:w-32 h-32 shrink-0 overflow-hidden rounded-2xl bg-slate-200">
                  <Image
                    src={restImages[idx] ?? PLACEHOLDER_IMAGE_URL}
                    alt={n.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">
                    {n.date}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2">
                    {n.title}
                  </h4>
                  <LocalizedClientLink
                    href="/news-events"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 flex items-center gap-2 transition-colors"
                  >
                    Quick Read <ArrowRight size={12} />
                  </LocalizedClientLink>
                </div>
              </motion.article>
            ))}

            {/* Premium "Join the Newsletter" CTA */}
            <div className="mt-auto p-8 rounded-[2rem] bg-slate-950 relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/40 transition-all duration-700" />
               <h5 className="text-white font-bold mb-2">Stay in the loop</h5>
               <p className="text-slate-400 text-xs leading-relaxed mb-4">
                 Get the latest automotive news and exclusive deals delivered to your inbox.
               </p>
               <div className="flex gap-2">
                 <input 
                  type="email" 
                  placeholder="Email address" 
                  className="bg-slate-900 border-none rounded-xl px-4 py-2 text-xs text-white outline-none ring-1 ring-slate-800 focus:ring-blue-600 flex-1 transition-all"
                 />
                 <button className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-colors">
                   <ArrowRight size={16} />
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}