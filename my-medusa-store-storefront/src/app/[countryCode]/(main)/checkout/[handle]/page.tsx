import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CheckoutForm from "@modules/checkout/components/checkout-form"
import { getCarByHandle } from "@lib/data/cars"
import { formatCarPrice } from "@lib/util/format-car-price"
import { retrieveCustomer } from "@lib/data/customer"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  return {
    title: `Checkout | ${params.handle} | GoGaddi`,
    description: "Complete your order with billing details, shipping and payment.",
  }
}

export default async function CheckoutPage(props: Props) {
  const { countryCode, handle } = await props.params
  const resolvedSearchParams = await props.searchParams
  const variantIdParam = typeof resolvedSearchParams?.variant_id === "string"
    ? resolvedSearchParams.variant_id
    : Array.isArray(resolvedSearchParams?.variant_id)
      ? resolvedSearchParams.variant_id[0]
      : undefined

  const customer = await retrieveCustomer().catch(() => null)
  if (!customer) {
    redirect(`/${countryCode}/account?redirect=/${countryCode}/checkout/${handle}`)
  }

  const { car } = await getCarByHandle(countryCode, handle)

  if (!car) notFound()

  const versions = car.versions ?? []
  const selectedVariant =
    variantIdParam && versions.length > 0
      ? versions.find((v) => v.id === variantIdParam) ?? versions[0]
      : versions[0] ?? null
  const variantId = selectedVariant?.id ?? ""
  const { getVersionPrice } = await import("@lib/util/format-car-price")
  const displayPrice = selectedVariant ? getVersionPrice(selectedVariant.prices) : null
  const carPriceFormatted = displayPrice != null ? formatCarPrice(displayPrice) : formatCarPrice(car.price)

  const carUrl = `/${countryCode}/cars/${car.handle}`

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-slate-100 border-b border-slate-200">
        <div className="content-container py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Checkout
          </h1>
        </div>
      </div>

      <div className="content-container py-8 md:py-12">
        <nav className="text-sm text-slate-500 mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <LocalizedClientLink
                href="/"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Home
              </LocalizedClientLink>
            </li>
            <li aria-hidden className="text-slate-400">
              /
            </li>
            <li>
              <LocalizedClientLink
                href="/cars"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Cars
              </LocalizedClientLink>
            </li>
            <li aria-hidden className="text-slate-400">
              /
            </li>
            <li>
              <LocalizedClientLink
                href={`/cars/${car.handle}`}
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                {car.name}
              </LocalizedClientLink>
            </li>
            <li aria-hidden className="text-slate-400">
              /
            </li>
            <li className="text-slate-600 font-medium" aria-current="page">
              Checkout
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-12">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 lg:p-10">
              <CheckoutForm
                variantId={variantId}
                countryCode={countryCode}
                car={{
                  id: car.id,
                  handle: car.handle,
                  name: car.name,
                  brand: car.brand,
                  price: carPriceFormatted,
                  city: car.city,
                  url: carUrl,
                  image_url: car.thumbnail || car.images?.[0] || null,
                  fuel_type: car.fuel_type,
                  transmission: car.transmission,
                  year: car.year,
                  km_driven: car.km_driven,
                  color: car.color,
                  owner: car.owner,
                  description: car.description,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

