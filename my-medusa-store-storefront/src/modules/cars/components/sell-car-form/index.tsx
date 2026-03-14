"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { createCarListing } from "@lib/data/cars"
import TextField from "@modules/common/components/text-field"
import SelectField from "@modules/common/components/select-field"
import Button from "@modules/common/components/button"

const BRANDS = ["Maruti Suzuki", "Hyundai", "Honda", "Toyota", "Tata", "Mahindra", "Kia", "Volkswagen", "Skoda", "MG", "Nissan", "Renault", "Ford", "Fiat", "Jeep", "Mercedes-Benz", "BMW", "Audi", "Volvo", "Mazda", "Other"]
const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid", "LPG"]
const TRANSMISSIONS = ["Manual", "Automatic", "AMT", "CVT", "DCT"]
const OWNERS = ["1st Owner", "2nd Owner", "3rd Owner", "4th+ Owner"]
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Chandigarh", "Kochi", "Nagpur", "Other"]
const CAR_TYPES = [
  { value: "Used", label: "Used / Secondhand" },
  { value: "New", label: "New" },
]

const MAX_IMAGES = 10

type FormData = {
  title: string
  brand: string
  model: string
  car_type: string
  price: string
  fuel_type: string
  transmission: string
  year: string
  km_driven: string
  city: string
  color: string
  engine: string
  mileage: string
  owner: string
  description: string
}

const EMPTY: FormData = {
  title: "",
  brand: "",
  model: "",
  car_type: "Used",
  price: "",
  fuel_type: "Petrol",
  transmission: "Manual",
  year: "",
  km_driven: "",
  city: "",
  color: "",
  engine: "",
  mileage: "",
  owner: "1st Owner",
  description: "",
}

