import { Metadata } from "next"
import { listCars, getCarFilterOptions } from "@lib/data/cars"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { readdir } from "fs/promises"
import path from "path"
import BrandLetterNav from "@modules/brands/components/brand-letter-nav"

export const metadata: Metadata = {
  title: "Explore Premium Brands | GoGaddi",
  description: "Discover the world's finest automotive brands in our curated directory.",
}

/** Static list so the page always has a good set of brands even if DB has few */
const FALLBACK_BRANDS = [
  "Audi",
  "BMW",
  "Bentley",
  "Chevrolet",
  "Ford",
  "Honda",
  "Hyundai",
  "Jeep",
  "Jaguar",
  "Kia",
  "Land Rover",
  "Mahindra",
  "Maruti Suzuki",
  "MG",
  "Mazda",
  "Mercedes-Benz",
  "Nissan",
  "Renault",
  "Skoda",
  "Tata",
  "Toyota",
  "Volkswagen",
  "Volvo",
]

const LOGO_OVERRIDES_BY_BRAND_KEY: Record<string, string> = {
  // Filenames in your folder don’t always match brand spelling
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

  // Collapse duplicate consecutive words (e.g. "mahindra mahindra" -> "mahindra")
  const parts = normalized.split(" ").filter(Boolean)
  const collapsed: string[] = []
  for (const p of parts) {
    if (collapsed[collapsed.length - 1] === p) continue
    collapsed.push(p)
  }
  // If still exactly two identical words, collapse them.
  if (collapsed.length === 2 && collapsed[0] === collapsed[1]) {
    return collapsed[0]
  }
  return collapsed.join(" ")
}

function filenameToBrandKey(filename: string) {
  const base = filename
    .replace(/\.(svg|png|jpe?g|webp)$/i, "")
    .replace(/-\d+$/g, "") // e.g. audi-12 -> audi
    .replace(/logo$/i, "")
    .replace(/automobiles$/i, "")
    .replace(/cars$/i, "")
    .replace(/in$/i, "") // land-roverin -> land-rover
  return normalizeBrandKey(base)
}

// Collapse noisy brand strings like "Maruti Suzuki Swift LXI" into a clean
// brand label such as "Maruti Suzuki".
function canonicalBrandName(name: string): string {
  const clean = name.trim()
  if (!clean) return name
  const parts = clean.split(/\s+/)
  if (parts.length <= 2) return clean
  return `${parts[0]} ${parts[1]}`
}

async function getBrandLogoMapFromPublic(): Promise<Record<string, string>> {
  try {
    const dir = path.join(process.cwd(), "public", "brands-logo")
    const files = await readdir(dir)
    const allowed = files.filter((f) => /\.(svg|png|jpe?g|webp)$/i.test(f))
    const map: Record<string, string> = {}
    for (const file of allowed) {
      const key = filenameToBrandKey(file)
      if (!key) continue
      // Don’t overwrite an existing (first wins)
      if (!map[key]) {
        map[key] = `/brands-logo/${file}`
      }
    }
    return map
  } catch {
    return {}
  }
}

function BrandLogo({
  name,
  logoMap,
}: {
  name: string
  logoMap: Record<string, string>
}) {
  const key = normalizeBrandKey(name)
  const logoSrc = LOGO_OVERRIDES_BY_BRAND_KEY[key] ?? logoMap[key] ?? null

  return (
    <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
      {logoSrc ? (
        <Image
          src={logoSrc}
          alt={`${name} logo`}
          fill
          className="object-contain p-2 filter grayscale group-hover:grayscale-0 transition-all duration-500"
          sizes="80px"
        />
      ) : (
        <span className="text-2xl font-black text-slate-200 group-hover:text-blue-500 transition-colors">
          {name.charAt(0)}
        </span>
      )}
    </div>
  )
}

export default async function BrandsPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const { cars } = await listCars(countryCode)
  const { brands: apiBrands } = await getCarFilterOptions(cars)
  const logoMap = await getBrandLogoMapFromPublic()

  const allBrandNames = Array.from(
    new Set([
      ...apiBrands.map(canonicalBrandName),
      ...FALLBACK_BRANDS,
    ].filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "en"))

  const byLetter = allBrandNames.reduce<Record<string, string[]>>((acc, name) => {
    const letter = name.charAt(0).toUpperCase()
    if (!/^[A-Z]$/.test(letter)) return acc
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(name)
    return acc
  }, {})

  const letters = Object.keys(byLetter).sort()

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 selection:bg-blue-100">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]" />
        </div>

        <div className="content-container relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
            The{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              Brand
            </span>{" "}
            Directory
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg font-light">
            Browse through our curated selection of automotive excellence, from
            daily drivers to luxury performance.
          </p>
        </div>
      </div>

      <div className="content-container py-12 flex flex-col md:flex-row gap-12">
        {/* Sticky Sidebar Navigation (scroll spy) */}
        <BrandLetterNav letters={letters} />

        <main className="flex-1">
          {/* Breadcrumb - Subtle & Clean */}
          <nav className="mb-12 flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-slate-400">
            <LocalizedClientLink href="/" className="hover:text-blue-600">
              Home
            </LocalizedClientLink>
            <span>/</span>
            <span className="text-slate-900">Brands</span>
          </nav>

          {/* Dynamic Grid Sections */}
          <div className="space-y-24">
            {letters.map((letter) => (
              <section key={letter} id={`section-${letter}`} className="relative group">
                <div className="flex items-center gap-6 mb-8">
                  <h2 className="text-5xl font-black text-slate-100 group-hover:text-blue-50 transition-colors duration-500 absolute -left-12 -top-6 -z-10 select-none">
                    {letter}
                  </h2>
                  <div className="h-px flex-1 bg-slate-100 group-hover:bg-blue-100 transition-colors" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {byLetter[letter].map((brandName) => (
                    <LocalizedClientLink
                      key={brandName}
                      href={`/cars?brand=${encodeURIComponent(brandName)}`}
                      className="group relative bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                    >
                      {/* Hover Accent */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="flex flex-col items-center text-center gap-4">
                        <BrandLogo name={brandName} logoMap={logoMap} />
                        <span className="text-sm font-semibold tracking-wide text-slate-700 group-hover:text-blue-600 uppercase transition-colors">
                          {brandName}
                        </span>
                      </div>
                    </LocalizedClientLink>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>

      {/* Modern Footer Link */}
      <footer className="bg-slate-50 border-t border-slate-100 py-12 mt-20">
        <div className="content-container text-center">
          <LocalizedClientLink
            href="/"
            className="group inline-flex items-center gap-3 text-slate-500 hover:text-blue-600 font-bold text-sm uppercase tracking-tighter transition-all"
          >
            <span className="w-8 h-[1px] bg-slate-300 group-hover:bg-blue-600 transition-all" />
            Back to Showroom
          </LocalizedClientLink>
        </div>
      </footer>
    </div>
  )
}
