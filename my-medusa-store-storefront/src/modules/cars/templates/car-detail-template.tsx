import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CarGallery from "@modules/cars/components/car-gallery"
import CarReviewForm from "@modules/cars/components/car-review-form"
import CarCard from "@modules/cars/components/car-card"
import SellerCard from "@modules/cars/components/seller-card"
import CarVariantsTable from "@modules/cars/components/car-variants-table"
import { submitCarReview } from "@lib/data/cars"
import { formatCarPrice, getVersionPrice } from "@lib/util/format-car-price"
import type { CarDetail, RelatedCar } from "@lib/data/cars"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Badge({ label, value, color = "blue" }: { label: string; value: string; color?: "blue" | "green" | "orange" | "gray" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
  }
  return (
    <div className={`flex flex-col items-center text-center p-3 rounded-xl border ${colors[color]}`}>
      <p className="text-xs font-medium opacity-70 mb-1">{label}</p>
      <p className="font-bold text-sm">{value}</p>
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
    <div className="space-y-6">
      {Object.entries(byGroup).map(([group, rows]) => (
        <div key={group}>
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">
            {group}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {rows.map((row, i) => (
              <div key={i} className="flex justify-between py-2.5 px-3 odd:bg-gray-50 rounded gap-4">
                <span className="text-sm text-gray-500 shrink-0">{row.name}</span>
                <span className="text-sm font-medium text-gray-800 text-right">{row.value}</span>
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
        <span key={s} className={s <= rating ? "text-yellow-400" : "text-gray-200"}>★</span>
      ))}
    </div>
  )
}

function RelatedCarCard({ related }: { related: RelatedCar }) {
  const carListItem = {
    id: related.id,
    handle: related.handle,
    thumbnail: related.thumbnail,
    images: [],
    name: related.title,
    subtitle: null,
    brand: null,
    model: null,
    category_handles: [],
    fuel_type: null,
    transmission: null,
    year: null,
    km_driven: null,
    color: null,
    engine: null,
    mileage: null,
    owner: null,
    city: null,
    car_type: null,
    customer_id: null,
    availability: true,
    price: null,
    description: null,
    features: [],
    specifications: [],
    reviews: [],
    versions: [],
    related_cars: [],
  }
  return <CarCard car={carListItem} />
}

// ─── Main Template ────────────────────────────────────────────────────────────

export default function CarDetailTemplate({ car, variantIdFromUrl }: { car: CarDetail; variantIdFromUrl?: string }) {
  const versions = car.versions ?? []
  const selectedVariant =
    variantIdFromUrl && versions.length > 0
      ? versions.find((v) => v.id === variantIdFromUrl) ?? versions[0]
      : versions[0] ?? null
  const displayPrice = selectedVariant ? getVersionPrice(selectedVariant.prices) : null
  const displayPriceFormatted = displayPrice != null ? formatCarPrice(displayPrice) : formatCarPrice(car.price)
  const selectedAvailability =
    selectedVariant == null
      ? car.availability
      : selectedVariant.manage_inventory
        ? (selectedVariant.inventory_quantity ?? 0) > 0
        : true
  const checkoutVariantId = selectedVariant?.id ?? null

  const avgRating =
    (car.reviews?.length ?? 0) > 0
      ? car.reviews.reduce((a, r) => a + r.rating, 0) / car.reviews.length
      : null

  const images = [...(car.thumbnail ? [car.thumbnail] : []), ...(car.images ?? []).filter((img) => img !== car.thumbnail)]

  const quickSpecs = [
    car.fuel_type && { label: "Fuel Type", value: car.fuel_type, color: "blue" as const },
    car.transmission && { label: "Transmission", value: car.transmission, color: "green" as const },
    car.year && { label: "Year", value: car.year, color: "orange" as const },
    car.km_driven && { label: "KM Driven", value: car.km_driven, color: "gray" as const },
    car.owner && { label: "Owner", value: car.owner, color: "gray" as const },
    car.color && { label: "Color", value: car.color, color: "gray" as const },
  ].filter(Boolean) as Array<{ label: string; value: string; color: "blue" | "green" | "orange" | "gray" }>

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="content-container py-4">
          <nav className="text-sm text-gray-500 flex items-center gap-2">
            <LocalizedClientLink href="/" className="hover:text-blue-600">Home</LocalizedClientLink>
            <span>/</span>
            <LocalizedClientLink href="/cars" className="hover:text-blue-600">Cars</LocalizedClientLink>
            {car.brand && (
              <>
                <span>/</span>
                <LocalizedClientLink href={`/cars?brand=${encodeURIComponent(car.brand)}`} className="hover:text-blue-600">
                  {car.brand}
                </LocalizedClientLink>
              </>
            )}
            <span>/</span>
            <span className="text-gray-800 font-medium line-clamp-1">{car.name}</span>
          </nav>
        </div>
      </div>

      <div className="content-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Gallery + Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <CarGallery images={images} name={car.name} />
            </div>

            {/* Quick specs badges */}
            {quickSpecs.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-4">Key Highlights</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {quickSpecs.map((spec) => (
                    <Badge key={spec.label} label={spec.label} value={spec.value} color={spec.color} />
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {car.description && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3">About this Car</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{car.description}</p>
              </div>
            )}

            {/* Specifications */}
            {car.specifications && car.specifications.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Specifications</h3>
                <SpecsTable specs={car.specifications} />
              </div>
            )}

            {/* Variants */}
            {versions.length > 0 && (
              <CarVariantsTable
                versions={versions}
                selectedVariantId={selectedVariant?.id ?? null}
                carHandle={car.handle}
              />
            )}

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  {car.features.map((f, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-500">{f.feature_name}</span>
                      <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                        f.feature_value.toLowerCase() === "yes"
                          ? "bg-green-50 text-green-700"
                          : f.feature_value.toLowerCase() === "no"
                          ? "bg-gray-50 text-gray-400"
                          : "text-gray-800"
                      }`}>
                        {f.feature_value.toLowerCase() === "yes" ? "✓" : f.feature_value.toLowerCase() === "no" ? "✗" : f.feature_value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-5">
                Reviews {car.reviews?.length > 0 && <span className="text-gray-500 font-normal text-base">({car.reviews.length})</span>}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Write a Review</h4>
                  <CarReviewForm productId={car.id} submitReview={submitCarReview} />
                </div>
                {/* List */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Customer Reviews</h4>
                  {(car.reviews?.length ?? 0) === 0 ? (
                    <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
                  ) : (
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                      {car.reviews.map((r, i) => (
                        <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-sm text-gray-800">{r.reviewer_name}</p>
                            <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString("en-IN")}</p>
                          </div>
                          <StarRating rating={r.rating} />
                          {r.review_text && (
                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{r.review_text}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Price + Seller Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-5">
              {/* Price Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h1 className="text-xl font-bold text-gray-900 leading-tight">{car.name}</h1>
                  {avgRating && (
                    <div className="flex items-center gap-1 shrink-0 bg-yellow-50 border border-yellow-200 px-2 py-1 rounded-lg">
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="text-sm font-bold text-yellow-700">{avgRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                {car.brand && <p className="text-gray-500 text-sm mb-4">{car.brand}</p>}

                <p className="text-3xl font-extrabold text-blue-700 mb-1">
                  {displayPriceFormatted}
                </p>
                {car.city && (
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {car.city}
                  </p>
                )}

                <div className="mt-5 space-y-3">
                  {selectedAvailability ? (
                    <LocalizedClientLink
                      href={checkoutVariantId ? `/checkout/${car.handle}?variant_id=${encodeURIComponent(checkoutVariantId)}` : `/checkout/${car.handle}`}
                      className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-extrabold py-3 px-4 rounded-xl transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13L17 13M7 13h10" />
                      </svg>
                      {checkoutVariantId ? "Buy this variant / Checkout" : "Checkout / Enquire"}
                    </LocalizedClientLink>
                  ) : (
                    <div className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-700 font-extrabold py-3 px-4 rounded-xl border border-red-200 cursor-not-allowed select-none">
                      🚫 SOLD — No Longer Available
                    </div>
                  )}
                  <a
                    href="tel:+919999999999"
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Contact Seller
                  </a>
                  <a
                    href="https://wa.me/919999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>

              <SellerCard
                name="Private Seller"
                city={car.city}
                phone="+919999999999"
              />

              {/* Back to listing */}
              <LocalizedClientLink
                href="/cars"
                className="flex items-center justify-center gap-2 w-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors text-sm"
              >
                ← Back to All Cars
              </LocalizedClientLink>
            </div>
          </div>
        </div>

        {/* Related Cars */}
        {car.related_cars && car.related_cars.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Similar Cars</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {car.related_cars.slice(0, 4).map((related) => (
                <RelatedCarCard key={related.id} related={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
