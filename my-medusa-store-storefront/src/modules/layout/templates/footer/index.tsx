"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Youtube, Send, ArrowUpRight, Loader2, Check } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Footer() {
  const year = new Date().getFullYear()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = email.trim()
    if (!value) {
      setStatus("error")
      setMessage("Please enter your email address.")
      return
    }
    setStatus("loading")
    setMessage("")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      })
      const data = (await res.json().catch(() => ({}))) as { message?: string }
      if (!res.ok) {
        setStatus("error")
        setMessage(data?.message ?? "Something went wrong. Please try again.")
        return
      }
      setStatus("success")
      setMessage(data?.message ?? "Thanks for subscribing!")
      setEmail("")
    } catch {
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
    }
  }

  const footerLinks = {
    buy: [
      { label: "All Cars", href: "/cars" },
      { label: "Find a Brand", href: "/brands" },
      { label: "Cars by City", href: "/cars" },
      { label: "Budget Cars", href: "/cars?priceMax=300000" },
      { label: "Luxury Cars", href: "/cars?priceMin=3000000" },
    ],
    sell: [
      { label: "Post Free Ad", href: "/sell-car" },
      { label: "My Listings", href: "/account/my-cars" },
      { label: "Seller Tips", href: "/sell-car" },
      { label: "Price Guide", href: "/cars" },
    ],
    company: [
      { label: "About Us", href: "/about-us" },
      { label: "News & Events", href: "/news-events" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  }

  const socials = [
    { icon: <Facebook size={18} />, href: "#", color: "hover:text-blue-500" },
    { icon: <Twitter size={18} />, href: "#", color: "hover:text-sky-400" },
    { icon: <Instagram size={18} />, href: "#", color: "hover:text-pink-500" },
    { icon: <Youtube size={18} />, href: "#", color: "hover:text-red-500" },
  ]

  return (
    <footer className="bg-[#050505] text-gray-400 border-t border-white/5">
      {/* Upper Footer: Newsletter & Brand */}
      <div className="content-container pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <LocalizedClientLink href="/" className="inline-block mb-6">
              <Image
                src="/gogaddi-logo.png"
                alt="GoGaddi"
                width={160}
                height={44}
                className="h-9 w-auto brightness-0 invert" // Ensures logo works on dark mode
              />
            </LocalizedClientLink>
            <p className="text-sm leading-relaxed max-w-sm mb-8 text-gray-500">
              Redefining the car marketplace in India. We provide a seamless, 
              transparent, and secure platform to buy and sell vehicles with total confidence.
            </p>
            <div className="flex gap-4">
              {socials.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ y: -3 }}
                  className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-colors duration-300 ${social.color} hover:bg-white/10`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            <FooterColumn title="Shop" links={footerLinks.buy} />
            <FooterColumn title="Sell" links={footerLinks.sell} />
            <FooterColumn title="Company" links={footerLinks.company} />
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.2em] mb-6">Stay Updated</h4>
            <p className="text-xs text-gray-500 mb-6">
              Get the latest car launches and market trends delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="relative group">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading" || status === "success"}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-4 pr-12 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 group-hover:border-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label="Email for newsletter"
                aria-invalid={status === "error"}
                aria-describedby={message ? "newsletter-message" : undefined}
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/70 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all duration-300"
                aria-label="Subscribe"
              >
                {status === "loading" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : status === "success" ? (
                  <Check size={16} />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </form>
            {message && (
              <p
                id="newsletter-message"
                className={`mt-3 text-sm ${status === "error" ? "text-red-400" : "text-emerald-400"}`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="content-container py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-[11px] font-medium tracking-wider uppercase">
            <p className="text-gray-600">© {year} GoGaddi Inc.</p>
            <span className="hidden md:block w-1 h-1 bg-white/10 rounded-full" />
            <LocalizedClientLink href="/sitemap" className="hover:text-white transition-colors">Sitemap</LocalizedClientLink>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-end">
            <LocalizedClientLink
              href="/sell-car"
              className="px-5 py-2.5 text-sm font-bold text-gray-900 bg-yellow-400 rounded-lg shadow-[0_4px_14px_0_rgba(250,204,21,0.39)] hover:bg-yellow-500 hover:shadow-[0_6px_20px_rgba(250,204,21,0.23)] transition-all duration-200 active:scale-95"
            >
              + Sell Car
            </LocalizedClientLink>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">System Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-white font-bold text-sm uppercase tracking-[0.2em] mb-6">{title}</h4>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.label}>
            <LocalizedClientLink 
              href={link.href} 
              className="text-sm flex items-center group text-gray-500 hover:text-white transition-colors duration-300"
            >
              {link.label}
              <ArrowUpRight size={12} className="ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
            </LocalizedClientLink>
          </li>
        ))}
      </ul>
    </div>
  )
}