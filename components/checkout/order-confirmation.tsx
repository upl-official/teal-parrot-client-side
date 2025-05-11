"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Printer, ArrowRight, Package, Ruler } from "lucide-react"
import type { CartItem, Address } from "@/lib/types"
import { fetchProductById } from "@/lib/api"

// Add the import at the top
import { motion } from "framer-motion"

interface OrderConfirmationProps {
  orderDetails: any
  cartItems: CartItem[]
  selectedAddress: Address | undefined
  shippingMethod: string
  paymentMethod: string
}

export function OrderConfirmation({
  orderDetails,
  cartItems,
  selectedAddress,
  shippingMethod,
  paymentMethod,
}: OrderConfirmationProps) {
  const [isPrinting, setIsPrinting] = useState(false)
  const [enhancedItems, setEnhancedItems] = useState<CartItem[]>(cartItems)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch complete product details for each item
  useEffect(() => {
    const fetchCompleteDetails = async () => {
      if (!cartItems.length) return

      setIsLoading(true)
      try {
        const enhancedItemsPromises = cartItems.map(async (item) => {
          // Skip if we already have complete product details
          if (
            item.product.images &&
            item.product.images.length > 0 &&
            item.product.images[0] !== "/images/tp-placeholder-img.jpg"
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
        setEnhancedItems(updatedItems)
      } catch (error) {
        console.error("Error fetching product details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompleteDetails()
  }, [cartItems])

  const handlePrint = () => {
    setIsPrinting(true)
    window.print()
    setTimeout(() => setIsPrinting(false), 500)
  }

  // Format shipping method for display
  const formatShippingMethod = (method: string) => {
    switch (method) {
      case "express":
        return "Express Shipping (1-2 business days)"
      case "standard":
        return "Standard Shipping (3-5 business days)"
      case "free":
        return "Free Shipping (7-10 business days)"
      default:
        return "Standard Shipping"
    }
  }

  // Format payment method for display
  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case "card":
        return "Credit/Debit Card"
      case "upi":
        return "UPI"
      case "wallet":
        return "Mobile Wallet"
      case "cod":
        return "Cash on Delivery"
      default:
        return "Online Payment"
    }
  }

  // Calculate subtotal
  const subtotal = enhancedItems.reduce((total, item) => total + item.product.price * item.quantity, 0)

  // Calculate shipping cost based on selected method
  const shippingCost = shippingMethod === "express" ? 150 : shippingMethod === "standard" ? 50 : 0

  // Calculate tax (5% of subtotal)
  const tax = Math.round(subtotal * 0.05)

  // Calculate total
  const total = subtotal + tax + shippingCost

  // Get order ID from the API response
  const orderId = orderDetails?.orderId || "pending"

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Replace the success icon section with an animated version */}
      <motion.div
        className="p-6 border-b border-gray-200 bg-green-50 flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-green-100 p-3 rounded-full mr-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.3,
          }}
        >
          <CheckCircle className="h-8 w-8 text-green-600" />
        </motion.div>
        <div>
          <motion.h2
            className="text-xl font-semibold text-green-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Order Placed Successfully!
          </motion.h2>
          <motion.p
            className="text-green-700 mt-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Thank you for your purchase. Your order has been confirmed.
          </motion.p>
        </div>
      </motion.div>

      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium">Order Details</h3>
            <p className="text-gray-500 mt-1">Order #{orderId}</p>
            <p className="text-gray-500">
              {new Date().toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center" onClick={handlePrint} disabled={isPrinting}>
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Items Ordered</h4>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="h-6 w-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-gray-500">Loading item details...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {enhancedItems.map((item) => (
                  <div key={item.product._id} className="flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                      {item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-4 flex-grow">
                      <p className="font-medium">{item.product.name}</p>
                      <div className="flex flex-wrap gap-x-3 mt-1">
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>

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
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{item.product.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Shipping Address</h4>
              {selectedAddress ? (
                <div className="p-4 bg-gray-50 rounded-md">
                  <p>{selectedAddress.address}</p>
                  <p>
                    {selectedAddress.city}, {selectedAddress.state}
                  </p>
                  <p>PIN: {selectedAddress.pincode}</p>
                </div>
              ) : (
                <p className="text-gray-500">Address information not available</p>
              )}
            </div>

            <div>
              <h4 className="font-medium mb-2">Payment Information</h4>
              <div className="p-4 bg-gray-50 rounded-md">
                <p>
                  <span className="text-gray-600">Payment Method:</span> {formatPaymentMethod(paymentMethod)}
                </p>
                <p>
                  <span className="text-gray-600">Shipping Method:</span> {formatShippingMethod(shippingMethod)}
                </p>
                <p className="mt-2">
                  <span className="text-gray-600">Order Status:</span>{" "}
                  <span className="text-green-600 font-medium">Confirmed</span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Order Summary</h4>
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>₹{shippingCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-teal-600">₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50">
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            We've sent a confirmation email with your order details and tracking information.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/account/orders">
              <Button variant="outline" className="w-full sm:w-auto">
                View Order History
              </Button>
            </Link>

            <Link href="/collection">
              <Button className="bg-teal-500 hover:bg-teal-600 w-full sm:w-auto">
                Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
