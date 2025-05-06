"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Package, ShoppingBag } from "lucide-react"
import { fetchUserOrders } from "@/lib/api"
import { useAuthStore } from "@/lib/auth"

// Define the new order type based on the API response
interface OrderItem {
  product: any
  quantity: number
}

interface ShippingAddress {
  address: string
  state: string
  city: string
  pincode: number | string
}

interface OrderResponse {
  orderId: string
  totalPrice: number
  shippingAddress: ShippingAddress
  status: string
  placedAt: string
  items: OrderItem[]
}

export function OrderList() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuthStore()

  useEffect(() => {
    if (!user) return

    const getOrders = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchUserOrders(user._id)
        setOrders(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders")
      } finally {
        setLoading(false)
      }
    }

    getOrders()
  }, [user])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <motion.div className="text-center py-12 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex flex-col items-center gap-4">
          <ShoppingBag className="h-16 w-16 text-gray-300" />
          <h3 className="text-xl font-medium text-gray-700">No orders found</h3>
          <p className="text-gray-500 max-w-md">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link href="/" className="mt-4">
            <motion.div
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Products
            </motion.div>
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <AnimatePresence>
        {orders.map((order, index) => (
          <motion.div
            key={order.orderId || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <h3 className="font-semibold text-lg">Order #{order.orderId?.substring(0, 8) || "Unknown"}</h3>
                      <p className="text-sm text-gray-500">
                        Placed on {order.placedAt ? formatDate(order.placedAt) : "Unknown date"}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <Badge className={getStatusColor(order.status || "pending")}>{order.status || "Pending"}</Badge>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Order Items</h4>
                    {order.items && order.items.length > 0 ? (
                      <div className="space-y-3">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-3">
                            <div className="bg-gray-200 rounded-md p-2">
                              <Package className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium">Product {itemIndex + 1}</p>
                              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No items found in this order</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-medium">₹{order.totalPrice?.toFixed(2) || "0.00"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Shipping Address</p>
                      {order.shippingAddress ? (
                        <p className="text-sm">
                          {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                          {order.shippingAddress.pincode}
                        </p>
                      ) : (
                        <p className="text-sm">Address not available</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-800 px-6 py-3">
                <div className="flex justify-end w-full">
                  <Link href="/">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <span className="text-teal-500 hover:underline">Continue Shopping</span>
                    </motion.div>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
