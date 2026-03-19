import { Metadata } from "next"
import { notFound } from "next/navigation"
import CarDetailTemplate from "@modules/cars/templates/car-detail-template"
import { getCarByHandle, getCarsByHandles } from "@lib/data/cars"
import { retrieveCustomer } from "@lib/data/customer"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countryCode, handle } = await params
  const { car } = await getCarByHandle(countryCode, handle)
  if (!car) return { title: "Car not found | GoGaddi" }

  return {
    title: `${car.name} | GoGaddi`,
    description: car.description ?? `View ${car.name} details.`,
    openGraph: {
      title: `${car.name} | GoGaddi`,
      description: car.description ?? undefined,
      images: car.thumbnail ? [car.thumbnail] : undefined,
    },
  }
}

export default async function CarDetailPage({ params, searchParams }: Props) {
  const { countryCode, handle } = await params
  const resolved = await searchParams
  const variantId = typeof resolved?.variant_id === "string" ? resolved.variant_id : Array.isArray(resolved?.variant_id) ? resolved.variant_id[0] : undefined
  const { car } = await getCarByHandle(countryCode, handle)
  if (!car) notFound()

  const customer = await retrieveCustomer().catch(() => null)

  const relatedHandles =
    car.variant_filters?.variants?.map((v) => v.variant).filter((h) => h) ?? []

  const relatedCars = relatedHandles.length > 0 ? (await getCarsByHandles(countryCode, relatedHandles)).cars : []

  return (
    <CarDetailTemplate
      car={car}
      variantIdFromUrl={variantId}
      customer={customer}
      relatedCars={relatedCars}
    />
  )
}

