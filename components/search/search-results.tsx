"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Loader2 } from "lucide-react"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface SearchResultsProps {
  results: Product[]
  isLoading: boolean
  searchQuery: string
  onResultClick: () => void
}

function SearchResults({ results, isLoading, searchQuery, onResultClick }: SearchResultsProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const resultRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const router = useRouter()

  // Group products by name and category to avoid duplicates with different sizes
  const groupedResults = useMemo(() => {
    const productMap = new Map<string, Product>()

    results.forEach((product) => {
      const key = `${product.name}-${product.category}`

      // If this is the first product with this name+category, add it to the map
      if (!productMap.has(key)) {
        productMap.set(key, product)
      }
    })

    // Convert map values back to array
    return Array.from(productMap.values())
  }, [results])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1)
    resultRefs.current = resultRefs.current.slice(0, groupedResults.length)
  }, [groupedResults])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!groupedResults.length) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < groupedResults.length - 1 ? prev + 1 : prev))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault()
        resultRefs.current[selectedIndex]?.click()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [groupedResults.length, selectedIndex])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0) {
      resultRefs.current[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }, [selectedIndex])

  if (isLoading) {
    return (
      <div className="fixed mt-10 top-[125px] md:top-[165px] left-0 right-0 bg-white shadow-lg rounded-b-lg z-[100] p-4 mx-4 md:mx-auto md:max-w-3xl lg:max-w-4xl">
        <div className="flex items-center justify-center py-8 mt-50">
          <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
          <span className="ml-2 text-gray-600">Searching...</span>
        </div>
      </div>
    )
  }

  if (results.length === 0 && searchQuery) {
    return (
      <div className="fixed mt-10 top-[125px] md:top-[165px] left-0 right-0 bg-white shadow-lg rounded-b-lg z-[100] p-4 mx-4 md:mx-auto md:max-w-3xl lg:max-w-4xl">
        <div className="flex flex-col items-center justify-center py-8">
          <Search className="h-12 w-12 text-gray-300 mb-2" />
          <p className="text-gray-600 text-center">No products found for "{searchQuery}"</p>
          <p className="text-gray-500 text-sm text-center mt-1">Try a different search term</p>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return null
  }

  return (
    <div className="fixed mt-10 top-[125px] md:top-[165px] left-0 right-0 bg-white shadow-lg rounded-b-lg z-[100] mx-4 md:mx-auto md:max-w-3xl lg:max-w-4xl max-h-[60vh] overflow-y-auto">
      <div className="p-2">
        <h3 className="text-sm font-medium text-gray-500 px-2 py-1">
          {groupedResults.length} {groupedResults.length === 1 ? "result" : "results"} found
        </h3>

        <div className="grid grid-cols-1 gap-2">
          {groupedResults.map((product, index) => (
            <Link
              href={`/product/${product._id}`}
              key={product._id}
              ref={(el) => (resultRefs.current[index] = el)}
              onClick={onResultClick}
              className={`flex items-center p-2 rounded-md transition-colors ${
                selectedIndex === index ? "bg-teal-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="w-16 h-16 relative flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                <Image
                  src={product.images[0] || "/images/tp-placeholder-img.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-3 flex-grow">
                <h4 className="font-medium text-gray-900 line-clamp-1">{product.name}</h4>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {product.category} {product.material && `• ${product.material}`}
                </p>
                <div className="flex items-center mt-1">
                  <span className="font-medium text-teal-600">{formatPrice(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="ml-2 text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Button
          variant="ghost"
          className="w-full text-center justify-center mt-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
          onClick={() => {
            const path = `/collection?search=${encodeURIComponent(searchQuery)}`

            // Check if we're already on the collection page
            if (window.location.pathname === "/collection") {
              // Dispatch the custom event
              const searchEvent = new CustomEvent("search-query-updated", {
                detail: { query: searchQuery, totalResults: results.length },
              })
              window.dispatchEvent(searchEvent)

              // Update URL without page reload
              const newUrl = `/collection?search=${encodeURIComponent(searchQuery)}`
              window.history.pushState({}, "", newUrl)
            } else {
              // Navigate to collection page with search
              router.push(path)
            }

            onResultClick()
          }}
        >
          View all {results.length} results
        </Button>
      </div>
    </div>
  )
}

export { SearchResults }
