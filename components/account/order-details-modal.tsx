"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { ProductImage } from "@/components/ui/product-image"
import { formatPrice } from "@/lib/utils"
import { Package, MapPin, Calendar, CreditCard, Truck, Eye } from "lucide-react"

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

interface OrderDetailsProps {
  order: {
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
  isOpen: boolean
  onClose: () => void
}

export function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsProps) {
  const router = useRouter()
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({})

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`)
    onClose()
  }

  const handleImageLoad = (productId: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [productId]: false }))
  }

  const handleImageLoadStart = (productId: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [productId]: true }))
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "processing":
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="h-5 w-5 text-teal-500" />
            Order Details
          </DialogTitle>
          <DialogDescription>
            Order #{order._id.substring(0, 8)} • Placed on {formatDate(order.placedAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status and Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Order Status</span>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Payment Status</span>
                </div>
                <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Order Total</span>
                </div>
                <span className="text-lg font-semibold text-teal-600">{formatPrice(order.totalPrice)}</span>
              </CardContent>
            </Card>
          </div>

          {/* Shipping Address */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-700">Shipping Address</span>
              </div>
              <p className="text-gray-600">
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-teal-500" />
              Order Items ({order.items.length})
            </h3>

            <div className="space-y-4">
              <AnimatePresence>
                {order.items.map((item, index) => (
                  <motion.div
                    key={`${item.product._id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="relative flex-shrink-0">
                            <motion.div
                              className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden cursor-pointer group"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleProductClick(item.product._id)}
                            >
                              <ProductImage
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                onLoadStart={() => handleImageLoadStart(item.product._id)}
                                onLoad={() => handleImageLoad(item.product._id)}
                              />

                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                                <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>

                              {/* Loading indicator */}
                              {imageLoadingStates[item.product._id] && (
                                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                              )}
                            </motion.div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                              <div className="flex-1">
                                <h4
                                  className="font-semibold text-gray-900 cursor-pointer hover:text-teal-600 transition-colors line-clamp-2"
                                  onClick={() => handleProductClick(item.product._id)}
                                >
                                  {item.product.name}
                                </h4>

                                <div className="mt-2 space-y-1">
                                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                                    <span className="bg-gray-100 px-2 py-1 rounded">{item.product.category}</span>
                                    {item.product.material && (
                                      <span className="bg-gray-100 px-2 py-1 rounded">{item.product.material}</span>
                                    )}
                                    {item.product.size && (
                                      <span className="bg-gray-100 px-2 py-1 rounded">Size: {item.product.size}</span>
                                    )}
                                  </div>

                                  {item.product.description && (
                                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                      {item.product.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-2">
                                <div className="text-right">
                                  <p className="text-lg font-semibold text-gray-900">
                                    {formatPrice(item.product.price)}
                                  </p>
                                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleProductClick(item.product._id)}
                                  className="text-teal-600 border-teal-200 hover:bg-teal-50"
                                >
                                  View Product
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary */}
          {order.orderSummary && (
            <>
              <Separator />
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Items:</span>
                    <span>{order.orderSummary.totalItems}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatPrice(order.orderSummary.subtotal)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-teal-600">{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
