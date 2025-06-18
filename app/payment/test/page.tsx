"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Package, CreditCard, MapPin, Tag, Calendar, User, Mail, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/lib/auth"

interface OrderData {
  orderId: string
  orderData: any
  paymentRequest: any
  orderDetails: {
    shippingAddress: any
    paymentDetails: any
    items: any[]
    totalPrice: number
    status: string
    paymentStatus: string
    couponApplied: any
    shippingCost: number
    placedAt: string
    createdAt: string
    updatedAt: string
  }
}

export default function PaymentTestPage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(false)
  const [actionType, setActionType] = useState<"success" | "failure" | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { token } = useAuthStore()

  useEffect(() => {
    // Get order data from sessionStorage
    const storedData = sessionStorage.getItem("testOrderData")
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setOrderData(parsedData)
        console.log("Test page loaded with order data:", parsedData)
      } catch (error) {
        console.error("Error parsing order data:", error)
        toast({
          title: "Error",
          description: "Invalid order data. Redirecting to checkout...",
          variant: "destructive",
        })
        router.push("/checkout")
      }
    } else {
      // No order data found, redirect back to checkout
      toast({
        title: "No Order Data",
        description: "No order data found. Please complete checkout first.",
        variant: "destructive",
      })
      router.push("/checkout")
    }
  }, [router, toast])

  const handleSuccess = async () => {
    setLoading(true)
    setActionType("success")
    try {
      // Check if user is authenticated
      if (!token) {
        throw new Error("Authentication required. Please log in first.")
      }

      // Use the exact payload format specified
      const payloadData = {
        txnid: orderData?.orderDetails?.paymentDetails?.transactionId || "68513e15b25c02d075ca75b6",
        amount: orderData?.orderDetails?.totalPrice?.toString() || "1769.1",
        productinfo: orderData?.orderDetails?.items?.[0]?.product?.name || "MIRA",
        firstname: "Sandeep",
        email: "sandeep@gmail.com",
        status: "pending",
        hash: "a5920c86d8328ed90affccb93b7bc52eeb3ef0a00d1b64e13ab5347ec3c7a6ce0fd3901753e2c79aa9533f824eee00e089614bace586e29dd8218b60b6fd3ef",
      }

      console.log("Sending success payload to backend:", payloadData)
      console.log("Using auth token:", token ? "present" : "missing")

      // Call the actual backend API with authorization header
      const response = await fetch("https://backend-project-r734.onrender.com/api/v1/users/payment/success", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payloadData),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("Success response from backend:", result)

      // Check if the response indicates success
      if (result.success && result.data?.success) {
        // Clear test data
        sessionStorage.removeItem("testOrderData")

        toast({
          title: "Payment Successful!",
          description: result.data.message || "Your order has been confirmed and payment processed successfully.",
        })

        // Show success feedback before redirect
        setTimeout(() => {
          router.push("/payment/success")
        }, 2000)
      } else {
        throw new Error(result.data?.message || result.message || "Payment processing failed")
      }
    } catch (error) {
      console.error("Error processing success:", error)
      toast({
        title: "Payment Success Error",
        description: error instanceof Error ? error.message : "Failed to process payment success. Please try again.",
        variant: "destructive",
      })
      setActionType(null)
    } finally {
      setLoading(false)
    }
  }

  const handleFailure = async () => {
    setLoading(true)
    setActionType("failure")
    try {
      // Check if user is authenticated
      if (!token) {
        throw new Error("Authentication required. Please log in first.")
      }

      // Use the exact payload format specified for failure
      const payloadData = {
        txnid: orderData?.orderDetails?.paymentDetails?.transactionId || "68514f97b25c02d075ca9393",
      }

      console.log("Sending failure payload to backend:", payloadData)
      console.log("Using auth token:", token ? "present" : "missing")

      // Call the actual backend API with authorization header
      const response = await fetch("https://backend-project-r734.onrender.com/api/v1/users/payment/failure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payloadData),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("Failure response from backend:", result)

      // Check if the response indicates the failure was processed successfully
      if (result.success) {
        // Clear test data
        sessionStorage.removeItem("testOrderData")

        toast({
          title: "Payment Failed",
          description: result.data?.message || "Your payment could not be processed. Order has been cancelled.",
          variant: "destructive",
        })

        // Show failure feedback before redirect
        setTimeout(() => {
          router.push("/payment/failure")
        }, 2000)
      } else {
        throw new Error(result.message || "Payment failure processing failed")
      }
    } catch (error) {
      console.error("Error processing failure:", error)
      toast({
        title: "Payment Failure Error",
        description: error instanceof Error ? error.message : "Failed to process payment failure. Please try again.",
        variant: "destructive",
      })
      setActionType(null)
    } finally {
      setLoading(false)
    }
  }

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  const order = orderData.orderDetails
  const paymentRequest = orderData.paymentRequest

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Test Page</h1>
        <p className="text-gray-600 mb-4">Development Mode - Choose payment outcome to simulate</p>
        <div className="flex justify-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            NODE_ENV: development
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Test Environment
          </Badge>
        </div>
      </div>

      {/* Visual Feedback for Actions */}
      {actionType && (
        <Alert
          className={`mb-6 ${actionType === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
        >
          <div className="flex items-center">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : actionType === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600 mr-2" />
            )}
            <AlertDescription className={actionType === "success" ? "text-green-800" : "text-red-800"}>
              {loading
                ? `Processing ${actionType} payment with backend API...`
                : `Payment ${actionType} processed successfully! Redirecting...`}
            </AlertDescription>
          </div>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Complete Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order ID and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">{orderData.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    {order.status}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Payment: {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Items */}
            <div>
              <p className="text-sm text-gray-600 mb-3 font-medium">Order Items</p>
              <div className="space-y-3">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.product?.image || "/images/tp-placeholder-img.jpg"}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product?.name}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Category: {item.product?.category}</p>
                        <p>Material: {item.product?.material}</p>
                        <p>Grade: {item.product?.grade}</p>
                        {item.product?.gem && <p>Gem: {item.product.gem}</p>}
                        {item.product?.coating && <p>Coating: {item.product.coating}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{item.product?.price}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">₹{item.product?.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Pricing Breakdown */}
            <div>
              <p className="text-sm text-gray-600 mb-3 font-medium">Price Breakdown</p>
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.couponApplied?.originalPrice || order.totalPrice}</span>
                </div>
                {order.couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.couponApplied.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{order.shippingCost}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-teal-600">₹{order.totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Placed At
                </p>
                <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                  {new Date(order.placedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created At
                </p>
                <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Updated At
                </p>
                <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                  {new Date(order.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* API Payload Preview */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-800 mb-2">API Payload Preview</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-medium text-blue-700">Success Payload:</p>
                  <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto">
                    {JSON.stringify(
                      {
                        txnid: order.paymentDetails?.transactionId || "68513e15b25c02d075ca75b6",
                        amount: order.totalPrice?.toString() || "1769.1",
                        productinfo: order.items?.[0]?.product?.name || "MIRA",
                        firstname: "Sandeep",
                        email: "sandeep@gmail.com",
                        status: "pending",
                        hash: "a5920c86d8328ed90affccb93b7bc52eeb3ef0a00d1b64e13ab5347ec3c7a6ce0fd3901753e2c79aa9533f824eee00e089614bace586e29dd8218b60b6fd3ef",
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>
                <div>
                  <p className="font-medium text-blue-700">Failure Payload:</p>
                  <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto">
                    {JSON.stringify(
                      {
                        txnid: order.paymentDetails?.transactionId || "68514f97b25c02d075ca9393",
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment & Address Details */}
        <div className="space-y-6">
          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Transaction ID</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">{order.paymentDetails?.transactionId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-semibold text-lg">₹{order.totalPrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p>{order.paymentDetails?.paymentMethod || "PayU"}</p>
              </div>
              {paymentRequest && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{paymentRequest.firstname || "Sandeep"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{paymentRequest.email || "sandeep@gmail.com"}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p className="font-medium">{order.shippingAddress?.address}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
                <p>PIN: {order.shippingAddress?.pincode}</p>
              </div>
            </CardContent>
          </Card>

          {/* Coupon Applied */}
          {order.couponApplied && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-green-600" />
                  Coupon Applied
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="font-medium text-green-800">Discount Applied</p>
                  <p className="text-sm text-green-600">
                    You saved ₹{order.couponApplied.discountAmount} with this order!
                  </p>
                  <p className="text-xs text-green-600 mt-1">Type: {order.couponApplied.couponType}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Authentication Status */}
      {!token && (
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <AlertDescription className="text-yellow-800">
            ⚠️ Authentication required: Please log in to test payment functionality.
          </AlertDescription>
        </Alert>
      )}

      {/* Payment Action Buttons */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Simulate Payment Outcome</CardTitle>
          <p className="text-sm text-gray-600">
            Choose the payment outcome to test different scenarios. This will send the appropriate API requests to the
            backend and redirect you to the corresponding result page.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleSuccess}
              disabled={loading || !token}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 min-w-[120px] disabled:opacity-50"
              size="lg"
            >
              {loading && actionType === "success" ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <CheckCircle className="h-5 w-5 mr-2" />
              )}
              Success
            </Button>

            <Button
              onClick={handleFailure}
              disabled={loading || !token}
              variant="destructive"
              className="px-8 py-3 min-w-[120px] disabled:opacity-50"
              size="lg"
            >
              {loading && actionType === "failure" ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <XCircle className="h-5 w-5 mr-2" />
              )}
              Failure
            </Button>
          </div>

          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-gray-500">This page is only available in development mode</p>
            <div className="flex justify-center gap-4 text-xs text-gray-400">
              <span>Success → backend-project-r734.onrender.com/api/v1/users/payment/success</span>
            </div>
            <div className="flex justify-center gap-4 text-xs text-gray-400">
              <span>Failure → backend-project-r734.onrender.com/api/v1/users/payment/failure</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
