"use client"

import Slider from "react-slick"
import Image from "next/image"
import { useState, useEffect } from "react"

const HERO_IMAGES = [
  "/cars/peter-broomfield-m3m-lnR90uM-unsplash.jpg",
  "/cars/joshua-koblin-eqW1MPinEV4-unsplash.jpg",
  "/cars/olav-tvedt-6lSBynPRaAQ-unsplash.jpg",
  "/cars/img-1.jpg",
  "/cars/img-2.jpg",
]

function HeroSlide({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-full w-full min-h-[400px] overflow-hidden">
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover animate-ken-burns"
        sizes="100vw"
        quality={90}
      />
    </div>
  )
}

export default function HeroCarousel({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    fade: false,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: false,
    cssEase: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  return (
    <section className="relative w-full min-h-[640px] md:min-h-[720px] lg:min-h-[760px] overflow-hidden bg-black">
      <div className="hero-slick absolute inset-0 z-0 h-full w-full">
        {mounted ? (
          <Slider {...settings}>
            {HERO_IMAGES.map((src, index) => (
              <HeroSlide key={index} src={src} alt="Hero car" />
            ))}
          </Slider>
        ) : (
          <HeroSlide src={HERO_IMAGES[0]!} alt="Hero car" />
        )}
      </div>

      <div className="relative z-20 w-full h-full flex items-center">
        <div className="content-container w-full py-16 md:py-0">
          {children}
        </div>
      </div>

      <style jsx global>{`
        .animate-ken-burns {
          animation: kenBurns 20s ease-out infinite alternate;
        }
        @keyframes kenBurns {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
      `}</style>
    </section>
  )
}
