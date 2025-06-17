"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  ShoppingCart,
  Share2,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  HeartIcon as HeartFilled,
  ZoomIn,
  Check,
  X,
  Ruler,
} from "lucide-react"
import {
  fetchProductById,
  fetchProducts,
  addToCart,
  addToWishlist,
  getCurrentUserId,
  fetchWishlistItems,
} from "@/lib/api"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { redirectToLogin } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { formatPrice } from "@/lib/utils"
import { SimilarProducts } from "@/components/similar-products"
import type { Address } from "@/lib/types"

// Define the SizeVariant type
interface SizeVariant {
  id: string
  size: string
  price: number
  originalPrice?: number
  stock: number
  images: string[]
}

// Default placeholder image path
const PLACEHOLDER_IMAGE = "/images/tp-placeholder-img.jpg"

// Add this function before the ProductDetail component to format the description
function formatDescription(description: string): React.ReactNode[] {
  if (!description) return [<p key="empty">No description available for this product.</p>]

  try {
    // First replace \r\n with <br> for consistent processing
    const normalizedDescription = description.replace(/\r\n/g, "<br>")

    // Split by <br> tags to handle line breaks
    const paragraphs = normalizedDescription.split("<br>")

    const result: React.ReactNode[] = []
    let inList = false
    let listItems: React.ReactNode[] = []

    paragraphs.forEach((paragraph, index) => {
      // Skip empty paragraphs but render a line break
      if (!paragraph.trim()) {
        // If we're not in a list, add a line break
        if (!inList) {
          result.push(<br key={`br-${index}`} />)
        }
        return
      }

      // Check if this paragraph contains a heading tag
      if (paragraph.includes("<h>") && paragraph.includes("</h>")) {
        // If we were in a list, close it before adding the heading
        if (inList && listItems.length > 0) {
          result.push(
            <ul key={`list-${index}`} className="ml-5 my-3 space-y-1">
              {listItems}
            </ul>,
          )
          listItems = []
          inList = false
        }

        // Extract the heading text
        const headingMatch = paragraph.match(/<h>(.*?)<\/h>/)
        if (headingMatch) {
          const headingText = headingMatch[1]
          const parts = paragraph.split(/<h>.*?<\/h>/)

          // Add text before heading if it exists
          if (parts[0].trim()) {
            result.push(
              <p key={`pre-heading-${index}`} className="mb-2">
                {formatInlineStyles(parts[0])}
              </p>,
            )
          }

          // Add the heading with proper spacing
          result.push(
            <h3 key={`heading-${index}`} className="text-lg font-semibold my-3">
              {formatInlineStyles(headingText)}
            </h3>,
          )

          // Add text after heading if it exists
          if (parts[1] && parts[1].trim()) {
            result.push(
              <p key={`post-heading-${index}`} className="mb-2">
                {formatInlineStyles(parts[1])}
              </p>,
            )
          }
        }
        return
      }

      // Check if this is a list item
      if (paragraph.trim().startsWith("=>")) {
        const listItemText = paragraph.trim().substring(2).trim()
        listItems.push(<li key={`list-item-${index}`}>{formatInlineStyles(listItemText)}</li>)
        inList = true
        return
      } else if (inList) {
        // If we were in a list but this paragraph is not a list item, close the list
        result.push(
          <ul key={`list-${index}`} className="ml-5 my-3 space-y-1">
            {listItems}
          </ul>,
        )
        listItems = []
        inList = false
      }

      // Regular paragraph with inline formatting
      result.push(
        <p key={`p-${index}`} className="mb-2">
          {formatInlineStyles(paragraph)}
        </p>,
      )
    })

    // If we ended with an open list, close it
    if (inList && listItems.length > 0) {
      result.push(
        <ul key="final-list" className="ml-5 my-3 space-y-1">
          {listItems}
        </ul>,
      )
    }

    return result
  } catch (error) {
    console.error("Error formatting description:", error)
    return [<p key="error">Description formatting error. Please contact support.</p>]
  }
}

