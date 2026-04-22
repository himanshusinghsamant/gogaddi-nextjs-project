import { Metadata } from "next"
import { notFound } from "next/navigation"
import CarDetailTemplate from "@modules/cars/templates/car-detail-template"
import { getCarByHandle, listCars } from "@lib/data/cars"
import { selectRelatedCars } from "@lib/data/related-cars"
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

  const { cars: inventory } = await listCars(countryCode)
  const relatedCars = selectRelatedCars(car, inventory, 8)

  return (
    <CarDetailTemplate
      car={car}
      variantIdFromUrl={variantId}
      customer={customer}
      relatedCars={relatedCars}
    />
  )
}

