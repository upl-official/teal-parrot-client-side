"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/utils"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const txnid = searchParams.get("txnid")
  const status = searchParams.get("status")
  const amount = searchParams.get("amount")

  useEffect(() => {
    if (status === "success" && txnid) {
      // Show success toast
      toast({
        title: "Payment Successful!",
        description: "Your order has been placed successfully.",
      })

      // Set mock order details (in real app, fetch from API using txnid)
      setOrderDetails({
        orderId: txnid,
        amount: amount,
        status: "confirmed",
        estimatedDelivery: "3-5 business days",
      })
    } else {
      // Redirect to failure page if status is not success
      router.push("/payment/failure")
    }
    setLoading(false)
  }, [status, txnid, amount, router, toast])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Payment Successful!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-8"
          >
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </motion.p>

          {/* Order Details Card */}
          {orderDetails && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
                    <Package className="w-5 h-5 text-teal-600" />
                  </div>

                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{orderDetails.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-medium text-green-600">{formatPrice(Number(orderDetails.amount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-green-600 capitalize">{orderDetails.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Delivery:</span>
                      <span className="font-medium">{orderDetails.estimatedDelivery}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button onClick={() => router.push("/account/orders")} className="bg-teal-500 hover:bg-teal-600 text-white">
              View Orders
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button onClick={() => router.push("/collection")} variant="outline">
              Continue Shopping
            </Button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 p-4 bg-blue-50 rounded-lg"
          >
            <p className="text-sm text-blue-800">
              <strong>What's next?</strong> You will receive an order confirmation email shortly. You can track your
              order status in the "My Orders" section of your account.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
