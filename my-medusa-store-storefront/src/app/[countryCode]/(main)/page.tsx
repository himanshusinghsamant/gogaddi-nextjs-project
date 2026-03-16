import { listCars, getCarFilterOptions } from "@lib/data/cars"
import { Metadata } from "next"
import { Suspense } from "react"
import Image from "next/image"
import CarSearchBar from "@modules/cars/components/car-search-bar"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BrandLogoSlider, { BrandLogoItem } from "@modules/brands/components/brand-logo-slider"
import { readdir } from "fs/promises"
import path from "path"
import FeaturedCarsTabs from "@modules/home/components/featured-cars-tabs"
import FeaturedCarsSection from "@modules/home/components/featured-cars-section"
import LatestArrivals from "@modules/home/components/latest-arrivals"
import LatestCarUpdates from "@modules/home/components/latest-car-updates"
import HeroCarousel from "@modules/home/components/hero-carousel"
import HeroQuickFilters from "@modules/home/components/hero-quick-filters"
import WhyChooseUs from "@modules/home/components/why-choose-us"
import CTASection from "@modules/home/components/cta-section"
import HowItWorks from "@modules/home/components/how-it-works"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "GoGaddi — Premium Car Marketplace",
  description: "Experience the future of car buying. Verified premium cars, seamless financing, and doorstep delivery.",
}

/** Fallback brand names when API returns none (e.g. empty catalog). */
const FALLBACK_BRANDS = [
  "Maruti Suzuki",
  "Hyundai",
  "Honda",
  "Toyota",
  "Mahindra",
  "Tata",
  "Mercedes Benz",
  "BMW",
  "Audi"
]

const LOGO_OVERRIDES_BY_BRAND_KEY: Record<string, string> = {
  "land rover": "/brands-logo/land-roverin-logo.svg",
  "maruti suzuki": "/brands-logo/maruti-suzuki-logo-1.svg",
}

