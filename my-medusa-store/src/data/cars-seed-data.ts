/**
 * Bulk car seed data for Maruti Suzuki, Mazda, Nissan, Volvo
 * Run via: npx medusa exec ./src/scripts/seed-cars.ts
 */

export type CarVariant = {
  label: string
  fuelType: string
  transmission: string
  exShowroomINR: number
  inventory: number
}

export type CarSeedEntry = {
  brand: string
  categoryName: string      // must match name in product_category table
  model: string             // full model name e.g. "Maruti Suzuki Swift"
  subtitle: string          // e.g. "maruti-suzuki-swift"
  handle: string            // unique slug
  description: string
  variants: CarVariant[]
  images: string[]
  metadata: {
    /** Total inventory for this product (all variants combined) */
    available?: boolean
    category?: string
    inventory?: number
    year?: string
    km_driven?: string
    price?: string
    color?: string
    engine?: string
    mileage?: string
    owner?: string
    city?: string
    vehicle_type?: string
    condition?: string
    features: Record<string, { key: string; value: string }[]>
    specifications: Record<string, { key: string; value: string }[]>
    /** Optional per-product variant filters (e.g. Fuel Type, Transmission, Variant Name) */
    variant_filters?: {
      variants: Array<{
        variant: string
        fuelType: string[]
        transmission: string[]
      }>
    }
  }
}

export const carsSeedData: CarSeedEntry[] = [

  
]
