"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { fetchProductById } from "@/lib/api"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"

// Default placeholder image path
const PLACEHOLDER_IMAGE = "/images/tp-placeholder-img.jpg"

export function FeaturedProducts() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [groupedProducts, setGroupedProducts] = useState<Record<string, Product[]>>({})
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const productIds = [
    "67254422d6e125906ef60c21",
    "67254f7b7b8e3ef7d0fcea1b",
    "681a2e47e25bfb5f536c9f77",
    "681dbe056675de8385b64fac",
    "681dbe086675de8385b64fb2",
  ]

  const groupProductsByNameAndCategory = useCallback((products: Product[]) => {
    const groups: Record<string, Product[]> = {}

    products.forEach((product) => {
      const key = `${product.name}-${product.category}`
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(product)
    })

    return groups
  }, [])

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

      // Group products by name and category
      const grouped = groupProductsByNameAndCategory(fetchedProducts)
      setGroupedProducts(grouped)

      // Initialize selected sizes with the first size of each group
      const initialSelectedSizes: Record<string, string> = {}
      Object.entries(grouped).forEach(([key, products]) => {
        if (products.length > 0 && products[0].size) {
          initialSelectedSizes[key] = products[0].size
        }
      })
      setSelectedSizes(initialSelectedSizes)

      // Set products state to the first product of each group for backward compatibility
      const representativeProducts = Object.values(grouped).map((group) => group[0])
      setProducts(representativeProducts)

      setLoading(false)
    }

    getProducts()

    // Clean up function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [groupProductsByNameAndCategory])

  const handleSizeSelect = useCallback(
    (groupKey: string, size: string, e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // Find the product with this size
      const productsInGroup = groupedProducts[groupKey] || []
      const productWithSize = productsInGroup.find((p) => p.size === size)

      if (productWithSize) {
        setSelectedSizes((prev) => ({
          ...prev,
          [groupKey]: size,
        }))
      }
    },
    [groupedProducts],
  )

  const navigateToProduct = useCallback(
    (productId: string) => {
      router.push(`/product/${productId}`)
    },
    [router],
  )

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }))
  }

  // Fallback products if API fails
  const fallbackProducts = [
    {
      _id: "1",
      name: "Silver Filigree Necklace",
      price: 2499,
      originalPrice: 2999,
      discountPercentage: 17,
      images: ["/delicate-silver-filigree.png"],
    },
    {
      _id: "2",
      name: "Elegant Silver Earrings",
      price: 1899,
      originalPrice: 2199,
      discountPercentage: 14,
      images: ["/delicate-silver-earrings.png"],
    },
    {
      _id: "3",
      name: "Silver Nose Ring",
      price: 999,
      originalPrice: 1299,
      discountPercentage: 23,
      images: ["/silver-nose-ring-close-up.png"],
    },
    {
      _id: "4",
      name: "Silver Cuff Bracelet",
      price: 1799,
      originalPrice: 2099,
      discountPercentage: 14,
      images: ["/silver-cuff-detail.png"],
    },
  ]

  const displayProducts = products.length > 0 ? products : fallbackProducts

  return (
    <section className="py-20 bg-gray-50" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <span className="text-teal-500 font-medium mb-2 block">Handpicked Selection</span>
            <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>
          </div>
          <Link href="/collection" className="mt-4 md:mt-0">
            <Button variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-50">
              View All Products
            </Button>
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <div className="relative">
            <div ref={containerRef} className="flex overflow-x-auto gap-8 pb-8 hide-scrollbar snap-x snap-mandatory">
              {products.map((product, index) => {
                const groupKey = `${product.name}-${product.category}`
                const groupProducts = groupedProducts[groupKey] || []
                const availableSizes = groupProducts.map((p) => p.size).filter(Boolean) as string[]
                const selectedSize = selectedSizes[groupKey] || availableSizes[0] || ""

                // Find the product with the selected size
                const selectedProduct = groupProducts.find((p) => p.size === selectedSize) || product

                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                    onMouseEnter={() => setHoveredProduct(groupKey)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <div className="relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl min-w-[300px] sm:min-w-[340px]">
                      <div className="relative cursor-pointer" onClick={() => navigateToProduct(selectedProduct._id)}>
                        <div className="relative h-80 overflow-hidden">
                          <Image
                            src={selectedProduct.images[0] || "/images/tp-placeholder-img.jpg"}
                            alt={selectedProduct.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {selectedProduct.discountPercentage && selectedProduct.discountPercentage > 0 && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                              {selectedProduct.discountPercentage}% OFF
                            </div>
                          )}
                        </div>

                        {availableSizes.length > 1 && (
                          <AnimatePresence>
                            {hoveredProduct === groupKey && (
                              <motion.div
                                className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 transition-all duration-300"
                                onClick={(e) => e.stopPropagation()} // Prevent navigating when clicking the size selector area
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                              >
                                <p className="text-sm text-white/90 mb-2 font-medium">Select Size:</p>
                                <div className="flex flex-wrap gap-2">
                                  {availableSizes.map((size) => {
                                    // Find the specific product with this size
                                    const productWithThisSize = groupProducts.find((p) => p.size === size)
                                    const productId = productWithThisSize?._id || selectedProduct._id

                                    return (
                                      <motion.button
                                        key={size}
                                        onClick={(e) => {
                                          e.stopPropagation() // Prevent parent click
                                          handleSizeSelect(groupKey, size, e)
                                          // Navigate to the product page with the correct ID
                                          navigateToProduct(productId)
                                        }}
                                        className={`min-w-[40px] h-8 px-3 text-sm font-medium rounded-md transition-all flex items-center justify-center ${
                                          selectedSize === size
                                            ? "bg-teal-500 text-white"
                                            : "bg-white/90 text-gray-800 hover:bg-teal-100"
                                        }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        {size}
                                      </motion.button>
                                    )
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </div>

                      <div className="p-5">
                        <h3
                          className="text-lg font-medium text-gray-900 mb-1 cursor-pointer"
                          onClick={() => navigateToProduct(selectedProduct._id)}
                        >
                          {selectedProduct.name}
                        </h3>

                        {selectedSize && (
                          <div className="mt-1 mb-2">
                            <p className="text-sm text-gray-500">
                              Size: <span className="font-medium">{selectedSize}</span>
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-gray-900">₹{selectedProduct.price}</span>
                            {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{selectedProduct.originalPrice}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => navigateToProduct(selectedProduct._id)}
                            className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center"
                          >
                            View
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10 hidden md:block"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-teal-500" />
            </button>

            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10 hidden md:block"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-teal-500" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
