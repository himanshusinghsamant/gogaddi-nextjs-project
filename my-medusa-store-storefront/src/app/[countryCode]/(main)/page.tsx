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

export const metadata: Metadata = {
  title: "GoGaddi — Find Your Perfect Car",
  description: "Browse thousands of cars. Search, compare and find the best deal.",
}

/** Fallback brand names when API returns none (e.g. empty catalog). */
const FALLBACK_BRANDS = [
  "Maruti Suzuki",
  "Hyundai",
  "Honda",
  "Toyota",
  "Mahindra",
  "Tata",
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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* ── Hero (carousel) ───────────────────────────────────────────────── */}
      <HeroCarousel>
        <div className="relative content-container py-20 md:py-28 z-20">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-blue-300 font-semibold text-sm uppercase tracking-widest mb-3 drop-shadow-md">
              India's Trusted Car Marketplace
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-5 leading-tight text-white drop-shadow-lg">
              Find Your <span className="text-yellow-400">Perfect Car</span>
            </h1>
            <p className="text-blue-100 text-lg md:text-xl drop-shadow-md font-medium">
              Explore {cars.length}+ cars from top brands. Buy, sell and discover with confidence.
            </p>
          </div>

          <HeroQuickFilters />

          <Suspense>
            <CarSearchBar
              brands={filterOptions.brands}
              fuelTypes={filterOptions.fuelTypes}
              cities={filterOptions.cities}
            />
          </Suspense>

          <div className="flex flex-wrap justify-center gap-8 mt-10 text-center">
            {[
              { value: `${cars.length}+`, label: "Cars Listed" },
              { value: `${filterOptions.brands.length}+`, label: "Brands" },
              { value: "100%", label: "Verified" },
            ].map((s) => (
              <div key={s.label} className="backdrop-blur-sm bg-white/10 rounded-lg p-4 min-w-[120px]">
                <p className="text-3xl font-extrabold text-yellow-400 drop-shadow-md">{s.value}</p>
                <p className="text-white text-sm mt-1 font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </HeroCarousel>

      {/* ── Featured Cars + Latest Updates (as per reference) ─────────────── */}
      <div className="bg-white">
        <FeaturedCarsTabs
          featured={featuredTabs.featured}
          newest={featuredTabs.newest}
          moreListings={featuredTabs.moreListings}
        />
        <LatestCarUpdates />
      </div>

      {/* ── Popular Brands ───────────────────────────────────────────────── */}
      <section className="py-14">
        <div className="content-container flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Browse by Brand</h2>
            <p className="text-gray-500 text-sm mt-1">Find cars from verified sellers by brand</p>
          </div>
          <LocalizedClientLink href="/brands" className="text-blue-600 hover:underline text-sm font-medium">
            All brands →
          </LocalizedClientLink>
        </div>

        {/* Full-width logo slider (edge to edge, no overflow) */}
        {brandLogoItems.length > 0 && (
          <div className="w-full py-8 md:py-12 bg-gray-50/80">
            <BrandLogoSlider items={brandLogoItems} />
          </div>
        )}

        <div className="content-container mt-14 grid grid-cols-4 md:grid-cols-8 gap-3">
          {brands.slice(0, 8).map((brandName) => {
            const imageSrc = brandCarImages[brandName]
            return (
              <LocalizedClientLink
                key={brandName}
                href={`/cars?brand=${encodeURIComponent(brandName)}`}
                className="flex flex-col items-center gap-2 bg-white rounded-xl border border-gray-200 p-3 hover:border-blue-400 hover:shadow-md transition-all group overflow-hidden"
              >
                <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={`${brandName} car`}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 56px, 128px"
                      quality={95}
                      unoptimized={imageSrc.startsWith("/all-brands-car/")}
                    />
                  ) : (
                    <span className="text-xl font-bold text-gray-400">
                      {brandName.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                  {brandName}
                </span>
              </LocalizedClientLink>
            )
          })}
        </div>
      </section>

      {/* ── Featured Cars ────────────────────────────────────────────────── */}
      {featuredCars.length > 0 && <FeaturedCarsSection featuredCars={featuredCars} />}

      {/* ── Latest Cars ──────────────────────────────────────────────────── */}
      {latestCars.length > 0 && <LatestArrivals latestCars={latestCars} />}

      {/* ── Why Choose Us ────────────────────────────────────────────────── */}
      <WhyChooseUs />

      {/* ── CTA Band ─────────────────────────────────────────────────────── */}
      <CTASection />
    </div>
  )
}
