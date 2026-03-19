import type { CarVersion } from "@lib/data/cars"

export type CarVariantFilter = {
  variant: string
  fuelType: string[]
  transmission: string[]
}

export type CarVariantFilters = {
  variants: CarVariantFilter[]
}

function inferFuelTypeFromText(text: string | null | undefined): string | null {
  const t = (text ?? "").toLowerCase()
  if (t.includes("petrol")) return "Petrol"
  if (t.includes("diesel")) return "Diesel"
  return null
}

function inferTransmissionFromText(text: string | null | undefined): string | null {
  const t = (text ?? "").toLowerCase()
  if (t.includes("automatic") || t.includes("auto")) return "Automatic"
  if (t.includes("manual")) return "Manual"
  return null
}

/**
 * Filter a product's Medusa variants (fuel/transmission variants) based on `metadata.variant_filters`
 * for the given car handle.
 */
export function filter_variants(
  versions: CarVersion[],
  variantFilters: CarVariantFilters | null,
  carHandle: string
): CarVersion[] {
  const entry = variantFilters?.variants?.find((v) => v.variant === carHandle) ?? null
  if (!entry) return versions

  const allowedFuel = (entry.fuelType ?? []).map((s) => String(s).toLowerCase())
  const allowedTransmission = (entry.transmission ?? []).map((s) => String(s).toLowerCase())

  return (versions ?? []).filter((v) => {
    const inferredFuel = (v.fuel_type ?? inferFuelTypeFromText(v.title))?.toLowerCase() ?? null
    const inferredTransmission = (v.transmission ?? inferTransmissionFromText(v.title))?.toLowerCase() ?? null

    const fuelOk = allowedFuel.length === 0 ? true : inferredFuel ? allowedFuel.includes(inferredFuel) : true
    const transmissionOk =
      allowedTransmission.length === 0 ? true : inferredTransmission ? allowedTransmission.includes(inferredTransmission) : true

    return fuelOk && transmissionOk
  })
}

