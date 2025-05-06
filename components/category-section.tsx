"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { fetchCategories } from "@/lib/api"
import type { Category } from "@/lib/types"

export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data.slice(0, 3)) // Limit to 3 categories for display
      } catch (error) {
        console.error("Error fetching categories:", error)
        setError("Failed to load categories")
      } finally {
        setLoading(false)
      }
    }

    getCategories()
  }, [])

  // Fallback images for categories
  const categoryImages = [
    "/shimmering-silver-collection.png",
    "/silver-nose-ring-collection.png",
    "/delicate-silver-earrings.png",
  ]

  if (loading) {
    return (
      <section className="w-full flex flex-col md:flex-row">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="w-full md:w-1/3 h-[60vh] bg-gray-200 animate-pulse"></div>
        ))}
      </section>
    )
  }

  if (error || categories.length === 0) {
    // Fallback to default categories if there's an error or no categories
    const fallbackCategories = [
      { _id: "necklaces", name: "Necklaces", link: "/collection" },
      { _id: "nose-piercings", name: "Nose Piercings", link: "/collection" },
      { _id: "earrings", name: "Earrings", link: "/collection" },
    ]

    return (
      <section className="w-full flex flex-col md:flex-row">
        {fallbackCategories.map((category, index) => (
          <div
            key={category._id}
            className="w-full md:w-1/3 h-[60vh] bg-cover bg-center relative"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0) 100%), url('${categoryImages[index]}')`,
            }}
          >
            <div className="absolute bottom-0 left-0 w-full p-8 text-center">
              <h4 className="text-xl md:text-2xl font-bold text-white mb-2">{category.name}</h4>
              <Link href={category.link} className="tertiary-button">
                Browse Catalogue
              </Link>
            </div>
          </div>
        ))}
      </section>
    )
  }

  return (
    <section className="w-full flex flex-col md:flex-row">
      {categories.map((category, index) => (
        <div
          key={category._id}
          className="w-full md:w-1/3 h-[60vh] bg-cover bg-center relative"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0) 100%), url('${categoryImages[index]}')`,
          }}
        >
          <div className="absolute bottom-0 left-0 w-full p-8 text-center">
            <h4 className="text-xl md:text-2xl font-bold text-white mb-2">{category.name}</h4>
            <Link href={`/collection?category=${category._id}`} className="tertiary-button">
              Browse Catalogue
            </Link>
          </div>
        </div>
      ))}
    </section>
  )
}
