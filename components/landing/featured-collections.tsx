"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { fetchCategories, fetchProducts } from "@/lib/api"
import { fetchCategoryProductCounts } from "@/lib/category-utils"
import type { Category } from "@/lib/types"

// Fallback collections in case API fails
const fallbackCollections = [
  {
    _id: "necklaces",
    name: "Necklaces",
    image: "/shimmering-silver-collection.png",
    count: "24 Products",
  },
  {
    _id: "earrings",
    name: "Earrings",
    image: "/delicate-silver-earrings.png",
    count: "18 Products",
  },
  {
    _id: "nose-rings",
    name: "Nose Rings",
    image: "/silver-nose-ring-collection.png",
    count: "12 Products",
  },
  {
    _id: "bracelets",
    name: "Bracelets",
    image: "/silver-cuff-detail.png",
    count: "15 Products",
  },
]

// Placeholder image path
const PLACEHOLDER_IMAGE = "/images/tp-placeholder-img.jpg"

export function FeaturedCollections() {
  const [categories, setCategories] = useState<Category[]>([])
  const [productCounts, setProductCounts] = useState<Record<string, number>>({})
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories()
        // Limit to 4 categories for display
        const limitedCategories = data.slice(0, 4)
        setCategories(limitedCategories)

        // Fetch product counts for each category
        const counts = await fetchCategoryProductCounts(limitedCategories.map((cat) => cat._id))
        setProductCounts(counts)

        // Fetch random product images for each category
        const imageMap: Record<string, string> = {}

        // Process each category to get a random product image
        await Promise.all(
          limitedCategories.map(async (category) => {
            try {
              // Fetch products for this category
              const products = await fetchProducts(category._id)

              if (products && products.length > 0) {
                // Select a random product from the category
                const randomIndex = Math.floor(Math.random() * products.length)
                const randomProduct = products[randomIndex]

                // Use the first image from the product, or fallback to placeholder
                if (randomProduct.images && randomProduct.images.length > 0 && randomProduct.images[0]) {
                  imageMap[category._id] = randomProduct.images[0]
                } else {
                  imageMap[category._id] = PLACEHOLDER_IMAGE
                }
              } else {
                // No products found, use placeholder
                imageMap[category._id] = PLACEHOLDER_IMAGE
              }
            } catch (err) {
              console.error(`Error fetching products for category ${category.name}:`, err)
              imageMap[category._id] = PLACEHOLDER_IMAGE
            }
          }),
        )

        setCategoryImages(imageMap)
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    getCategories()
  }, [])

  // Format product count with proper pluralization
  const formatProductCount = (count: number) => {
    return `${count} ${count === 1 ? "Product" : "Products"}`
  }

  // Use API categories if available, otherwise use fallback
  const displayCollections =
    categories.length > 0
      ? categories.map((cat) => ({
          ...cat,
          image: categoryImages[cat._id] || PLACEHOLDER_IMAGE,
          count: productCounts[cat._id] !== undefined ? formatProductCount(productCounts[cat._id]) : "Loading...",
        }))
      : fallbackCollections

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Collections</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our carefully curated collections of handcrafted silver jewelry, each piece telling a unique story
            of artistry and elegance.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCollections.map((collection, index) => (
              <motion.div
                key={collection._id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/collection?category=${collection._id}`}>
                  <div className="group relative h-80 overflow-hidden rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                    <Image
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement
                        target.src = PLACEHOLDER_IMAGE
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                      <h3 className="text-xl font-bold mb-1">{collection.name}</h3>
                      <p className="text-white/80 text-sm">{collection.count}</p>
                      <div className="mt-3 overflow-hidden h-[2px]">
                        <div className="w-full h-full bg-teal-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
