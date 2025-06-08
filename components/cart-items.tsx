"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchCartItems, removeFromCart, updateCartItem } from "@/lib/api"
import type { CartItem as CartItemType } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/lib/auth"
import { formatPrice } from "@/lib/utils"

// Default placeholder image path
const PLACEHOLDER_IMAGE = "/images/tp-placeholder-img.jpg"

export function CartItems() {
  const [items, setItems] = useState<CartItemType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const { toast } = useToast()
  const { user } = useAuthStore()
  const userId = user?._id || ""

  const fetchCart = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const cartItems = await fetchCartItems(userId)
      setItems(cartItems)

      // Calculate total price
      const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      setTotalPrice(total)
    } catch (error) {
      console.error("Error fetching cart:", error)
      toast({
        title: "Error",
        description: "Failed to load your cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [userId])

  const handleRemoveItem = async (productId: string) => {
    if (!userId) return

    try {
      setActionLoading((prev) => ({ ...prev, [productId]: true }))
      await removeFromCart(userId, productId)
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      })
      fetchCart()
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1 || !userId) return

    try {
      setActionLoading((prev) => ({ ...prev, [productId]: true }))
      await updateCartItem(userId, productId, quantity)
      fetchCart()
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Please Log In</h2>
          <p className="text-gray-500 mb-6">You need to be logged in to view your cart</p>
          <Link href="/login?redirect=/cart">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Cart</h1>
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-4">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link href="/collection">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product._id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-white shadow-sm"
            >
              <div className="relative w-full sm:w-24 h-24 overflow-hidden rounded-md">
                <Image
                  src={imageErrors[item.product._id] ? PLACEHOLDER_IMAGE : item.product.images[0] || PLACEHOLDER_IMAGE}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(item.product._id)}
                />
              </div>
              <div className="flex-1">
                <Link href={`/product/${item.product._id}`} className="hover:text-teal-600">
                  <h3 className="font-medium">{item.product.name}</h3>
                </Link>

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

                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                      className="px-2 py-1 border-r border-gray-300 hover:bg-gray-100"
                      disabled={actionLoading[item.product._id] || item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 py-1 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                      className="px-2 py-1 border-l border-gray-300 hover:bg-gray-100"
                      disabled={actionLoading[item.product._id]}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.product._id)}
                    className="text-red-500 hover:text-red-700 flex items-center"
                    disabled={actionLoading[item.product._id]}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
              <div className="font-bold text-lg sm:text-right w-full sm:w-auto">
                {formatPrice(item.product.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
          <Link href="/checkout">
            <Button className="w-full">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
