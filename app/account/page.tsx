"use client"

import { useState, useEffect, useCallback } from "react"
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
  Calendar,
  CreditCard,
  Eye,
} from "lucide-react"
import type { Address, CartItem, WishlistItem, Order } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAccountNavigation } from "@/lib/account-navigation-context"
import { formatPrice } from "@/lib/utils"
import { OrderDetailsModal } from "@/components/account/order-details-modal"

export default function AccountPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const { user } = useAuthStore()
  const { navigateTo } = useAccountNavigation()

  // Memoize the fetchUserData function to prevent unnecessary recreations
  const fetchUserData = useCallback(async () => {
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
        // Sort orders by placedAt date (newest first)
        const sortedOrders = ordersData.sort((a, b) => {
          const dateA = new Date(a.placedAt).getTime()
          const dateB = new Date(b.placedAt).getTime()
          return dateB - dateA
        })
        setOrders(sortedOrders)
      } catch (err) {
        console.error("Error fetching orders:", err)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      setError("There was a problem loading your account data. Some information may be incomplete.")
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  // Format date for display - memoize this function if used frequently
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

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (e) {
      return "N/A"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsOrderModalOpen(true)
  }

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false)
    setSelectedOrder(null)
  }

  // Get the most recent order for detailed display
  const mostRecentOrder = orders.length > 0 ? orders[0] : null

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
        layout
      >
        {/* Personal Information Card */}
        <AnimatedCard delay={0.1}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-teal-500" />
                Personal Information
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-teal-500 hover:text-teal-600"
                onClick={() => navigateTo("/account/profile")}
              >
                Edit
              </Button>
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
              <Button
                variant="ghost"
                size="sm"
                className="text-teal-500 hover:text-teal-600"
                onClick={() => navigateTo("/account/addresses")}
              >
                Manage
              </Button>
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
                <Button
                  variant="link"
                  className="text-teal-500 p-0 h-auto mt-1"
                  onClick={() => navigateTo("/account/addresses")}
                >
                  Add an address
                </Button>
              </div>
            )}
          </CardContent>
        </AnimatedCard>

        {/* Most Recent Order Card - Enhanced */}
        <AnimatedCard delay={0.3} className="md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-teal-500" />
                Most Recent Order
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-teal-500 hover:text-teal-600"
                onClick={() => navigateTo("/account/orders")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {mostRecentOrder ? (
              <div className="space-y-4">
                {/* Order Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">
                      Order #
                      {mostRecentOrder.orderId?.substring(0, 8) || mostRecentOrder._id?.substring(0, 8) || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {mostRecentOrder.placedAt ? formatDateTime(mostRecentOrder.placedAt) : "N/A"}
                    </p>
                  </div>
                  <Badge className={getStatusColor(mostRecentOrder.status || "pending")}>
                    {mostRecentOrder.status || "Pending"}
                  </Badge>
                </div>

                {/* Order Details */}
                <div className="bg-gray-50 p-3 rounded-md space-y-3">
                  {/* Items Preview */}
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      Items ({mostRecentOrder.items?.length || 0})
                    </p>
                    {mostRecentOrder.items && mostRecentOrder.items.length > 0 ? (
                      <div className="space-y-2">
                        {mostRecentOrder.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                              {item.product?.image ? (
                                <Image
                                  src={item.product.image || "/placeholder.svg"}
                                  alt={item.product.name || "Product"}
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-3 w-3 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">
                                {item.product?.name || `Product ${idx + 1}`}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity} • {formatPrice(item.product?.price || 0)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {mostRecentOrder.items.length > 2 && (
                          <p className="text-xs text-gray-500 text-center">
                            +{mostRecentOrder.items.length - 2} more item(s)
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">No items found</p>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-2 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        Total Amount
                      </span>
                      <span className="text-sm font-semibold text-teal-600">
                        {formatPrice(mostRecentOrder.totalPrice || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Payment Status</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          mostRecentOrder.paymentStatus === "paid"
                            ? "border-green-200 text-green-700"
                            : "border-yellow-200 text-yellow-700"
                        }`}
                      >
                        {mostRecentOrder.paymentStatus || "Pending"}
                      </Badge>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {mostRecentOrder.shippingAddress && (
                    <div className="border-t pt-2">
                      <p className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Shipping Address
                      </p>
                      <p className="text-xs text-gray-600">
                        {mostRecentOrder.shippingAddress.address}, {mostRecentOrder.shippingAddress.city},{" "}
                        {mostRecentOrder.shippingAddress.state} - {mostRecentOrder.shippingAddress.pincode}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewOrderDetails(mostRecentOrder)}
                  className="w-full text-teal-600 border-teal-200 hover:bg-teal-50 flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Full Details
                </Button>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm">No orders found</p>
                <Button
                  variant="link"
                  className="text-teal-500 p-0 h-auto mt-1"
                  onClick={() => navigateTo("/collection")}
                >
                  Browse products
                </Button>
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
              <Button
                variant="ghost"
                size="sm"
                className="text-teal-500 hover:text-teal-600"
                onClick={() => navigateTo("/cart")}
              >
                View Cart
              </Button>
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
                        <p className="text-sm font-medium">{formatPrice(item.product?.price || 0)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {cartItems.length > 3 && <p className="text-sm text-teal-500">+{cartItems.length - 3} more items</p>}
                <div className="pt-2 flex justify-between border-t">
                  <p className="font-medium">Total:</p>
                  <p className="font-bold">
                    {formatPrice(
                      cartItems.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0),
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>Your cart is empty</p>
                <Button
                  variant="link"
                  className="text-teal-500 p-0 h-auto mt-1"
                  onClick={() => navigateTo("/collection")}
                >
                  Start shopping
                </Button>
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
              <Button
                variant="ghost"
                size="sm"
                className="text-teal-500 hover:text-teal-600"
                onClick={() => navigateTo("/wishlist")}
              >
                View All
              </Button>
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
                        <p className="text-sm font-medium">{formatPrice(item.product?.price || 0)}</p>
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
                <Button
                  variant="link"
                  className="text-teal-500 p-0 h-auto mt-1"
                  onClick={() => navigateTo("/collection")}
                >
                  Discover products
                </Button>
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
              <button
                onClick={() => navigateTo("/collection")}
                className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left w-full"
              >
                <span>Browse Collection</span>
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigateTo("/cart")}
                className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left w-full"
              >
                <span>View Cart</span>
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigateTo("/wishlist")}
                className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left w-full"
              >
                <span>View Wishlist</span>
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigateTo("/contact")}
                className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left w-full"
              >
                <span>Contact Support</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </CardContent>
        </AnimatedCard>
      </motion.div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} isOpen={isOrderModalOpen} onClose={handleCloseOrderModal} />
      )}
    </AnimatedContainer>
  )
}
