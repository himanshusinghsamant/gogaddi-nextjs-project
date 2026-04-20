"use client"

import React from "react"
import { motion } from "framer-motion"
import { Plus, Rocket, ArrowRight } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function CTASection() {
  return (
    <section className="content-container py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 px-8 py-16 md:py-20 text-center shadow-2xl shadow-blue-900/20"
      >
        {/* Animated Mesh Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
          >
            <Rocket size={12} />
            Quick Listing Process
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-tight">
            Ready to <span className="text-blue-500 italic">Sell Your Car?</span>
          </h2>

          <p className="text-slate-400 text-lg md:text-xl font-light mb-10 leading-relaxed">
            List your vehicle for free on India's most trusted platform and
            reach <span className="text-white font-medium">thousands of buyers</span> within minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LocalizedClientLink
              href="/sell-car"
              className="group relative inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-black px-10 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95 overflow-hidden"
            >
              {/* Shine effect on button */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

              <Plus size={20} className="text-blue-200" />
              <span className="relative inline md:hidden">Post Free</span>
              <span className="relative hidden md:inline">Post Your Car Free</span>
              <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/how-it-works"
              className="text-slate-400 hover:text-white font-bold text-sm transition-colors px-6 py-4"
            >
              How it works?
            </LocalizedClientLink>
          </div>
        </div>

        {/* Decorative corner element */}
        <div className="absolute top-8 right-8 text-slate-800/50 select-none hidden md:block">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H100V100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          </svg>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  )
}
