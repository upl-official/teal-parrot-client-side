"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { fetchCategories, fetchProducts } from "@/lib/api"
import type { Category } from "@/lib/types"

// Placeholder image path
const PLACEHOLDER_IMAGE = "/images/tp-placeholder-img.jpg"

export function BrandCollections() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data)

        // Fetch random product images for each category
        const imageMap: Record<string, string> = {}

        // Process each category to get a random product image
        await Promise.all(
          data.map(async (category) => {
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

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-semibold mb-6 text-teal-500">Our Collections</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of handcrafted silver jewelry collections, each with its own unique character and
            story.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>Unable to load collections. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/collection?category=${category._id}`}>
                  <div className="group relative h-64 overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                    <Image
                      src={categoryImages[category._id] || PLACEHOLDER_IMAGE}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement
                        target.src = PLACEHOLDER_IMAGE
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
                      <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                      <div className="mt-2 overflow-hidden h-[2px]">
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