function normalizeBrandKey(input: string) {
  const normalized = input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[’'".()]/g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  const parts = normalized.split(" ").filter(Boolean)
  const collapsed: string[] = []
  for (const p of parts) {
    if (collapsed[collapsed.length - 1] === p) continue
    collapsed.push(p)
  }
  if (collapsed.length === 2 && collapsed[0] === collapsed[1]) return collapsed[0]
  return collapsed.join(" ")
}

function filenameToBrandKey(filename: string) {
  const base = filename
    .replace(/\.(svg|png|jpe?g|webp|avif)$/i, "")
    .replace(/-\d+$/g, "")
    .replace(/logo$/i, "")
    .replace(/automobiles$/i, "")
    .replace(/cars$/i, "")
    .replace(/in$/i, "")
  return normalizeBrandKey(base)
}

/** Map brand name -> image path from public/all-brands-car */
const BRAND_CAR_IMAGE_OVERRIDES: Record<string, string> = {
  "maruti suzuki": "suzuki.avif",
}

async function getBrandCarImages(brandNames: string[]): Promise<Record<string, string>> {
  const map: Record<string, string> = {}
  try {
    const dir = path.join(process.cwd(), "public", "all-brands-car")
    const files = await readdir(dir)
    const allowed = files.filter((f) => /\.(svg|png|jpe?g|webp|avif)$/i.test(f))

    for (const name of brandNames) {
      const key = normalizeBrandKey(name)
      const override = BRAND_CAR_IMAGE_OVERRIDES[key]
      if (override && allowed.includes(override)) {
        map[name] = `/all-brands-car/${override}`
        continue
      }
      const fileKey = key.split(" ").pop() ?? key
      const matched = allowed.find((f) => {
        const fKey = filenameToBrandKey(f)
        return fKey === fileKey || key === fKey || key.includes(fKey) || fKey.includes(fileKey)
      })
      if (matched) map[name] = `/all-brands-car/${matched}`
    }
  } catch {
    // ignore
  }
  return map
}

function titleCaseFromKey(key: string) {
  return key
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

async function getBrandLogoItems(brandNames: string[]): Promise<BrandLogoItem[]> {
  try {
    const dir = path.join(process.cwd(), "public", "brands-logo")
    const files = await readdir(dir)
    const allowed = files.filter((f) => /\.(svg|png|jpe?g|webp)$/i.test(f))

    const nameByKey = new Map<string, string>()
    for (const name of brandNames) {
      nameByKey.set(normalizeBrandKey(name), name)
    }

    const seen = new Set<string>()
    const out: BrandLogoItem[] = []
    for (const file of allowed) {
      const key = filenameToBrandKey(file)
      if (!key) continue
      const name =
        nameByKey.get(key) ??
        (key === "mercedes benz" ? "Mercedes-Benz" : titleCaseFromKey(key))
      const src = LOGO_OVERRIDES_BY_BRAND_KEY[key] ?? `/brands-logo/${file}`
      const unique = `${name}|${src}`
      if (seen.has(unique)) continue
      seen.add(unique)
      out.push({ name, src })
    }
    return out.sort((a, b) => a.name.localeCompare(b.name, "en"))
  } catch {
    return []
  }
}

export default async function HomePage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const { cars } = await listCars(countryCode)
  const filterOptions = await getCarFilterOptions(cars)
  const brands = filterOptions.brands.length > 0 ? filterOptions.brands : FALLBACK_BRANDS
  const brandLogoItems = await getBrandLogoItems(brands)
  const brandCarImages = await getBrandCarImages(brands)

  const featuredCars = cars.slice(0, 8)
  const latestCars = [...cars].sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0)).slice(0, 4)
  const featuredTabs = {
    featured: cars.slice(0, 3),
    newest: [...cars].sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0)).slice(0, 3),
    moreListings: cars.slice(3, 6),
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ── Hero (carousel) ───────────────────────────────────────────────── */}
      <HeroCarousel>
        <div className="relative w-full z-20 flex flex-col justify-center">
          <div className="w-full md:pt-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-medium uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Premium Auto Marketplace
            </div>
            
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.1] text-white tracking-tight">
              Drive the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">Extraordinary</span>
            </h1>
            
            <p className="text-blue-100/80 text-lg md:text-xl font-light max-w-xl mb-6 leading-relaxed">
              Discover a curated collection of verified premium vehicles. 
              Buy, sell, and upgrade with complete confidence.
            </p>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl max-w-3xl shadow-2xl">
              <HeroQuickFilters />
              <div className="mt-6">
                <Suspense>
                  <CarSearchBar
                    brands={filterOptions.brands}
                    fuelTypes={filterOptions.fuelTypes}
                    cities={filterOptions.cities}
                  />
                </Suspense>
              </div>
            </div>

            <div className="flex gap-12 mt-5 border-t border-white/10 pt-5 max-w-2xl">
              {[
                { value: `${cars.length}+`, label: "Premium Cars" },
                { value: `${filterOptions.brands.length}+`, label: "Global Brands" },
                { value: "100%", label: "Quality Verified" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-3xl md:text-4xl font-bold text-white mb-1">{s.value}</p>
                  <p className="text-blue-200/60 text-sm uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </HeroCarousel>

      {/* ── Popular Brands ───────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="content-container">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-6 md:mb-12 gap-4">
            <div className="w-full md:w-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Explore by Brand</h2>
              <p className="text-gray-500">Discover vehicles from the world's most prestigious manufacturers.</p>
            </div>
            {/* Desktop link */}
            <LocalizedClientLink
              href="/brands"
              className="hidden md:inline-flex items-center gap-1.5 text-blue-600 font-semibold hover:text-blue-700 hover:underline whitespace-nowrap"
            >
              <span>View all brands</span>
              <ArrowRight size={16} className="translate-x-0 group-hover:translate-x-0.5 transition-transform" />
            </LocalizedClientLink>
          </div>
          {/* Mobile primary CTA */}
          <div className="mb-10 md:hidden">
            <LocalizedClientLink
              href="/brands"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.99] transition"
            >
              <span>View all brands</span>
              <ArrowRight size={16} className="opacity-80" />
            </LocalizedClientLink>
          </div>

          {/* Full-width logo slider */}
          {brandLogoItems.length > 0 && (
            <div className="mb-16">
              <BrandLogoSlider items={brandLogoItems} />
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {brands.slice(0, 8).map((brandName) => {
              const imageSrc = brandCarImages[brandName]
              return (
                <LocalizedClientLink
                  key={brandName}
                  href={`/cars?brand=${encodeURIComponent(brandName)}`}
                  className="group relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 p-4 flex flex-col items-center justify-center z-10">
                    {imageSrc ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={imageSrc}
                          alt={`${brandName} car`}
                          fill
                          className="object-contain group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100px, 150px"
                        />
                      </div>
                    ) : (
                      <span className="text-4xl font-black text-gray-200 group-hover:text-blue-100 transition-colors">
                        {brandName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/90 backdrop-blur-sm border-t border-gray-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                    <p className="text-center text-xs font-bold text-gray-900 uppercase tracking-wider">{brandName}</p>
                  </div>
                </LocalizedClientLink>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Cars Tabs ───────────────────────────────────────────── */}
      <section className="py-10 md:py-16 bg-gray-50">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Curated For You</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Handpicked selections from our premium inventory, inspected for quality and performance.
            </p>
          </div>
          <FeaturedCarsTabs
            featured={featuredTabs.featured}
            newest={featuredTabs.newest}
            moreListings={featuredTabs.moreListings}
          />
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <div className="py-10 md:py-16 bg-white">
        <HowItWorks />
      </div>

      {/* ── Featured Cars Grid ───────────────────────────────────────────── */}
      {featuredCars.length > 0 && (
        <section className="py-10 md:py-16 bg-white">
          <div className="content-container">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-3xl font-bold text-gray-900 w-full md:w-auto">Trending Now</h2>
              {/* Desktop link */}
              <LocalizedClientLink
                href="/cars"
                className="hidden md:inline-flex items-center gap-1.5 text-blue-600 font-semibold hover:text-blue-700 hover:underline whitespace-nowrap"
              >
                <span>View inventory</span>
                <ArrowRight size={16} className="translate-x-0 group-hover:translate-x-0.5 transition-transform" />
              </LocalizedClientLink>
            </div>
            {/* Mobile primary CTA */}
            <div className="mt-4 md:hidden">
              <LocalizedClientLink
                href="/cars"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.99] transition"
              >
                <span>View inventory</span>
                <ArrowRight size={16} className="opacity-80" />
              </LocalizedClientLink>
            </div>
            <FeaturedCarsSection featuredCars={featuredCars} />
          </div>
        </section>
      )}

      {/* ── Why Choose Us ────────────────────────────────────────────────── */}
      <div className="py-10 md:py-16">
        <WhyChooseUs />
      </div>

      {/* ── Latest Arrivals ──────────────────────────────────────────────── */}
      {latestCars.length > 0 && (
        <section className="py-10 md:py-16 bg-gray-50">
          <div className="content-container">
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-bold text-gray-900">Just Arrived</h2>
            </div>
            <LatestArrivals latestCars={latestCars} />
          </div>
        </section>
      )}

      {/* ── Latest Updates ───────────────────────────────────────────────── */}
      <div className="bg-gray-50 py-10 md:py-16">
        <LatestCarUpdates />
      </div>

      {/* ── CTA Band ─────────────────────────────────────────────────────── */}
      <CTASection />
    </div>
  )
}
