"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export default function PaymentFailurePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const txnid = searchParams.get("txnid")
  const status = searchParams.get("status")
  const error = searchParams.get("error")

  useEffect(() => {
    // Show failure toast
    toast({
      title: "Payment Failed",
      description: error || "Your payment could not be processed. Please try again.",
      variant: "destructive",
    })

    // Clear test data if it exists
    const isFromTestPage = sessionStorage.getItem("testOrderData")
    if (isFromTestPage) {
      sessionStorage.removeItem("testOrderData")
    }
  }, [toast, error])

  const handleRetryPayment = () => {
    // Redirect back to checkout or cart
    router.push("/checkout")
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
          {/* Failure Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <XCircle className="w-12 h-12 text-red-600" />
          </motion.div>

          {/* Failure Message */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Payment Failed
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-8"
          >
            We couldn't process your payment. Don't worry, no charges have been made to your account.
          </motion.p>

          {/* Error Details Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="space-y-3 text-left">
                  {txnid && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-medium">{txnid}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-red-600 capitalize">{status || "Failed"}</span>
                  </div>
                  {error && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Error:</span>
                      <span className="font-medium text-red-600">{error}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button onClick={handleRetryPayment} className="bg-teal-500 hover:bg-teal-600 text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Payment
            </Button>
            <Button onClick={() => router.push("/collection")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 p-4 bg-yellow-50 rounded-lg"
          >
            <h3 className="font-medium text-yellow-800 mb-2">Need Help?</h3>
            <p className="text-sm text-yellow-700">
              If you continue to experience issues with payment, please contact our support team. Common issues include
              insufficient funds, expired cards, or network connectivity problems.
            </p>
            <Button
              onClick={() => router.push("/contact")}
              variant="link"
              className="text-yellow-800 hover:text-yellow-900 p-0 mt-2"
            >
              Contact Support
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
