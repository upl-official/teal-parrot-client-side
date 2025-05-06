"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { fetchFeaturedProducts } from "@/lib/api"
import type { Product } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchFeaturedProducts()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching featured products:", error)
        setError("Failed to load featured products. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    getProducts()
  }, [])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-between items-end border-b-2 border-teal-500 pb-2 mb-8">
            <h3 className="text-2xl font-bold text-teal-500">Featured Jewelry</h3>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-between items-end border-b-2 border-teal-500 pb-2 mb-8">
            <h3 className="text-2xl font-bold text-teal-500">Featured Jewelry</h3>
          </div>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-between items-end border-b-2 border-teal-500 pb-2 mb-8">
            <h3 className="text-2xl font-bold text-teal-500">Featured Jewelry</h3>
            <Link
              href="/collection"
              className="text-teal-500 border border-teal-500 px-4 py-2 rounded hover:bg-teal-500 hover:text-white transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">No featured products available at the moment.</p>
            <p className="text-gray-500 mt-2">Check back soon or browse our collection.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 relative">
        <div className="flex justify-between items-end border-b-2 border-teal-500 pb-2 mb-8">
          <h3 className="text-2xl font-bold text-teal-500">Featured Jewelry</h3>
          <Link
            href="/collection"
            className="text-teal-500 border border-teal-500 px-4 py-2 rounded hover:bg-teal-500 hover:text-white transition-colors"
          >
            View All
          </Link>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide gap-6 py-4 px-4 md:px-12"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {products.map((product) => (
            <Link
              href={`/product/${product._id}`}
              key={product._id}
              className="flex-shrink-0 w-[250px] scroll-snap-align-start"
            >
              <motion.div
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative overflow-hidden rounded-lg">
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }}>
                    <Image
                      src={product.images[0] || "/placeholder.svg?height=400&width=300&query=silver jewelry"}
                      alt={product.name}
                      width={250}
                      height={350}
                      className="object-cover w-[250px] h-[350px] transition-transform duration-300"
                    />
                  </motion.div>
                  {product.discountPercentage && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                      {product.discountPercentage}% OFF
                    </div>
                  )}
                </div>
                <h4 className="mt-2 text-gray-900">{product.name}</h4>
                <div className="flex items-center gap-2">
                  <h3 className="font-montserrat font-semibold text-gray-900">₹{product.price}</h3>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-gray-500 line-through text-sm">₹{product.originalPrice}</span>
                  )}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {products.length > 3 && (
          <>
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-teal-500" />
            </button>

            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-teal-500" />
            </button>
          </>
        )}
      </div>
    </section>
  )
}
