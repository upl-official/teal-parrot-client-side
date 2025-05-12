"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { removeFromWishlist, addToCart, fetchWishlistItems } from "@/lib/api"
import type { WishlistItem } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/lib/auth"

// Default placeholder image path
const PLACEHOLDER_IMAGE = "/images/tp-placeholder-img.jpg"

export function WishlistItems() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({})
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuthStore()
  const userId = user?._id || ""

  const fetchItems = async () => {
    if (!userId) {
      setItems([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const wishlistItems = await fetchWishlistItems(userId)
      setItems(wishlistItems)
    } catch (error) {
      console.error("Error fetching wishlist items:", error)
      toast({
        title: "Error",
        description: "Failed to load wishlist items. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [userId])

  const handleRemoveItem = async (productId: string) => {
    if (!userId) return

    try {
      setLoading((prev) => ({ ...prev, [productId]: true }))
      await removeFromWishlist(userId, productId)
      toast({
        title: "Item removed",
        description: "The item has been removed from your wishlist.",
      })
      fetchItems()
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const handleAddToCart = async (productId: string) => {
    if (!userId) return

    try {
      setAddingToCart((prev) => ({ ...prev, [productId]: true }))
      await addToCart(userId, productId, 1)
      toast({
        title: "Added to cart",
        description: "The item has been added to your cart.",
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }))
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-8">My Wishlist</h2>
        <div className="flex justify-center items-center py-12">
          <div className="h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3">Loading wishlist...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-8">My Wishlist</h2>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-medium mb-4">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items to your wishlist yet.</p>
          <Link href="/collection">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.product._id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="relative aspect-square">
                <Image
                  src={imageErrors[item.product._id] ? PLACEHOLDER_IMAGE : item.product.images[0] || PLACEHOLDER_IMAGE}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(item.product._id)}
                />
              </div>
              <div className="p-4">
                <Link href={`/product/${item.product._id}`} className="hover:text-teal-600">
                  <h3 className="font-medium text-lg">{item.product.name}</h3>
                </Link>
                {item.product.material && <p className="text-sm text-gray-500 mb-2">{item.product.material}</p>}
                <p className="font-bold text-lg mb-4">₹{item.product.price.toLocaleString("en-IN")}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(item.product._id)}
                    className="flex-1"
                    disabled={addingToCart[item.product._id]}
                  >
                    {addingToCart[item.product._id] ? (
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    ) : (
                      <ShoppingBag className="h-4 w-4 mr-2" />
                    )}
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => handleRemoveItem(item.product._id)}
                    variant="outline"
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    disabled={loading[item.product._id]}
                  >
                    {loading[item.product._id] ? (
                      <span className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
