"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Package, ShoppingBag, Eye } from "lucide-react"
import { fetchUserOrders } from "@/lib/api"
import { useAuthStore } from "@/lib/auth"
import { formatPrice } from "@/lib/utils"
import { OrderDetailsModal } from "./order-details-modal"

// Define the new order type based on the API response
interface OrderItem {
  product: {
    _id: string
    name: string
    price: number
    description: string
    image: string
    category: string
    material: string
    grade: string
    gem?: string
    coating?: string
    size?: string
  }
  quantity: number
}

interface ShippingAddress {
  address: string
  state: string
  city: string
  pincode: number | string
}

interface OrderResponse {
  _id: string
  totalPrice: number
  shippingAddress: ShippingAddress
  status: string
  paymentStatus: string
  placedAt: string
  items: OrderItem[]
  orderSummary?: {
    totalItems: number
    subtotal: number
  }
}

export function OrderList() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
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

  const handleViewOrderDetails = (order: OrderResponse) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

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
    <>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence>
          {orders.map((order, index) => (
            <motion.div
              key={order._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order._id?.substring(0, 8) || "Unknown"}</h3>
                        <p className="text-sm text-gray-500">
                          Placed on {order.placedAt ? formatDate(order.placedAt) : "Unknown date"}
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0 flex flex-col md:flex-row gap-2">
                        <Badge className={getStatusColor(order.status || "pending")}>{order.status || "Pending"}</Badge>
                        <Badge className={getStatusColor(order.paymentStatus || "pending")} variant="outline">
                          Payment: {order.paymentStatus || "Pending"}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Order Items</h4>
                        <span className="text-sm text-gray-500">{order.items?.length || 0} item(s)</span>
                      </div>
                      {order.items && order.items.length > 0 ? (
                        <div className="space-y-2">
                          {order.items.slice(0, 2).map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                                {item.product?.image ? (
                                  <img
                                    src={item.product.image || "/placeholder.svg"}
                                    alt={item.product.name || "Product"}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-4 w-4 text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {item.product?.name || `Product ${itemIndex + 1}`}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Quantity: {item.quantity} • {formatPrice(item.product?.price || 0)}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-sm text-gray-500 text-center pt-2">
                              +{order.items.length - 2} more item(s)
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500">No items found in this order</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="font-medium text-lg">{formatPrice(order.totalPrice || 0)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Shipping Address</p>
                        {order.shippingAddress ? (
                          <p className="text-sm">
                            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                            - {order.shippingAddress.pincode}
                          </p>
                        ) : (
                          <p className="text-sm">Address not available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 dark:bg-gray-800 px-6 py-3">
                  <div className="flex justify-between items-center w-full">
                    <Button
                      variant="outline"
                      onClick={() => handleViewOrderDetails(order)}
                      className="flex items-center gap-2 text-teal-600 border-teal-200 hover:bg-teal-50"
                    >
                      <Eye className="h-4 w-4" />
                      View Order Details
                    </Button>
                    <Link href="/">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <span className="text-teal-500 hover:underline text-sm">Continue Shopping</span>
                      </motion.div>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Order Details Modal */}
      {selectedOrder && <OrderDetailsModal order={selectedOrder} isOpen={isModalOpen} onClose={handleCloseModal} />}
    </>
  )
}
