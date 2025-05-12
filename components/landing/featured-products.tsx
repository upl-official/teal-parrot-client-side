"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight, ShoppingBag, Heart } from "lucide-react"
import { fetchFeaturedProducts } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"

// Default placeholder image path
const PLACEHOLDER_IMAGE = "/images/tp-placeholder-img.jpg"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchFeaturedProducts()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching featured products:", error)
      } finally {
        setLoading(false)
      }
    }

    getProducts()
  }, [])

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
            <div ref={containerRef} className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x snap-mandatory">
              {displayProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="min-w-[280px] sm:min-w-[320px] snap-start"
                >
                  <Link href={`/product/${product._id}`}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
                      <div className="relative h-[320px] overflow-hidden">
                        <Image
                          src={imageErrors[product._id] ? PLACEHOLDER_IMAGE : product.images[0] || PLACEHOLDER_IMAGE}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={() => handleImageError(product._id)}
                        />
                        {product.discountPercentage && (
                          <Badge className="absolute top-3 right-3 bg-red-500 text-white border-none">
                            {product.discountPercentage}% OFF
                          </Badge>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex gap-2 justify-center">
                            <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0">
                              <ShoppingBag className="h-5 w-5" />
                            </Button>
                            <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0">
                              <Heart className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-lg mb-1 truncate">{product.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">₹{product.price}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-gray-500 line-through text-sm">₹{product.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
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
