import { Metadata } from "next"
import { motion } from "framer-motion"
import { CheckCircle2, Target, Globe2, ShieldCheck, Sparkles, BarChart3, HelpCircle, Newspaper } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "About Us | GoGaddi",
  description: "Discover the story behind GoGaddi.com — India's premier digital automotive marketplace for buying and selling cars.",
}

const BENEFIT_ICONS = [
  <Globe2 key="1" className="w-6 h-6 text-blue-500" />,
  <Sparkles key="2" className="w-6 h-6 text-blue-500" />,
  <BarChart3 key="3" className="w-6 h-6 text-blue-500" />,
  <ShieldCheck key="4" className="w-6 h-6 text-blue-500" />,
  <CheckCircle2 key="5" className="w-6 h-6 text-blue-500" />,
  <Newspaper key="6" className="w-6 h-6 text-blue-500" />,
  <Target key="7" className="w-6 h-6 text-blue-500" />,
  <HelpCircle key="8" className="w-6 h-6 text-blue-500" />,
]

const BENEFITS = [
  "Largest selection of vehicle inventory from dealers and private sellers.",
  "Comprehensive selection of professional buying and selling tips.",
  "Research and compare tools, including reviews, photos, and high-res videos.",
  "Transparent vehicle pricing with dealer discounts and seller specials.",
  "Verified safety information and comprehensive vehicle history reports.",
  "Authentic, real-time automotive news delivered at lightning speed.",
  "Our mission: Convenience for buyers and maximum value for sellers.",
  "End-to-end help with finance, insurance, and warranty programs.",
]

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Premium Hero Section ── */}
      <section className="relative py-20 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600 via-transparent to-transparent" />
        <div className="content-container relative z-10">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-500 mb-6">
            <LocalizedClientLink href="/" className="hover:text-white transition-colors">Home</LocalizedClientLink>
            <span className="text-slate-700">/</span>
            <span className="text-slate-400">Our Story</span>
          </nav>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            We are <span className="text-blue-600 italic">GoGaddi.</span>
          </h1>
          <p className="max-w-2xl text-xl text-slate-400 font-light leading-relaxed">
            Redefining the automotive landscape in India through transparency, 
            technology, and a relentless focus on the car shopper&apos;s journey.
          </p>
        </div>
      </section>

      {/* ── Narrative Content ── */}
      <section className="content-container py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Our Purpose</span>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-8">
                The ultimate online solution for the modern car owner.
              </h2>
              <div className="p-8 rounded-[2rem] bg-blue-50 border border-blue-100">
                <p className="text-blue-900 font-medium italic leading-relaxed">
                  &quot;Our expert views and reviews of upcoming models act as a 
                  guiding light, ensuring you choose the best option for your budget 
                  and your lifestyle.&quot;
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <p className="text-lg text-slate-600 leading-relaxed">
              Hello, and welcome to GoGaddi.com! We take immense pride in the ecosystem 
              we&apos;ve built—connecting passionate car shoppers with the most reputable 
              professionals in the automotive industry.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Our site is engineered to give you total control. From real-time global 
              auto sector updates to gripping local news, we keep our community members 
              at the forefront of the industry. Whether it&apos;s choosing your first car 
              or selling your tenth, we make the process effortless.
            </p>
            
            {/* ── Benefits Grid ── */}
            <div className="pt-12">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                The GoGaddi Advantage
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {BENEFITS.map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      {BENEFIT_ICONS[i]}
                    </div>
                    <div>
                      <p className="text-slate-700 text-sm leading-relaxed font-medium">
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Community Thank You ── */}
      <section className="bg-slate-50 py-24">
        <div className="content-container text-center max-w-3xl">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-xl shadow-blue-500/10">
            <Sparkles className="text-blue-600 w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-6">A Message to Our Community</h2>
          <p className="text-slate-500 text-lg leading-relaxed mb-10">
            To every reader, contributor, and partner who has been part of this journey: 
            thank you. Your support fuels our innovation and keeps us moving forward 
            every single day.
          </p>
          <LocalizedClientLink
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95"
          >
            ← Back to Marketplace
          </LocalizedClientLink>
        </div>
      </section>
    </div>
  )
}