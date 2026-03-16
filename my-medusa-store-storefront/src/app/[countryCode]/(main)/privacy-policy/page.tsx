"use client"

import React from "react"
import { motion } from "framer-motion"
import { Shield, Eye, Lock, FileText, Share2, RefreshCcw, UserCheck, ArrowLeft } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const POLICY_SECTIONS = [
  { id: "collection", title: "Information Collection", icon: <Eye size={18} /> },
  { id: "registration", title: "Registration & Usage", icon: <UserCheck size={18} /> },
  { id: "sharing", title: "Data Sharing", icon: <Share2 size={18} /> },
  { id: "updates", title: "Access & Updates", icon: <RefreshCcw size={18} /> },
  { id: "rights", title: "Your Rights", icon: <Lock size={18} /> },
]

export default function PrivacyPolicyPage() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ── */}
      <section className="bg-slate-50 border-b border-slate-200 py-16 md:py-20">
        <div className="content-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
                <Shield size={14} /> Security & Trust
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">
                Privacy <span className="text-slate-400">Policy.</span>
              </h1>
              <p className="text-slate-500 font-medium leading-relaxed">
                Last Updated: March 2026. We take your privacy seriously. This policy 
                outlines how we process and protect your personal data at GoGaddi.
              </p>
            </div>
            <div className="hidden lg:block">
               <div className="px-6 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Lock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                    <p className="text-sm font-bold text-slate-900">GDPR Compliant</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <div className="content-container py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* ── Floating Navigation (Desktop) ── */}
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-24 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 ml-4">Contents</p>
              {POLICY_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all text-left group"
                >
                  <span className="text-slate-300 group-hover:text-blue-500 transition-colors">{section.icon}</span>
                  {section.title}
                </button>
              ))}
            </div>
          </aside>

          {/* ── Legal Content ── */}
          <main className="lg:col-span-9 max-w-3xl">
            <div className="prose prose-slate prose-blue max-w-none">
              
              <p className="text-lg text-slate-600 leading-relaxed mb-12">
                GoGaddi.com takes your privacy seriously and is committed to protecting it. 
                This policy sets out the basis on which any personal data we collect from you, 
                or that you provide to us, will be processed by us.
              </p>

              <PolicySection id="collection" title="Information we may collect from you">
                <p>We may collect and process the following data about you:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 list-none p-0">
                  <ListItem text="Forms filled on our site" />
                  <ListItem text="Records of correspondence" />
                  <ListItem text="Transaction & order details" />
                  <ListItem text="Site visit & resource logs" />
                </ul>
              </PolicySection>

              <PolicySection id="registration" title="Registration and use of personal information">
                <p>
                  Registration is required to access premium features like car listings and 
                  community queries. We guarantee that your personally identifiable 
                  information will <strong>never be shared</strong> with third-party 
                  organizations without express consent.
                </p>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 my-6">
                  <h4 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
                    <Mail size={16} /> Marketing Opt-out
                  </h4>
                  <p className="text-blue-800/80 text-sm mb-0">
                    You can opt out of communications at any time by emailing 
                    <a href="mailto:info@gogaddi.com" className="text-blue-600 font-bold ml-1">info@gogaddi.com</a> 
                    or clicking unsubscribe in our newsletters.
                  </p>
                </div>
              </PolicySection>

              <PolicySection id="sharing" title="Link to third party sites">
                <p>We may share sensitive information without prior consent only under these limited circumstances:</p>
                <div className="space-y-4 my-6">
                  <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <span className="text-blue-600 font-black mr-2">A.</span>
                    Legal requirements by governmental agencies for identity verification or prosecution of offences.
                  </div>
                  <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <span className="text-blue-600 font-black mr-2">B.</span>
                    Internal processing within group companies under strict confidentiality and security measures.
                  </div>
                </div>
              </PolicySection>

              <PolicySection id="updates" title="Accessing and updating personal information">
                <p>
                  We strive to provide access to your data for correction or amendment. 
                  Requests for access are free of charge, though we may ask you to 
                  identify yourself to protect account security. 
                </p>
                <p className="text-sm text-slate-500 italic">
                  Note: Residual copies may remain in backup systems for a limited time 
                  due to standard maintenance practices.
                </p>
              </PolicySection>

              <PolicySection id="rights" title="Your rights">
                <p>
                  You have the right to prevent processing for marketing purposes. This can 
                  be managed via checkboxes on our collection forms or by contacting our 
                  data protection team directly.
                </p>
              </PolicySection>

              <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-center gap-6">
                 <LocalizedClientLink
                  href="/"
                  className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft size={16} /> Return to Home
                </LocalizedClientLink>
                {/* <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700">
                  <FileText size={16} /> Download as PDF
                </button> */}
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function PolicySection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <motion.section 
      id={id} 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-16 scroll-mt-24"
    >
      <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6 flex items-center gap-3">
        <div className="w-1 h-8 bg-blue-600 rounded-full" />
        {title}
      </h2>
      <div className="text-slate-600 leading-relaxed space-y-4">
        {children}
      </div>
    </motion.section>
  )
}

function ListItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="w-2 h-2 rounded-full bg-blue-500" />
      <span className="text-sm font-bold text-slate-700">{text}</span>
    </div>
  )
}

function Mail({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  )
}