// Helper function to handle inline text formatting
function formatInlineStyles(text: string): React.ReactNode[] {
  try {
    let result: React.ReactNode[] = []
    let currentText = text
    let lastIndex = 0

    // Handle bold text (*text*)
    const boldRegex = /\*(.*?)\*/g
    let boldMatch
    while ((boldMatch = boldRegex.exec(currentText)) !== null) {
      if (boldMatch.index > lastIndex) {
        result.push(currentText.substring(lastIndex, boldMatch.index))
      }
      result.push(<strong key={`bold-${boldMatch.index}`}>{boldMatch[1]}</strong>)
      lastIndex = boldMatch.index + boldMatch[0].length
    }

    // Add remaining text after processing bold
    if (lastIndex < currentText.length) {
      currentText = currentText.substring(lastIndex)
      lastIndex = 0
    } else {
      return result
    }

    // Handle italic text (_text_)
    const italicRegex = /_(.*?)_/g
    let tempResult: React.ReactNode[] = []
    let italicMatch

    while ((italicMatch = italicRegex.exec(currentText)) !== null) {
      if (italicMatch.index > lastIndex) {
        tempResult.push(currentText.substring(lastIndex, italicMatch.index))
      }
      tempResult.push(<em key={`italic-${italicMatch.index}`}>{italicMatch[1]}</em>)
      lastIndex = italicMatch.index + italicMatch[0].length
    }

    // Add remaining text after processing italic
    if (lastIndex < currentText.length) {
      tempResult.push(currentText.substring(lastIndex))
    }

    // If we processed any italic text, update result and currentText
    if (tempResult.length > 0) {
      result = [...result, ...tempResult]
      return result
    }

    // Handle strikethrough text (~text~)
    const strikeRegex = /~(.*?)~/g
    let strikeMatch
    tempResult = []
    lastIndex = 0

    while ((strikeMatch = strikeRegex.exec(currentText)) !== null) {
      if (strikeMatch.index > lastIndex) {
        tempResult.push(currentText.substring(lastIndex, strikeMatch.index))
      }
      tempResult.push(<del key={`strike-${strikeMatch.index}`}>{strikeMatch[1]}</del>)
      lastIndex = strikeMatch.index + strikeMatch[0].length
    }

    // Add remaining text after processing strikethrough
    if (lastIndex < currentText.length) {
      tempResult.push(currentText.substring(lastIndex))
    }

    // If we processed any strikethrough text, update result
    if (tempResult.length > 0) {
      result = [...result, ...tempResult]
      return result
    }

    // If no formatting was applied, return the original text
    return [currentText]
  } catch (error) {
    console.error("Error formatting inline styles:", error)
    return [text] // Return original text if there's an error
  }
}

// Helper function to calculate distance between two touch points
const getTouchDistance = (touch1: Touch, touch2: Touch) => {
  const dx = touch1.clientX - touch2.clientX
  const dy = touch1.clientY - touch2.clientY
  return Math.sqrt(dx * dx + dy * dy)
}

// Helper function to get center point between two touches
const getTouchCenter = (touch1: Touch, touch2: Touch) => {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2,
  }
}

