"use client"

import Image from "next/image"
import { useState } from "react"
import { PLACEHOLDER_IMAGE_URL } from "@lib/constants/placeholder-image"

export default function CarGallery({ images, name }: { images: string[]; name: string }) {
  const raw = images?.filter(Boolean) ?? []
  const allImages = raw.length > 0 ? raw : [PLACEHOLDER_IMAGE_URL]
  const [active, setActive] = useState(0)

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[7/4] rounded-xl overflow-hidden bg-gray-100 shadow-md">
        <Image
          src={allImages[active]}
          alt={`${name} - image ${active + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority={active === 0}
        />
        {allImages.length > 1 && (
          <>
            <button
              onClick={() => setActive((prev) => (prev - 1 + allImages.length) % allImages.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
              aria-label="Previous image"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActive((prev) => (prev + 1) % allImages.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
              aria-label="Next image"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {active + 1} / {allImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-20 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === active ? "border-blue-500 opacity-100" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
