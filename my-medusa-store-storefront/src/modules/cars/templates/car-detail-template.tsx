import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CarGallery from "@modules/cars/components/car-gallery"
import CarReviewForm from "@modules/cars/components/car-review-form"
import CarCard from "@modules/cars/components/car-card"
import SellerCard from "@modules/cars/components/seller-card"
import { submitCarReview } from "@lib/data/cars"
import { formatCarPrice, getVersionPrice } from "@lib/util/format-car-price"
import { filter_variants } from "@lib/util/car-variant-filters"
import type { CarDetail, CarListItem } from "@lib/data/cars"
import { ChevronRight, Home, MapPin, Phone, MessageCircle, ShieldCheck, Calendar, Gauge, Fuel } from "lucide-react"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Badge({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors group">
      <Icon size={20} className="text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="font-bold text-gray-900 text-sm text-center line-clamp-1">{value}</p>
    </div>
  )
}

function SpecsTable({ specs }: { specs: CarDetail["specifications"] }) {
  const byGroup = specs.reduce<Record<string, Array<{ name: string; value: string }>>>((acc, s) => {
    const g = s.spec_group || "General"
    if (!acc[g]) acc[g] = []
    acc[g].push({ name: s.spec_name, value: s.spec_value })
    return acc
  }, {})

  if (Object.keys(byGroup).length === 0) return null

  return (
    <div className="space-y-8">
      {Object.entries(byGroup).map(([group, rows]) => (
        <div key={group}>
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
            {group}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {rows.map((row, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-500 font-medium">{row.name}</span>
                <span className="text-sm font-bold text-gray-900 text-right">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}>★</span>
      ))}
    </div>
  )
}

function formatMetadataValue(value: unknown): string {
  if (value == null) return "—"
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value)
  if (Array.isArray(value))
    return value
      .map((v) => {
        if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v)
        if (v == null) return "—"
        return typeof v === "object" ? JSON.stringify(v) : String(v)
      })
      .join(", ")
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

// ─── Main Template ────────────────────────────────────────────────────────────

type CarDetailTemplateProps = {
  car: CarDetail
  variantIdFromUrl?: string
  /** When null, test drive booking is hidden and "Login to book" is shown. */
  customer?: { id: string } | null
  relatedCars?: CarListItem[]
}

export default function CarDetailTemplate({ car, variantIdFromUrl, customer, relatedCars }: CarDetailTemplateProps) {
  const versions = car.versions ?? []
  const filteredVersions = filter_variants(versions, car.variant_filters ?? null, car.handle)
  const variantList = car.variant_filters?.variants ?? []

  const selectedVariant =
    variantIdFromUrl && filteredVersions.length > 0
      ? filteredVersions.find((v) => v.id === variantIdFromUrl) ?? filteredVersions[0]
      : filteredVersions[0] ?? null

  const displayPrice = selectedVariant ? getVersionPrice(selectedVariant.prices) : null
  const displayPriceFormatted = displayPrice != null ? formatCarPrice(displayPrice) : formatCarPrice(car.price)

  // Booking CTA must follow the top-level metadata boolean (metadata.available).
  // Variant-level inventory should not override this button visibility.
  const selectedAvailability = Boolean(car.availability)
  const avgRating =
    (car.reviews?.length ?? 0) > 0
      ? car.reviews.reduce((a, r) => a + r.rating, 0) / car.reviews.length
      : null

  const images = [...(car.thumbnail ? [car.thumbnail] : []), ...(car.images ?? []).filter((img) => img !== car.thumbnail)]

  const quickSpecs = [
    car.fuel_type && { label: "Fuel Type", value: car.fuel_type, icon: Fuel },
    car.engine && { label: "Engine", value: car.engine, icon: Fuel },
    car.mileage && { label: "Mileage", value: car.mileage, icon: Gauge },
    car.transmission && { label: "Transmission", value: car.transmission, icon: Gauge },
    car.year && { label: "Year", value: car.year, icon: Calendar },
    car.km_driven && { label: "KM Driven", value: car.km_driven, icon: Gauge },
  ].filter(Boolean) as Array<{ label: string; value: string; icon: any }>

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 backdrop-blur-md bg-white/80">
        <div className="content-container py-4">
          <nav className="text-xs font-medium text-gray-500 flex items-center gap-2 uppercase tracking-wider">
            <LocalizedClientLink href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <Home size={14} /> Home
            </LocalizedClientLink>
            <ChevronRight size={14} />
            <LocalizedClientLink href="/cars" className="hover:text-blue-600 transition-colors">
              Inventory
            </LocalizedClientLink>
            {car.brand && (
              <>
                <ChevronRight size={14} />
                <LocalizedClientLink href={`/cars?brand=${encodeURIComponent(car.brand)}`} className="hover:text-blue-600 transition-colors">
                  {car.brand}
                </LocalizedClientLink>
              </>
            )}
            <ChevronRight size={14} />
            <span className="text-gray-900 font-bold line-clamp-1">{car.name}</span>
          </nav>
        </div>
      </div>

      <div className="content-container py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Gallery + Details (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Gallery */}
            <div className="rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
              <CarGallery images={images} name={car.name} />
            </div>

            {/* Quick specs badges */}
            {quickSpecs.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Overview</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {quickSpecs.map((spec) => (
                    <Badge key={spec.label} label={spec.label} value={spec.value} icon={spec.icon} />
                  ))}
                </div>
              </div>
            )}

            {/* Trims (trim list from metadata.variant_filters) */}
            {variantList.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Trims</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {variantList.map((v) => {
                    const isCurrent = v.variant === car.handle
                    const fuel = v.fuelType?.length ? v.fuelType.join(" / ") : ""
                    const transmission = v.transmission?.length ? v.transmission.join(" / ") : ""
                    return (
                      <LocalizedClientLink
                        key={v.variant}
                        href={`/cars/${v.variant}`}
                        className={`rounded-3xl border p-5 shadow-sm transition-all ${
                          isCurrent
                            ? "bg-blue-50 border-blue-200"
                            : "bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {v.variant
                                .split("-")
                                .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : ""))
                                .join(" ")}
                            </p>
                            {(fuel || transmission) && (
                              <p className="text-xs text-gray-500 mt-2">
                                {fuel ? `Fuel: ${fuel}` : ""}
                                {fuel && transmission ? " • " : ""}
                                {transmission ? `Transmission: ${transmission}` : ""}
                              </p>
                            )}
                          </div>
                          {isCurrent && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-3 py-1 rounded-full">
                              Selected
                            </span>
                          )}
                        </div>
                      </LocalizedClientLink>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            {car.description && (
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Vehicle Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg">{car.description}</p>
              </div>
            )}

            {/* Specifications */}
            {car.specifications && car.specifications.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Technical Specifications</h3>
                <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                  <SpecsTable specs={car.specifications} />
                </div>
              </div>
            )}

            {/* Vehicle Metadata (non-features/specifications fields) */}
            {car.metadata && typeof car.metadata === "object" && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Vehicle Details</h3>
                <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {Object.entries(car.metadata as Record<string, unknown>)
                      .filter(([k]) => !["features", "specifications", "variant_filters"].includes(k))
                      .map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                          <span className="text-sm text-gray-500 font-medium">{k}</span>
                          <span className="text-sm font-bold text-gray-900 text-right">{formatMetadataValue(v)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

           

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Features & Equipment</h3>
                <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    {car.features.map((f, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <span className="text-gray-600 font-medium">{f.feature_name}</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          f.feature_value.toLowerCase() === "yes"
                            ? "bg-green-100 text-green-700"
                            : f.feature_value.toLowerCase() === "no"
                            ? "bg-gray-100 text-gray-400"
                            : "bg-blue-50 text-blue-700"
                        }`}>
                          {f.feature_value.toLowerCase() === "yes" ? "Included" : f.feature_value.toLowerCase() === "no" ? "Not Included" : f.feature_value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">
                  Customer Reviews {car.reviews?.length > 0 && <span className="text-gray-500 font-normal">({car.reviews.length})</span>}
                </h3>
                {avgRating && (
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="font-bold text-gray-900 text-lg">{avgRating.toFixed(1)}</span>
                    <span className="text-gray-400 text-sm">/ 5.0</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Form */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Write a Review</h4>
                  <CarReviewForm productId={car.id} submitReview={submitCarReview} />
                </div>
                {/* List */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Recent Reviews</h4>
                  {(car.reviews?.length ?? 0) === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                      <p className="text-gray-400">No reviews yet. Be the first to share your experience!</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                      {car.reviews.map((r, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-bold text-gray-900">{r.reviewer_name}</p>
                            <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString("en-IN")}</p>
                          </div>
                          <div className="mb-3">
                            <StarRating rating={r.rating} />
                          </div>
                          {r.review_text && (
                            <p className="text-gray-600 text-sm leading-relaxed">"{r.review_text}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Price + Seller Info (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Price Card */}
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xl shadow-gray-200/50">
                <div className="mb-6">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{car.year} • {car.brand}</p>
                  <h1 className="text-3xl font-black text-gray-900 leading-tight mb-4">{car.name}</h1>
                  {car.city && (
                    <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg w-fit">
                      <MapPin size={16} className="text-blue-500" />
                      <span className="text-sm font-medium">{car.city}</span>
                    </div>
                  )}
                </div>

                <div className="mb-8 pb-8 border-b border-gray-100">
                  <p className="text-4xl font-black text-gray-900 tracking-tight">
                    {displayPriceFormatted}
                  </p>
                  <p className="text-sm text-gray-400 mt-1 font-medium">Ex-showroom price</p>
                </div>

                <div className="space-y-4">
                  {!selectedAvailability && (
                    <div className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-4 px-6 rounded-xl border border-red-100 cursor-not-allowed">
                      <ShieldCheck size={20} />
                      SOLD — No Longer Available
                    </div>
                  )}
                  
                  {selectedAvailability && (
                    customer ? (
                      <LocalizedClientLink
                        href={`/cars/${car.handle}/test-drive`}
                        className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5"
                      >
                        <Calendar size={20} />
                        Book Free Test Drive
                      </LocalizedClientLink>
                    ) : (
                      <LocalizedClientLink
                        href="/account"
                        className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5"
                      >
                        <Calendar size={20} />
                        Sign in to Book Test Drive
                      </LocalizedClientLink>
                    )
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href="tel:+919999999999"
                      className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl transition-colors"
                    >
                      <Phone size={18} />
                      Call
                    </a>
                    <a
                      href="https://wa.me/919999999999"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-4 rounded-xl transition-colors"
                    >
                      <MessageCircle size={18} />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Seller Card */}
              <div className="bg-gray-50 rounded-3xl border border-gray-200 p-6">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Seller Information</h4>
                <SellerCard
                  name="Verified Dealer"
                  city={car.city}
                  phone="+919999999999"
                />
                <div className="mt-4 flex items-center gap-2 text-xs text-green-600 font-bold bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                  <ShieldCheck size={14} />
                  Verified by GoGaddi
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Cars */}
        {relatedCars && relatedCars.length > 0 && (
          <section className="mt-24 border-t border-gray-100 pt-16">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Related Vehicles</h2>
                <p className="text-gray-500">Explore other trims for this model</p>
              </div>
              <LocalizedClientLink href="/cars" className="text-blue-600 font-bold hover:underline">
                View all inventory
              </LocalizedClientLink>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCars.map((related) => (
                <CarCard key={related.id} car={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