export function ProductDetail({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState("")
  const [error, setError] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})
  const [sizeVariants, setSizeVariants] = useState<SizeVariant[]>([])
  const [selectedSizeVariant, setSelectedSizeVariant] = useState<SizeVariant | null>(null)
  const [isUpdatingVariant, setIsUpdatingVariant] = useState(false)

  // Add or update these zoom-related states
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(2) // Zoom magnification level
  const [showZoomModal, setShowZoomModal] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Enhanced mobile zoom states
  const [mobileZoomScale, setMobileZoomScale] = useState(1)
  const [mobileZoomPosition, setMobileZoomPosition] = useState({ x: 0, y: 0 })
  const [isPinching, setIsPinching] = useState(false)
  const [lastPinchDistance, setLastPinchDistance] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const zoomContainerRef = useRef<HTMLDivElement>(null)

  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  // New states for direct purchase flow
  const [showAddressDialog, setShowAddressDialog] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [processingOrder, setProcessingOrder] = useState(false)

  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Reset zoom state
  const resetZoom = () => {
    setMobileZoomScale(1)
    setMobileZoomPosition({ x: 0, y: 0 })
    setIsPinching(false)
    setLastPinchDistance(0)
  }

  // Navigate to next/previous image
  const navigateImage = (direction: "next" | "prev") => {
    if (!selectedSizeVariant?.images || selectedSizeVariant.images.length <= 1) return

    const currentIndex = selectedSizeVariant.images.indexOf(mainImage)
    let newIndex

    if (direction === "next") {
      newIndex = currentIndex < selectedSizeVariant.images.length - 1 ? currentIndex + 1 : 0
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : selectedSizeVariant.images.length - 1
    }

    setMainImage(selectedSizeVariant.images[newIndex])
    setCurrentImageIndex(newIndex)
    resetZoom() // Reset zoom when changing images
  }

  // Fetch the main product and its size variants
  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true)
        // Fetch the main product
        const mainProduct = await fetchProductById(productId)

        if (!mainProduct) {
          setError("Product not found")
          setLoading(false)
          return
        }

        setProduct(mainProduct)

        // Set default main image
        if (mainProduct.images && mainProduct.images.length > 0) {
          setMainImage(mainProduct.images[0])
        } else {
          setMainImage(PLACEHOLDER_IMAGE)
        }

        // Initialize the selected size variant with the current product
        const currentVariant: SizeVariant = {
          id: mainProduct._id,
          size: mainProduct.size || "Default",
          price: mainProduct.price || 0,
          originalPrice: mainProduct.originalPrice,
          stock: mainProduct.stock || 0,
          images: mainProduct.images || [],
        }
        setSelectedSizeVariant(currentVariant)

        try {
          // Now fetch all products to find variants with the same name
          const allProducts = await fetchProducts()

          // Find variants with the same name and category but different sizes
          const variants = allProducts
            .filter(
              (p) =>
                p.name === mainProduct.name &&
                p.category === mainProduct.category &&
                p._id !== mainProduct._id &&
                p.size, // Only include products that have a size
            )
            .map((p) => ({
              id: p._id,
              size: p.size || "Default",
              price: p.price || 0,
              originalPrice: p.originalPrice,
              stock: p.stock || 0,
              images: p.images || [],
            }))

          // Add the current product to the variants list
          const allVariants = [currentVariant, ...variants].sort((a, b) => {
            // Try to sort numerically if possible
            const aSize = Number.parseFloat(a.size)
            const bSize = Number.parseFloat(b.size)
            if (!isNaN(aSize) && !isNaN(bSize)) {
              return aSize - bSize
            }
            // Fall back to string comparison
            return a.size.localeCompare(b.size)
          })

          setSizeVariants(allVariants)
        } catch (variantsError) {
          console.error("Error fetching variants:", variantsError)
          // Still set the current variant even if we can't fetch others
          setSizeVariants([currentVariant])
        }

        // Check if product is in wishlist
        try {
          const userId = getCurrentUserId()
          if (userId) {
            const wishlistItems = await fetchWishlistItems(userId)
            const isInList = wishlistItems.some((item) => item.product._id === productId)
            setIsInWishlist(isInList)
          }
        } catch (wishlistError) {
          console.error("Error checking wishlist status:", wishlistError)
          // Non-critical error, continue without setting wishlist status
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Failed to load product details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    getProduct()
  }, [productId])

  // Handle size variant selection
  const handleSizeSelect = useCallback(
    async (variant: SizeVariant) => {
      if (!variant || selectedSizeVariant?.id === variant.id) return

      setIsUpdatingVariant(true)
      setSelectedSizeVariant(variant)

      try {
        // Update URL with the selected variant ID without navigating
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href)
          url.searchParams.set("variant", variant.id)
          window.history.pushState({ path: url.toString() }, "", url.toString())
        }

        // If this is a different product ID than the current one, fetch its details
        if (variant.id !== productId) {
          try {
            const variantProduct = await fetchProductById(variant.id)

            if (variantProduct) {
              // Update product details
              setProduct(variantProduct)

              // Update main image if there are variant-specific images
              if (variantProduct.images && variantProduct.images.length > 0) {
                setMainImage(variantProduct.images[0])
              }

              // Check if this variant is in the wishlist
              const userId = getCurrentUserId()
              if (userId) {
                try {
                  const wishlistItems = await fetchWishlistItems(userId)
                  const isInList = wishlistItems.some((item) => item.product._id === variant.id)
                  setIsInWishlist(isInList)
                } catch (error) {
                  console.error("Error checking wishlist status:", error)
                }
              }
            }
          } catch (error) {
            console.error("Error fetching variant product:", error)
            toast({
              title: "Error",
              description: "Failed to load product variant details. Please try again.",
              variant: "destructive",
            })
          }
        } else {
          // If it's the same product ID, just update the image if needed
          if (variant.images && variant.images.length > 0) {
            setMainImage(variant.images[0])
          }
        }

        // Reset quantity to 1 when changing variants
        setQuantity(1)
      } catch (error) {
        console.error("Error during variant selection:", error)
        toast({
          title: "Error",
          description: "Failed to select variant. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsUpdatingVariant(false)
      }
    },
    [productId, selectedSizeVariant?.id, toast],
  )

  // Reset added to cart state after 3 seconds
  useEffect(() => {
    if (addedToCart) {
      const timer = setTimeout(() => {
        setAddedToCart(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [addedToCart])

  // Handle image zoom functionality
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return

    const { left, top, width, height } = imageRef.current.getBoundingClientRect()

    // Calculate cursor position as percentage of image dimensions
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100))

    setZoomPosition({ x, y })
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!imageRef.current || e.touches.length !== 1) return

    const touch = e.touches[0]
    const { left, top, width, height } = imageRef.current.getBoundingClientRect()

    // Calculate touch position as percentage of image dimensions
    const x = Math.max(0, Math.min(100, ((touch.clientX - left) / width) * 100))
    const y = Math.max(0, Math.min(100, ((touch.clientY - top) / height) * 100))

    setZoomPosition({ x, y })
  }

  const handleTouchStart = () => {
    setIsZoomed(true)
  }

  const handleTouchEnd = () => {
    setIsZoomed(false)
  }

  const toggleZoomModal = () => {
    setShowZoomModal(!showZoomModal)
  }

  const handleImageError = (imageUrl: string) => {
    console.error(`Failed to load image: ${imageUrl}`)
    setFailedImages((prev) => ({ ...prev, [imageUrl]: true }))

    // If the main image failed to load, try to set another image as main
    if (imageUrl === mainImage && product?.images) {
      const nextValidImage = product.images.find((img) => !failedImages[img])
      if (nextValidImage) {
        setMainImage(nextValidImage)
      } else {
        // If all images failed, use the custom placeholder
        setMainImage(PLACEHOLDER_IMAGE)
      }
    }
  }

  const getImageSrc = (imageUrl: string) => {
    if (!imageUrl || failedImages[imageUrl]) {
      return PLACEHOLDER_IMAGE
    }
    return imageUrl
  }

  const handleAddToCart = async () => {
    if (!product || !selectedSizeVariant) return

    try {
      setIsAddingToCart(true)
      const userId = getCurrentUserId()
      if (!userId) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to add items to your cart",
          variant: "destructive",
        })
        // Use the current full path for redirect after login
        redirectToLogin(window.location.pathname)
        return
      }

      // Use the selected variant ID instead of the main product ID
      console.log("Adding to cart:", { userId, productId: selectedSizeVariant.id, quantity })
      await addToCart(userId, selectedSizeVariant.id, quantity)

      // Show success state
      setAddedToCart(true)

      toast({
        title: "Added to cart",
        description: `${product.name} (Size: ${selectedSizeVariant.size}) has been added to your cart.`,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  // Handle Buy Now button click - redirect to checkout with product parameters
  const handleBuyNow = async () => {
    if (!product || !selectedSizeVariant) return

    try {
      const userId = getCurrentUserId()
      if (!userId) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to proceed to checkout",
          variant: "destructive",
        })
        // Use the current full path for redirect after login
        redirectToLogin(window.location.pathname)
        return
      }

      // Redirect to checkout with product parameters for direct purchase
      const checkoutUrl = new URL("/checkout", window.location.origin)
      checkoutUrl.searchParams.set("productId", selectedSizeVariant.id)
      checkoutUrl.searchParams.set("quantity", quantity.toString())

      router.push(checkoutUrl.toString())
    } catch (error) {
      console.error("Error with buy now:", error)
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddToWishlist = async () => {
    if (!product || !selectedSizeVariant) return

    try {
      const userId = getCurrentUserId()
      if (!userId) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to add items to your wishlist",
          variant: "destructive",
        })
        // Use the current full path for redirect after login
        redirectToLogin(window.location.pathname)
        return
      }

      // Use the selected variant ID
      await addToWishlist(userId, selectedSizeVariant.id)
      setIsInWishlist(true)
      toast({
        title: "Added to wishlist",
        description: `${product.name} (Size: ${selectedSizeVariant.size}) has been added to your wishlist.`,
      })
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to add item to wishlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product?.name || "Check out this product",
          text: product?.description || "I found this amazing product",
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing:", error))
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
      })
    }
  }

  // Enhanced touch handling for mobile zoom
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [lastTap, setLastTap] = useState<number>(0)

  // Enhanced touch handlers for pinch-to-zoom
  const handleTouchStartEnhanced = (e: React.TouchEvent) => {
    e.preventDefault()

    if (e.touches.length === 1) {
      // Single touch - prepare for pan
      const touch = e.touches[0]
      setTouchStart({ x: touch.clientX, y: touch.clientY })

      // Handle double tap
      const now = Date.now()
      const timeDiff = now - lastTap
      if (timeDiff < 300 && timeDiff > 0) {
        // Double tap to zoom
        if (mobileZoomScale === 1) {
          setMobileZoomScale(2)
        } else {
          resetZoom()
        }
      }
      setLastTap(now)
    } else if (e.touches.length === 2) {
      // Two touches - start pinch
      setIsPinching(true)
      const distance = getTouchDistance(e.touches[0], e.touches[1])
      setLastPinchDistance(distance)
    }
  }

  const handleTouchMoveEnhanced = (e: React.TouchEvent) => {
    e.preventDefault()

    if (e.touches.length === 1 && !isPinching && mobileZoomScale > 1) {
      // Single touch pan when zoomed
      if (touchStart) {
        const touch = e.touches[0]
        const deltaX = touch.clientX - touchStart.x
        const deltaY = touch.clientY - touchStart.y

        // Calculate boundaries to prevent panning outside image
        const maxPanX = (mobileZoomScale - 1) * 150
        const maxPanY = (mobileZoomScale - 1) * 150

        const newX = Math.max(-maxPanX, Math.min(maxPanX, mobileZoomPosition.x + deltaX * 0.5))
        const newY = Math.max(-maxPanY, Math.min(maxPanY, mobileZoomPosition.y + deltaY * 0.5))

        setMobileZoomPosition({ x: newX, y: newY })
        setTouchStart({ x: touch.clientX, y: touch.clientY })
      }
    } else if (e.touches.length === 2 && isPinching) {
      // Two touches - pinch to zoom
      const distance = getTouchDistance(e.touches[0], e.touches[1])
      const scale = distance / lastPinchDistance

      const newScale = Math.max(1, Math.min(4, mobileZoomScale * scale))
      setMobileZoomScale(newScale)
      setLastPinchDistance(distance)

      // Reset position if zoomed out completely
      if (newScale === 1) {
        setMobileZoomPosition({ x: 0, y: 0 })
      }
    }
  }

  const handleTouchEndEnhanced = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setIsPinching(false)
      setTouchStart(null)
      setTouchEnd(null)
    } else if (e.touches.length === 1 && isPinching) {
      // Transition from pinch to single touch
      setIsPinching(false)
      const touch = e.touches[0]
      setTouchStart({ x: touch.clientX, y: touch.clientY })
    }
  }

  const handleTouchStartMobile = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      setTouchStart({ x: touch.clientX, y: touch.clientY })

      // Handle double tap to zoom
      const now = Date.now()
      const timeDiff = now - lastTap
      if (timeDiff < 300 && timeDiff > 0) {
        // Double tap detected
        setIsZoomed(!isZoomed)
      }
      setLastTap(now)
    }
  }

  const handleTouchEndMobile = (e: React.TouchEvent) => {
    if (!touchStart) return

    const touch = e.changedTouches[0]
    setTouchEnd({ x: touch.clientX, y: touch.clientY })

    // Handle swipe gestures for image navigation
    if (selectedSizeVariant?.images && selectedSizeVariant.images.length > 1) {
      const deltaX = touch.clientX - touchStart.x
      const deltaY = touch.clientY - touchStart.y

      // Only process horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        const currentIndex = selectedSizeVariant.images.indexOf(mainImage)
        if (deltaX > 0 && currentIndex > 0) {
          // Swipe right - previous image
          setMainImage(selectedSizeVariant.images[currentIndex - 1])
        } else if (deltaX < 0 && currentIndex < selectedSizeVariant.images.length - 1) {
          // Swipe left - next image
          setMainImage(selectedSizeVariant.images[currentIndex + 1])
        }
      }
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  // Add this useEffect after the existing useEffects
  useEffect(() => {
    if (showZoomModal) {
      resetZoom()
      // Set current image index
      if (selectedSizeVariant?.images) {
        const index = selectedSizeVariant.images.indexOf(mainImage)
        setCurrentImageIndex(index >= 0 ? index : 0)
      }
    }
  }, [showZoomModal, mainImage, selectedSizeVariant?.images])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <Alert variant="destructive" className="w-full max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button onClick={() => window.location.reload()} className="mt-4 w-full">
            Try Again
          </Button>
        </Alert>
      </div>
    )
  }

  if (!product || !selectedSizeVariant) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  // Calculate discount percentage if not provided
  const discountPercentage =
    selectedSizeVariant.originalPrice &&
    selectedSizeVariant.price < selectedSizeVariant.originalPrice &&
    selectedSizeVariant.originalPrice > 0
      ? Math.round(
          ((selectedSizeVariant.originalPrice - selectedSizeVariant.price) / selectedSizeVariant.originalPrice) * 100,
        )
      : 0

  return (
    <div className="bg-white">
      {/* Breadcrumb Navigation */}
      <nav className="container mx-auto px-4 py-4 flex items-center text-sm text-gray-500">
        <Link href="/" className="hover:text-teal-600">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link href="/collection" className="hover:text-teal-600">
          Collection
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image with Zoom */}
            <div className="aspect-square overflow-hidden rounded-lg relative border border-gray-200">
              {/* Regular image view */}
              <div
                ref={imageRef}
                className={`relative w-full h-full ${isMobile ? "cursor-pointer" : "cursor-zoom-in"}`}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => !isMobile && setIsZoomed(true)}
                onMouseLeave={() => !isMobile && setIsZoomed(false)}
                onTouchMove={handleTouchMove}
                onTouchStart={handleTouchStartMobile}
                onTouchEnd={handleTouchEndMobile}
                onClick={isMobile ? toggleZoomModal : undefined}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mainImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={
                        getImageSrc(mainImage) ||
                        (selectedSizeVariant?.images && selectedSizeVariant.images.length > 0
                          ? getImageSrc(selectedSizeVariant.images[0])
                          : PLACEHOLDER_IMAGE)
                      }
                      alt={product.name || "Product Image"}
                      width={600}
                      height={600}
                      className="object-cover w-full h-full"
                      priority
                      onError={() => handleImageError(mainImage)}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Loading overlay when updating variant */}
                {isUpdatingVariant && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                  </div>
                )}

                {/* Zoom lens overlay for desktop */}
                {!isMobile && isZoomed && !isUpdatingVariant && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <div
                      className="absolute inset-0 bg-no-repeat"
                      style={{
                        backgroundImage: `url(${
                          getImageSrc(mainImage) ||
                          (selectedSizeVariant?.images && selectedSizeVariant.images.length > 0
                            ? getImageSrc(selectedSizeVariant.images[0])
                            : PLACEHOLDER_IMAGE)
                        })`,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundSize: `${zoomLevel * 100}%`,
                        backgroundRepeat: "no-repeat",
                      }}
                    ></div>
                  </motion.div>
                )}

                {/* Zoom indicator */}
                <motion.div
                  className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full shadow-md"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <ZoomIn className="h-5 w-5 text-gray-700" />
                </motion.div>

                {/* Enhanced Instructions for mobile */}
                {isMobile && (
                  <motion.div
                    className="absolute bottom-4 left-4 right-16 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-2">
                      <ZoomIn className="h-3 w-3" />
                      <span>Tap to zoom • Double tap for quick zoom</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Zoom Controls (Desktop only) */}
              {!isMobile && (
                <motion.div
                  className="mt-3 flex items-center space-x-4 px-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-sm text-gray-500">Zoom level:</span>
                  <input
                    type="range"
                    min="1.5"
                    max="4"
                    step="0.5"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(Number.parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm font-medium w-8">{zoomLevel}x</span>
                </motion.div>
              )}
            </div>

            {/* Enhanced Zoom Modal for Mobile */}
            <AnimatePresence>
              {showZoomModal && isMobile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black z-[70] flex flex-col"
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  {/* Fixed Header */}
                  <div className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-black/90 backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <ZoomIn className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-sm truncate max-w-[200px]">{product.name}</h3>
                        <p className="text-white/70 text-xs">
                          {selectedSizeVariant?.images ? selectedSizeVariant.images.indexOf(mainImage) + 1 : 1} of{" "}
                          {selectedSizeVariant?.images?.length || 1}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        toggleZoomModal()
                        resetZoom()
                      }}
                      className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 active:scale-95"
                      aria-label="Close zoom view"
                    >
                      <X className="h-6 w-6 text-white" />
                    </button>
                  </div>

                  {/* Main Image Container with Pinch-to-Zoom */}
                  <div
                    ref={zoomContainerRef}
                    className="flex-1 relative overflow-hidden mt-16 mb-20"
                    style={{ touchAction: "none" }}
                  >
                    <div
                      className="w-full h-full flex items-center justify-center"
                      onTouchStart={handleTouchStartEnhanced}
                      onTouchMove={handleTouchMoveEnhanced}
                      onTouchEnd={handleTouchEndEnhanced}
                    >
                      <div
                        className="relative transition-transform duration-200 ease-out"
                        style={{
                          transform: `scale(${mobileZoomScale}) translate(${mobileZoomPosition.x}px, ${mobileZoomPosition.y}px)`,
                          transformOrigin: "center center",
                        }}
                      >
                        <Image
                          src={
                            getImageSrc(mainImage) ||
                            (selectedSizeVariant?.images && selectedSizeVariant.images.length > 0
                              ? getImageSrc(selectedSizeVariant.images[0])
                              : PLACEHOLDER_IMAGE)
                          }
                          alt={product.name || "Product Image"}
                          width={1200}
                          height={1200}
                          className="max-w-none object-contain w-auto h-auto"
                          style={{
                            maxWidth: "90vw",
                            maxHeight: "calc(100vh - 200px)",
                          }}
                          priority
                        />
                      </div>
                    </div>

                    {/* Navigation Arrows */}
                    {selectedSizeVariant?.images && selectedSizeVariant.images.length > 1 && (
                      <>
                        <button
                          onClick={() => navigateImage("prev")}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 active:scale-95"
                          aria-label="Previous image"
                        >
                          <ChevronRight className="h-6 w-6 text-white rotate-180" />
                        </button>
                        <button
                          onClick={() => navigateImage("next")}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 active:scale-95"
                          aria-label="Next image"
                        >
                          <ChevronRight className="h-6 w-6 text-white" />
                        </button>
                      </>
                    )}

                    {/* Zoom Level Indicator */}
                    {mobileZoomScale > 1 && (
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-white text-sm font-medium">{mobileZoomScale.toFixed(1)}x</span>
                      </div>
                    )}

                    {/* Image Navigation Dots */}
                    {selectedSizeVariant?.images && selectedSizeVariant.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="flex space-x-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-2">
                          {selectedSizeVariant.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setMainImage(image)
                                setCurrentImageIndex(index)
                                resetZoom()
                              }}
                              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                mainImage === image ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"
                              }`}
                              aria-label={`View image ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fixed Footer */}
                  <div className="fixed bottom-0 left-0 right-0 z-10 bg-black/90 backdrop-blur-sm p-4 space-y-3">
                    {/* Zoom Instructions */}
                    <div className="text-center">
                      <p className="text-white/70 text-xs">
                        {mobileZoomScale === 1
                          ? "Pinch to zoom • Double tap to zoom • Swipe for next image"
                          : "Drag to pan • Pinch to zoom out • Double tap to reset"}
                      </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => {
                          toggleZoomModal()
                          resetZoom()
                          handleAddToCart()
                        }}
                        className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 active:scale-95 disabled:opacity-50"
                        disabled={selectedSizeVariant.stock <= 0}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2 inline" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => {
                          toggleZoomModal()
                          resetZoom()
                          handleAddToWishlist()
                        }}
                        className="bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-lg transition-colors duration-200 active:scale-95"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Thumbnail Gallery */}
            {selectedSizeVariant?.images && selectedSizeVariant.images.length > 0 && (
              <motion.div
                className="grid grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {selectedSizeVariant.images.map((image, index) => (
                  <motion.div
                    key={index}
                    className={`aspect-square overflow-hidden rounded-lg cursor-pointer transition-all duration-300 ${
                      mainImage === image
                        ? "border-2 ring-2 ring-teal-500 ring-opacity-50 transform scale-105"
                        : "border border-gray-200 hover:border-teal-300 hover:shadow-md"
                    }`}
                    onClick={() => {
                      setMainImage(image)
                      setIsZoomed(false) // Reset zoom state when changing images
                    }}
                    whileHover={{ scale: mainImage === image ? 1.05 : 1.03 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={getImageSrc(image) || "/placeholder.svg"}
                      alt={`${product.name || "Product"} view ${index + 1}`}
                      width={150}
                      height={150}
                      className={`object-cover w-full h-full transition-opacity duration-300 ${mainImage === image ? "opacity-100" : "opacity-80"}`}
                      onError={() => handleImageError(image)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title and Badges */}
            <div>
              <motion.div
                className="flex flex-wrap gap-2 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {selectedSizeVariant.stock > 0 ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Sale {discountPercentage}% Off</Badge>
                )}
                {product.material && (
                  <Badge variant="outline" className="border-gray-300">
                    {product.material}
                  </Badge>
                )}
              </motion.div>
              <motion.h1
                className="text-3xl font-bold text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {product.name || "Product Name"}
              </motion.h1>
            </div>

            {/* Price Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`price-${selectedSizeVariant.id}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center space-x-4"
                >
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(selectedSizeVariant.price || 0)}
                  </span>
                  {selectedSizeVariant.originalPrice &&
                    selectedSizeVariant.originalPrice > selectedSizeVariant.price && (
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(selectedSizeVariant.originalPrice)}
                      </span>
                    )}
                  {discountPercentage > 0 && selectedSizeVariant.originalPrice && (
                    <span className="text-green-600 font-medium">
                      Save {formatPrice(selectedSizeVariant.originalPrice - (selectedSizeVariant.price || 0))}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Tax and shipping info */}
              <p className="text-sm text-gray-500 mt-2">Inclusive of all taxes</p>

              {/* Size Selection - Moved directly below price */}
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Select Size</h3>
                  <Link href="/guide" className="flex items-center text-sm text-teal-600 hover:text-teal-700">
                    <Ruler className="h-4 w-4 mr-1" />
                    Size Guide
                  </Link>
                </div>

                {sizeVariants.length > 0 && (
                  <div className="grid grid-cols-5 gap-2">
                    {sizeVariants.map((variant) => (
                      <motion.button
                        key={variant.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSizeSelect(variant)}
                        className={`relative p-2 border rounded-md text-center text-sm ${
                          selectedSizeVariant.id === variant.id
                            ? "border-teal-500 bg-teal-50 text-teal-700 font-medium"
                            : variant.stock > 0
                              ? "border-gray-300 hover:border-teal-300"
                              : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={variant.stock <= 0 || isUpdatingVariant}
                      >
                        {variant.size}
                        {variant.stock <= 0 && (
                          <span className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-md text-xs text-gray-500">
                            Out of stock
                          </span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Selector and CTA Buttons */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 border-r border-gray-300 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-1 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="px-3 py-1 border-l border-gray-300 hover:bg-gray-100"
                    disabled={selectedSizeVariant.stock !== undefined && quantity >= selectedSizeVariant.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {selectedSizeVariant.stock !== undefined && (
                  <span className="text-sm text-gray-500">
                    {selectedSizeVariant.stock > 0 ? `${selectedSizeVariant.stock} available` : "Out of stock"}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={handleAddToCart}
                  className={`py-6 text-base flex items-center justify-center transition-all duration-300 ${
                    addedToCart
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-teal-500 hover:bg-teal-600 text-white"
                  }`}
                  disabled={
                    (selectedSizeVariant.stock !== undefined && selectedSizeVariant.stock <= 0) ||
                    isAddingToCart ||
                    isUpdatingVariant
                  }
                >
                  {isAddingToCart ? (
                    <>
                      <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Adding...
                    </>
                  ) : addedToCart ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="bg-teal-500 hover:bg-teal-600 text-white py-6 text-base"
                  disabled={
                    (selectedSizeVariant.stock !== undefined && selectedSizeVariant.stock <= 0) ||
                    isAddingToCart ||
                    isUpdatingVariant
                  }
                >
                  Buy Now
                </Button>
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={handleAddToWishlist}
                  variant="ghost"
                  className={`text-gray-700 hover:bg-gray-100 ${isInWishlist ? "text-red-500" : ""}`}
                  disabled={isUpdatingVariant}
                >
                  {isInWishlist ? (
                    <HeartFilled className="w-5 h-5 mr-2 text-red-500 fill-red-500" />
                  ) : (
                    <Heart className="w-5 h-5 mr-2" />
                  )}
                  {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                </Button>
                <Button
                  onClick={handleShareProduct}
                  variant="ghost"
                  className="text-gray-700 hover:bg-gray-100"
                  disabled={isUpdatingVariant}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Delivery and Returns */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-teal-600 mr-2" />
                <div>
                  <p className="text-sm font-medium">Free Delivery</p>
                  <p className="text-xs text-gray-500">Delivery within 3-5 business days</p>
                </div>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-teal-600 mr-2" />
                <div>
                  <p className="text-sm font-medium">Secure Payments</p>
                  <p className="text-xs text-gray-500">100% secure payment</p>
                </div>
              </div>
              <div className="flex items-center">
                <RotateCcw className="h-5 w-5 text-teal-600 mr-2" />
                <div>
                  <p className="text-sm font-medium">Easy Replacement</p>
                  <p className="text-xs text-gray-500">
                    For wrong products and manufacturing defects. Learn more at Return & Exchange Policy
                  </p>
                </div>
              </div>
            </div>

            {/* Product Information Tabs */}
            <Tabs defaultValue="description" className="mt-8">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed">{formatDescription(product.description || "")}</div>
                </div>
              </TabsContent>
              <TabsContent value="specifications" className="p-4 bg-white rounded-lg border border-gray-200">
                <table className="w-full border-collapse">
                  <tbody>
                    {product.material && (
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 font-medium w-1/3">Material</td>
                        <td className="py-3 px-4">{product.material}</td>
                      </tr>
                    )}
                    {product.grade && (
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 font-medium">Grade</td>
                        <td className="py-3 px-4">{product.grade}</td>
                      </tr>
                    )}
                    {product.coating && (
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 font-medium">
                          {product.category === "Earrings" ? "Classification" : "Plating"}
                        </td>
                        <td className="py-3 px-4">{product.coating}</td>
                      </tr>
                    )}
                    {product.gem && (
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 font-medium">Adorned element</td>
                        <td className="py-3 px-4">{product.gem}</td>
                      </tr>
                    )}
                    {selectedSizeVariant.size && (
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 font-medium">Size</td>
                        <td className="py-3 px-4">{selectedSizeVariant.size}</td>
                      </tr>
                    )}
                    {product.category && (
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 font-medium">Category</td>
                        <td className="py-3 px-4">{product.category}</td>
                      </tr>
                    )}
                    {selectedSizeVariant.stock !== undefined && (
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 font-medium">Stock</td>
                        <td className="py-3 px-4">
                          {selectedSizeVariant.stock > 0 ? `${selectedSizeVariant.stock} available` : "Out of stock"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-16">
          <SimilarProducts currentProductId={selectedSizeVariant.id} category={product.category} />
        </div>
      </div>
    </div>
  )
}
