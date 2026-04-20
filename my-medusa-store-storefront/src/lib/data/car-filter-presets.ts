/**
 * Fixed fuel-type options for filters (Indian market).
 * Matching against listing data is handled in `fuelTypeMatchesFilter` (flexible, not exact-only).
 */
export const ALL_CAR_FUEL_TYPES: string[] = [
  "Petrol",
  "Diesel",
  "Petrol / Diesel",
  "CNG",
  "Petrol + CNG",
  "Diesel + CNG",
  "LPG",
  "Electric (EV)",
  "Hybrid",
  "Petrol Hybrid",
  "Diesel Hybrid",
  "Plug-in Hybrid",
  "Mild Hybrid",
  "Strong Hybrid",
  "Hydrogen (FCEV)",
  "Ethanol / Flex Fuel",
].sort((a, b) => a.localeCompare(b, "en"))

const norm = (s: string | null | undefined) =>
  String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")

/**
 * Match user-selected fuel filter to a car's `fuel_type` string (may be combined e.g. "Petrol / Diesel").
 */
export function fuelTypeMatchesFilter(carFuelType: string | null | undefined, selected: string): boolean {
  const sel = norm(selected)
  if (!sel) return true
  const ft = norm(carFuelType)
  if (!ft) return false
  if (ft === sel) return true

  // Combined petrol + diesel
  if (sel.includes("petrol") && sel.includes("diesel")) {
    return (ft.includes("petrol") && ft.includes("diesel")) || /\bpetrol\s*[/&|]\s*diesel\b/i.test(ft)
  }

  // Electric / EV
  if (sel.includes("electric") || sel.includes("(ev)") || sel === "ev") {
    return (
      ft.includes("electric") ||
      ft.includes("ev") ||
      ft.includes("battery") ||
      ft.includes("bev")
    )
  }

  // Hydrogen
  if (sel.includes("hydrogen") || sel.includes("fcev")) {
    return ft.includes("hydrogen") || ft.includes("fcev")
  }

  // Hybrid variants
  if (sel.includes("hybrid")) {
    if (sel.includes("plug")) return ft.includes("plug") && ft.includes("hybrid")
    if (sel.includes("mild")) return ft.includes("mild") && ft.includes("hybrid")
    if (sel.includes("strong")) return ft.includes("strong") && ft.includes("hybrid")
    if (sel.includes("petrol")) return ft.includes("petrol") && ft.includes("hybrid")
    if (sel.includes("diesel")) return ft.includes("diesel") && ft.includes("hybrid")
    return ft.includes("hybrid")
  }

  // CNG / LPG
  if (sel.includes("cng")) {
    return ft.includes("cng")
  }
  if (sel.includes("lpg")) {
    return ft.includes("lpg")
  }

  // Petrol + CNG etc.
  if (sel.includes("petrol") && sel.includes("cng")) {
    return ft.includes("petrol") && ft.includes("cng")
  }
  if (sel.includes("diesel") && sel.includes("cng")) {
    return ft.includes("diesel") && ft.includes("cng")
  }

  // Ethanol / flex
  if (sel.includes("ethanol") || sel.includes("flex")) {
    return ft.includes("ethanol") || ft.includes("flex")
  }

  // Single-word fuels: petrol, diesel
  const key = sel.replace(/[^a-z0-9+/ ]/g, "").trim()
  if (key === "petrol") return ft.includes("petrol")
  if (key === "diesel") return ft.includes("diesel")

  return ft.includes(sel) || sel.split(/[/+&|]/).some((part) => part.trim() && ft.includes(part.trim()))
}

/**
 * Match sidebar filter ("Manual" / "Automatic") to catalog strings like "5-Speed Manual" or "CVT Automatic".
 */
export function transmissionMatchesFilter(carTransmission: string | null | undefined, selected: string): boolean {
  const sel = norm(selected)
  if (!sel) return true
  const cv = norm(carTransmission)
  if (!cv) return false
  if (cv === sel) return true

  if (sel === "manual" || sel.includes("manual")) {
    return (
      cv.includes("manual") ||
      cv.includes("mt") ||
      /\b\d\s*[-–]?\s*speed\b/i.test(cv)
    )
  }
  if (sel === "automatic" || sel.includes("automatic") || sel === "auto") {
    return (
      cv.includes("automatic") ||
      cv.includes("cvt") ||
      cv.includes("dct") ||
      cv.includes("amt") ||
      cv.includes("tc") ||
      cv.includes("torque")
    )
  }
  return cv.includes(sel)
}
