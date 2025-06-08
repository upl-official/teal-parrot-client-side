"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { fetchProductById } from "@/lib/api"
import type { Product } from "@/lib/types"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FeaturedProductSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Product IDs to fetch
  const productIds = ["68454acaa4e7cb66dda15e7d", "68454c7aa4e7cb66dda15f3a", "684551eaa4e7cb66dda16310"]

  // Fetch all products
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true)
      const productPromises = productIds.map(async (id) => {
        try {
          return await fetchProductById(id)
        } catch (error) {
          console.error(`Error fetching product with ID ${id}:`, error)
          return null
        }
      })

      const fetchedProducts = (await Promise.all(productPromises)).filter(Boolean) as Product[]
      setProducts(fetchedProducts)
      setLoading(false)
    }

    getProducts()

    // Clean up function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (products.length <= 1) return

    const startAutoScroll = () => {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)
      }, 5000) // Change product every 5 seconds
    }

    startAutoScroll()

    // Clean up timer when component unmounts
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [products.length])

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length)

    // Restart auto-scroll after user interaction
    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)
    }, 5000)
  }, [products.length])

  const goToNext = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)

    // Restart auto-scroll after user interaction
    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)
    }, 5000)
  }, [products.length])

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-lg max-w-2xl mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null // Hide section if there are no products
  }

  const currentProduct = products[currentIndex]

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Masterpiece</h2>
          <div className="w-16 h-1 bg-teal-500 mx-auto"></div>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Previous button */}
          {products.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Previous product"
            >
              <ChevronLeft className="h-6 w-6 text-teal-600" />
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href={`/product/${currentProduct._id}`} className="block">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl"
                >
                  <div className="grid md:grid-cols-2">
                    <div className="relative h-[300px] md:h-[400px]">
                      <Image
                        src={currentProduct.images[0] || "/images/tp-placeholder-img.jpg"}
                        alt={currentProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{currentProduct.name}</h3>
                      <p className="text-gray-600 mb-6 line-clamp-4">{currentProduct.description}</p>
                      <div className="flex items-center text-teal-600 font-medium group">
                        <Button className="justify-center font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg rounded-md flex items-center gap-2 group">
                          View Details
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-arrow-right h-5 w-5 transition-transform group-hover:translate-x-1"
                          >
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Next button */}
          {products.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Next product"
            >
              <ChevronRight className="h-6 w-6 text-teal-600" />
            </button>
          )}
        </div>

        {/* Product indicator dots */}
        {products.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (timerRef.current) clearInterval(timerRef.current)
                  setCurrentIndex(index)
                  // Restart auto-scroll after user interaction
                  timerRef.current = setInterval(() => {
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)
                  }, 5000)
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-teal-600 w-4" : "bg-gray-300"
                }`}
                aria-label={`View product ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
