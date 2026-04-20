"use client"

import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { useState } from "react"
import TextField from "@modules/common/components/text-field"
import SelectField from "@modules/common/components/select-field"
import Button from "@modules/common/components/button"

type Props = {
  brands: string[]
  fuelTypes: string[]
  cities: string[]
}

export default function CarSearchBar({ brands, fuelTypes, cities }: Props) {
  const router = useRouter()
  const { countryCode } = useParams() as { countryCode: string }

  const [brand, setBrand] = useState("")
  const [fuelType, setFuelType] = useState("")
  const [city, setCity] = useState("")
  const [priceMax, setPriceMax] = useState("")

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (brand) params.set("brand", brand)
    if (fuelType) params.set("fuelType", fuelType)
    if (city) params.set("city", city)
    if (priceMax) params.set("priceMax", priceMax)
    router.push(`/${countryCode}/cars?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-3xl shadow-2xl shadow-black/20 p-4 md:p-6 w-full max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SelectField
          label="Brand"
          options={brands}
          placeholder="All Brands"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <SelectField
          label="Fuel Type"
          options={fuelTypes}
          placeholder="All Fuels"
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
        />
        <SelectField
          label="City"
          options={cities}
          placeholder="All Cities"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <TextField
          label="Max Budget (₹L)"
          type="number"
          placeholder="e.g. 800000"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
        />
      </div>

      <div className="mt-5 flex justify-center">
        <Button type="submit" size="md" className="w-full md:w-auto min-w-[160px]">
          <span aria-hidden>🔍</span>
          Search Cars
        </Button>
      </div>
    </form>
  )
}
