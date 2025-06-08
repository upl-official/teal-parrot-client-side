"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { fetchSimilarProducts } from "@/lib/api"
import type { Product } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { ProductImage } from "@/components/ui/product-image"
import { formatPrice } from "@/lib/utils"

// Add the placeholder image constant at the top of the file, after the imports
const PLACEHOLDER_IMAGE = "/images/tp-placeholder-img.jpg"

// Utility function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export function SimilarProducts({
  category,
  currentProductId,
  currentProductName,
}: {
  category?: string
  currentProductId?: string
  currentProductName?: string
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true)
        const data = await fetchSimilarProducts(category)

        // Filter out the current product and its variants (products with the same name)
        let filteredProducts = data

        if (currentProductId) {
          // Remove the current product
          filteredProducts = filteredProducts.filter((product) => product._id !== currentProductId)
        }

        if (currentProductName) {
          // Remove products with the same name (variants/sizes of the same product)
          filteredProducts = filteredProducts.filter((product) => product.name !== currentProductName)
        }

        // Shuffle the products for random display
        const shuffledProducts = shuffleArray(filteredProducts)

        // Limit to 8 products for display
        setProducts(shuffledProducts.slice(0, 8))
      } catch (error) {
        console.error("Error fetching similar products:", error)
        setError("Failed to load similar products. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    getProducts()
  }, [category, currentProductId, currentProductName])

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
            <h3 className="text-2xl font-bold text-teal-500">Similar Products</h3>
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
            <h3 className="text-2xl font-bold text-teal-500">Similar Products</h3>
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
            <h3 className="text-2xl font-bold text-teal-500">Similar Products</h3>
            <Link
              href="/collection"
              className="text-teal-500 border border-teal-500 px-4 py-2 rounded hover:bg-teal-500 hover:text-white transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">No similar products available at the moment.</p>
            <p className="text-gray-500 mt-2">Check out our full collection for more options.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 relative">
        <div className="flex justify-between items-end border-b-2 border-teal-500 pb-2 mb-8">
          <h3 className="text-2xl font-bold text-teal-500">Similar Products</h3>
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
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg">
                  <ProductImage
                    src={product.images[0] || "/placeholder.svg?height=400&width=300&query=silver jewelry"}
                    alt={product.name}
                    width={250}
                    height={350}
                    className="w-[250px] h-[350px] transition-transform duration-300 group-hover:scale-105"
                    objectFit="cover" // Ensure this is set to "cover"
                  />
                  {product.discountPercentage && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                      {Math.round(product.discountPercentage)}% OFF
                    </div>
                  )}
                </div>
                <h4 className="mt-2 text-gray-900">{product.name}</h4>
                <div className="flex items-center gap-2">
                  <h3 className="font-montserrat font-semibold text-gray-900">{formatPrice(product.price)}</h3>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-gray-500 line-through text-sm">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
              </div>
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
