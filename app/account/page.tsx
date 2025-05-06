"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimatedCard } from "@/components/animated/animated-card"
import { AnimatedContainer } from "@/components/animated/animated-container"
import { useAuthStore } from "@/lib/auth"
import { fetchCartItems, fetchWishlistItems, fetchUserAddresses, fetchUserOrders } from "@/lib/api"
import {
  User,
  ShoppingBag,
  MapPin,
  ClipboardList,
  Heart,
  Package,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react"
import type { Address, CartItem, WishlistItem, Order } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AccountPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?._id) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Fetch each data type separately to handle individual failures
        try {
          const addressesData = await fetchUserAddresses(user._id)
          setAddresses(addressesData)
        } catch (err) {
          console.error("Error fetching addresses:", err)
          // Don't set global error, just log it
        }

        try {
          const cartData = await fetchCartItems(user._id)
          setCartItems(cartData)
        } catch (err) {
          console.error("Error fetching cart items:", err)
        }

        try {
          // Add a retry mechanism for wishlist
          let retries = 2
          let wishlistData: WishlistItem[] = []

          while (retries > 0) {
            try {
              wishlistData = await fetchWishlistItems(user._id)
              break // If successful, exit the retry loop
            } catch (err) {
              console.error(`Error fetching wishlist (retry ${3 - retries}/2):`, err)
              retries--
              if (retries === 0) {
                console.warn("All wishlist fetch retries failed")
              } else {
                // Wait before retrying
                await new Promise((resolve) => setTimeout(resolve, 1000))
              }
            }
          }

          setWishlistItems(wishlistData)
        } catch (err) {
          console.error("Error in wishlist fetch process:", err)
          // Set wishlist to empty array to prevent UI issues
          setWishlistItems([])
        }

        try {
          const ordersData = await fetchUserOrders(user._id)
          setOrders(ordersData)
        } catch (err) {
          console.error("Error fetching orders:", err)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("There was a problem loading your account data. Some information may be incomplete.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (e) {
      return "N/A"
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-teal-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <AnimatedContainer animation="fade" animationKey="dashboard-page">
      {" "}
      {/* Changed from 'key' to 'animationKey' */}
      {error && (
        <Alert variant="warning" className="mb-6 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-700">{error}</AlertDescription>
        </Alert>
      )}
      <h1 className="text-2xl font-bold mb-6">Account Dashboard</h1>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Personal Information Card */}
        <AnimatedCard delay={0.1}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-teal-500" />
                Personal Information
              </CardTitle>
              <Link href="/account/profile">
                <Button variant="ghost" size="sm" className="text-teal-500 hover:text-teal-600">
                  Edit
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{user?.name || "Not available"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user?.email || "Not available"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{user?.phone || "Not available"}</p>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>

        {/* Addresses Card */}
        <AnimatedCard delay={0.2}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-teal-500" />
                Addresses
              </CardTitle>
              <Link href="/account/addresses">
                <Button variant="ghost" size="sm" className="text-teal-500 hover:text-teal-600">
                  Manage
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.slice(0, 2).map((address) => (
                  <div key={address._id} className="border-b pb-2 last:border-0 last:pb-0">
                    <p className="font-medium">{address.address}</p>
                    <p className="text-sm text-gray-500">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>
                ))}
                {addresses.length > 2 && (
                  <p className="text-sm text-teal-500">+{addresses.length - 2} more addresses</p>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No addresses found</p>
                <Link href="/account/addresses">
                  <Button variant="link" className="text-teal-500 p-0 h-auto mt-1">
                    Add an address
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </AnimatedCard>

        {/* Recent Orders Card */}
        <AnimatedCard delay={0.3}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-teal-500" />
                Recent Orders
              </CardTitle>
              <Link href="/account/orders">
                <Button variant="ghost" size="sm" className="text-teal-500 hover:text-teal-600">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.slice(0, 3).map((order, idx) => (
                  <div
                    key={order.orderId || idx}
                    className="flex items-center gap-3 border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-sm truncate">
                        Order #{order.orderId?.substring(0, 8) || "Unknown"}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">{order.placedAt ? formatDate(order.placedAt) : "N/A"}</p>
                        <Badge
                          className={
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "processing" || order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                          }
                        >
                          {order.status || "Pending"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No orders found</p>
                <Link href="/collection">
                  <Button variant="link" className="text-teal-500 p-0 h-auto mt-1">
                    Browse products
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </AnimatedCard>

        {/* Cart Summary Card */}
        <AnimatedCard delay={0.4}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-teal-500" />
                Shopping Cart
              </CardTitle>
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="text-teal-500 hover:text-teal-600">
                  View Cart
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {cartItems.length > 0 ? (
              <div className="space-y-3">
                {cartItems.slice(0, 3).map((item) => (
                  <div key={item.product._id} className="flex items-center gap-3 border-b pb-2 last:border-0 last:pb-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product?.images?.[0] || "/intricate-silver-collection.png"}
                        alt={item.product?.name || "Product"}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-sm truncate">{item.product?.name || "Product"}</p>
                      <div className="flex justify-between">
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium">₹{item.product?.price || 0}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {cartItems.length > 3 && <p className="text-sm text-teal-500">+{cartItems.length - 3} more items</p>}
                <div className="pt-2 flex justify-between border-t">
                  <p className="font-medium">Total:</p>
                  <p className="font-bold">
                    ₹
                    {cartItems
                      .reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0)
                      .toFixed(2)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>Your cart is empty</p>
                <Link href="/collection">
                  <Button variant="link" className="text-teal-500 p-0 h-auto mt-1">
                    Start shopping
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </AnimatedCard>

        {/* Wishlist Card */}
        <AnimatedCard delay={0.5}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-teal-500" />
                Wishlist
              </CardTitle>
              <Link href="/wishlist">
                <Button variant="ghost" size="sm" className="text-teal-500 hover:text-teal-600">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {wishlistItems.length > 0 ? (
              <div className="space-y-3">
                {wishlistItems.slice(0, 3).map((item) => (
                  <div key={item.product._id} className="flex items-center gap-3 border-b pb-2 last:border-0 last:pb-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product?.images?.[0] || "/intricate-silver-collection.png"}
                        alt={item.product?.name || "Product"}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-sm truncate">{item.product?.name || "Product"}</p>
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">₹{item.product?.price || 0}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {wishlistItems.length > 3 && (
                  <p className="text-sm text-teal-500">+{wishlistItems.length - 3} more items</p>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>Your wishlist is empty</p>
                <Link href="/collection">
                  <Button variant="link" className="text-teal-500 p-0 h-auto mt-1">
                    Discover products
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </AnimatedCard>

        {/* Quick Links Card */}
        <AnimatedCard delay={0.6}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-teal-500" />
              Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="flex flex-col">
              <Link
                href="/collection"
                className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span>Browse Collection</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/cart"
                className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span>View Cart</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span>View Wishlist</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span>Contact Support</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </nav>
          </CardContent>
        </AnimatedCard>
      </motion.div>
    </AnimatedContainer>
  )
}