export default function SellCarForm() {
  const router = useRouter()
  const { countryCode } = useParams() as { countryCode: string }
  const [form, setForm] = useState<FormData>(EMPTY)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return
    const remaining = MAX_IMAGES - imageUrls.length
    if (remaining <= 0) return
    const toAdd = Array.from(files).slice(0, remaining)
    setUploadingImages(true)
    setError(null)
    try {
      const formData = new FormData()
      toAdd.forEach((f) => formData.append("file", f))
      const res = await fetch("/api/upload-car-image", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error ?? "Image upload failed")
        return
      }
      const base = typeof window !== "undefined" ? window.location.origin : ""
      const fullUrls = (data.urls ?? []).map((u: string) => (u.startsWith("http") ? u : `${base}${u}`))
      setImageUrls((prev) => [...prev, ...fullUrls])
    } catch {
      setError("Image upload failed")
    } finally {
      setUploadingImages(false)
      e.target.value = ""
    }
  }

  function removeImage(url: string) {
    setImageUrls((prev) => prev.filter((u) => u !== url))
  }

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (field === "brand" || field === "model" || field === "year") {
      const b = field === "brand" ? value : form.brand
      const m = field === "model" ? value : form.model
      const y = field === "year" ? value : form.year
      if (b && m) setForm((prev) => ({ ...prev, [field]: value, title: `${b} ${m}${y ? " " + y : ""}` }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.price) {
      setError("Car title and price are required.")
      return
    }
    const priceNum = Number(form.price)
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setError("Please enter a valid price.")
      return
    }
    setLoading(true)
    setError(null)
    const result = await createCarListing({
      title: form.title.trim(),
      brand: form.brand || "",
      model: form.model || "",
      price: priceNum,
      car_type: form.car_type || "Used",
      fuel_type: form.fuel_type || "Petrol",
      transmission: form.transmission || "Manual",
      year: form.year || "",
      km_driven: form.km_driven || "",
      city: form.city || "",
      description: (form.description || "").trim(),
      color: form.color || "",
      engine: form.engine || "",
      mileage: form.mileage || "",
      owner: form.owner || "1st Owner",
      images: imageUrls.length > 0 ? imageUrls : undefined,
    })
    setLoading(false)
    if (!result.success) {
      setError(result.error ?? "Failed to submit car. Please try again.")
      return
    }
    setSuccess(true)
    setTimeout(() => router.push(`/${countryCode}/account/my-cars`), 2500)
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-6 text-3xl">
          ⏳
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Car Submitted for Review!</h2>
        <p className="text-slate-600 font-medium max-w-sm mx-auto">
          Your listing is under review by our team. We will notify you by email once it is approved and goes live.
        </p>
        <p className="text-slate-400 text-sm mt-4">Redirecting to My Listings…</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Car images */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
          Car images
        </label>
        <p className="text-xs text-slate-500 mb-3">Add up to {MAX_IMAGES} photos (JPEG, PNG, WebP or GIF, max 5MB each). Optional.</p>
        <div className="flex flex-wrap gap-3 items-start">
          {imageUrls.map((url) => (
            <div key={url} className="relative group">
              <img src={url} alt="Car" className="w-24 h-24 object-cover rounded-xl border border-slate-200" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-500 text-white text-sm font-bold shadow hover:bg-red-600"
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
          {imageUrls.length < MAX_IMAGES && (
            <label className="w-24 h-24 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-blue-400 hover:text-blue-500 cursor-pointer transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={handleImageSelect}
                disabled={uploadingImages}
              />
              {uploadingImages ? <span className="text-xs">Uploading…</span> : (<><span className="text-2xl mb-0.5">+</span><span className="text-[10px] font-semibold">Add</span></>)}
            </label>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SelectField
          label="Type of car"
          options={CAR_TYPES}
          placeholder="Select type"
          value={form.car_type}
          onChange={(e) => set("car_type", e.target.value)}
        />
        <SelectField
          label="Brand"
          options={BRANDS}
          placeholder="Select brand"
          value={form.brand}
          onChange={(e) => set("brand", e.target.value)}
          required
        />
        <TextField
          label="Model"
          placeholder="e.g. Swift, Creta, Nexon"
          value={form.model}
          onChange={(e) => set("model", e.target.value)}
          required
        />
        <TextField
          label="Year"
          type="number"
          placeholder="e.g. 2020"
          min={1990}
          max={new Date().getFullYear()}
          value={form.year}
          onChange={(e) => set("year", e.target.value)}
          required
        />
        <TextField
          label="Asking Price (₹)"
          type="number"
          placeholder="e.g. 450000"
          value={form.price}
          onChange={(e) => set("price", e.target.value)}
          required
        />
        <SelectField
          label="Fuel Type"
          options={FUEL_TYPES}
          placeholder="Fuel type"
          value={form.fuel_type}
          onChange={(e) => set("fuel_type", e.target.value)}
        />
        <SelectField
          label="Transmission"
          options={TRANSMISSIONS}
          placeholder="Transmission"
          value={form.transmission}
          onChange={(e) => set("transmission", e.target.value)}
        />
        <TextField
          label="KM Driven"
          type="number"
          placeholder="e.g. 45000"
          value={form.km_driven}
          onChange={(e) => set("km_driven", e.target.value)}
        />
        <SelectField
          label="Owner"
          options={OWNERS}
          placeholder="Owner"
          value={form.owner}
          onChange={(e) => set("owner", e.target.value)}
        />
        <SelectField
          label="City"
          options={CITIES}
          placeholder="Select city"
          value={form.city}
          onChange={(e) => set("city", e.target.value)}
        />
        <TextField
          label="Color"
          placeholder="e.g. Red, White, Silver"
          value={form.color}
          onChange={(e) => set("color", e.target.value)}
        />
        <TextField
          label="Engine"
          placeholder="e.g. 1.2L Petrol"
          value={form.engine}
          onChange={(e) => set("engine", e.target.value)}
        />
        <TextField
          label="Mileage (kmpl)"
          placeholder="e.g. 18 kmpl"
          value={form.mileage}
          onChange={(e) => set("mileage", e.target.value)}
        />
      </div>

      <TextField
        label="Listing Title"
        placeholder="e.g. Maruti Suzuki Swift 2020"
        value={form.title}
        onChange={(e) => set("title", e.target.value)}
        required
      />

      {/* Description — styled to match TextField design */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
          Description
        </label>
        <textarea
          rows={4}
          placeholder="Describe the car condition, service history, modifications, etc."
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className="w-full min-h-[56px] rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 resize-none"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium p-4 rounded-2xl">
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} size="full" className="mt-2">
        {loading ? "Listing your car…" : "Post Your Car for Free"}
      </Button>
    </form>
  )
}
