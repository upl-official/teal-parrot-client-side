"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: "/elegant-silver-display.png",
      heading: "Timeless Elegance in Silver",
      subheading: "Handcrafted jewelry that tells your unique story",
      cta: "Explore Collection",
    },
    {
      image: "/silver-nose-ring-collection.png",
      heading: "Discover Our Latest Collection",
      subheading: "Exquisite designs that blend tradition with contemporary style",
      cta: "Shop New Arrivals",
    },
    {
      image: "/intricate-silver-collection.png",
      heading: "Artisan Craftsmanship",
      subheading: "Each piece meticulously crafted with attention to detail",
      cta: "Our Story",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [slides.length])

  const handleDotClick = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section className="relative h-[90vh] overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: currentSlide === index ? 1 : 0,
            scale: currentSlide === index ? 1 : 1.1,
          }}
          transition={{
            opacity: { duration: 1.5 },
            scale: { duration: 6 },
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10" />
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.heading}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </motion.div>
      ))}

      {/* Content */}
      <div className="container mx-auto px-4 h-full relative z-20 flex items-center">
        <div className="max-w-2xl">
          {slides.map((slide, index) => (
            <div key={index} className={currentSlide === index ? "block" : "hidden"}>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block px-4 py-1.5 mb-4 bg-teal-500/90 text-white text-sm font-medium rounded-full backdrop-blur-sm"
              >
                Teal Parrot Jewelry
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              >
                {slide.heading}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-lg md:text-xl text-white/90 mb-8"
              >
                {slide.subheading}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/collection">
                  <Button
                    size="lg"
                    className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg rounded-md flex items-center gap-2 group"
                  >
                    {slide.cta}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/brand">
                  <Button
                    size="lg"
                    className="bg-transparent border-2 border-white text-white hover:bg-white/20 px-8 py-6 text-lg rounded-md transition-colors"
                  >
                    Learn More
                  </Button>
                </Link>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? "bg-teal-500 w-8" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
