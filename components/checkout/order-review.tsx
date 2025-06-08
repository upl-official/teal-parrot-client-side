"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateCartItem, removeFromCart, getCurrentUserId, fetchProductById } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { CartItem } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

interface OrderReviewProps {
  cartItems: CartItem[]
  onNext: () => void
}

export function OrderReview({ cartItems, onNext }: OrderReviewProps) {
  const [items, setItems] = useState<CartItem[]>(cartItems)
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [isEnhancing, setIsEnhancing] = useState(false)
  const { toast } = useToast()

  // Fetch complete product details for each item
  useEffect(() => {
    const fetchCompleteDetails = async () => {
      if (!cartItems.length) return

      setIsEnhancing(true)
      try {
        const enhancedItemsPromises = cartItems.map(async (item) => {
          // Skip if we already have complete product details
          if (
            item.product.images &&
            item.product.images.length > 0 &&
            item.product.images[0] !== "/placeholder.svg?key=pl95d"
          ) {
            return item
          }

          try {
            const productDetails = await fetchProductById(item.product._id)
            return {
              ...item,
              product: {
                ...item.product,
                ...productDetails,
              },
            }
          } catch (error) {
            console.error(`Error fetching details for product ${item.product._id}:`, error)
            return item
          }
        })

        const updatedItems = await Promise.all(enhancedItemsPromises)
        setItems(updatedItems)
      } catch (error) {
        console.error("Error fetching product details:", error)
      } finally {
        setIsEnhancing(false)
      }
    }

    fetchCompleteDetails()
  }, [cartItems])

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      setLoading((prev) => ({ ...prev, [productId]: true }))

      const userId = getCurrentUserId()
      if (!userId) {
        toast({
          title: "Error",
          description: "Please log in to update your cart",
          variant: "destructive",
        })
        return
      }

      await updateCartItem(userId, productId, newQuantity)

      setItems((prev) =>
        prev.map((item) => (item.product._id === productId ? { ...item, quantity: newQuantity } : item)),
      )

      toast({
        title: "Cart updated",
        description: "Item quantity has been updated",
      })
    } catch (error) {
      console.error("Error updating cart item:", error)
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      setLoading((prev) => ({ ...prev, [productId]: true }))

      const userId = getCurrentUserId()
      if (!userId) {
        toast({
          title: "Error",
          description: "Please log in to update your cart",
          variant: "destructive",
        })
        return
      }

      await removeFromCart(userId, productId)

      setItems((prev) => prev.filter((item) => item.product._id !== productId))

      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      })
    } catch (error) {
      console.error("Error removing cart item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, [productId]: false }))
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Review Your Order</h2>
        <p className="text-gray-500 mt-1">Please review your items before proceeding</p>
      </div>

      {isEnhancing ? (
        <div className="p-6 flex justify-center">
          <div className="flex items-center">
            <div className="h-6 w-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mr-3"></div>
            <span>Loading product details...</span>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.product._id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center">
              <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                <Image
                  src={item.product.images?.[0] || "/placeholder.svg?height=100&width=100&query=silver jewelry"}
                  alt={item.product.name}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4 sm:mt-0 sm:ml-6 flex-grow">
                <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>

                <div className="flex flex-wrap gap-x-4 mt-1">
                  {item.product.material && <p className="text-sm text-gray-500">{item.product.material}</p>}

                  {/* Display size information with icon */}
                  {item.product.size && (
                    <div className="flex items-center">
                      <Ruler className="h-3.5 w-3.5 text-gray-500 mr-1" />
                      <p className="text-sm text-gray-500">
                        Size: <span className="font-medium">{item.product.size}</span>
                      </p>
                    </div>
                  )}
                </div>

                {item.product.grade && <p className="text-sm text-gray-500 mt-1">Grade: {item.product.grade}</p>}
              </div>

              <div className="mt-4 sm:mt-0 flex flex-col items-end">
                <span className="text-lg font-semibold text-gray-900">{formatPrice(item.product.price)}</span>

                <div className="flex items-center mt-2 border border-gray-300 rounded">
                  <button
                    onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    disabled={item.quantity <= 1 || loading[item.product._id]}
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="px-4 py-1 border-x border-gray-300">{item.quantity}</span>

                  <button
                    onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    disabled={loading[item.product._id]}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.product._id)}
                  className="text-sm text-red-500 hover:text-red-700 mt-2 disabled:opacity-50"
                  disabled={loading[item.product._id]}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-6 bg-gray-50 flex flex-col sm:flex-row justify-between items-center">
        <Link href="/cart" className="text-teal-500 hover:text-teal-600 mb-4 sm:mb-0">
          Return to Cart
        </Link>

        <Button
          onClick={onNext}
          className="bg-teal-500 hover:bg-teal-600 text-white px-8"
          disabled={items.length === 0 || isEnhancing}
        >
          Continue to Shipping
        </Button>
      </div>
    </div>
  )
}
