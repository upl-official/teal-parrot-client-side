"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ShoppingBag, Truck, CreditCard, CheckCheck } from "lucide-react"
import { fetchCartItems, getCurrentUserId, fetchUserAddresses } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { OrderReview } from "./order-review"
import { ShippingAddress } from "./shipping-address"
import { PaymentMethod } from "./payment-method"
import { OrderConfirmation } from "./order-confirmation"
import type { CartItem, Address } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

const steps = [
  { id: "review", title: "Order Review", icon: ShoppingBag },
  { id: "shipping", title: "Shipping", icon: Truck },
  { id: "payment", title: "Payment", icon: CreditCard },
  { id: "confirmation", title: "Confirmation", icon: CheckCheck },
]

export function CheckoutProcess() {
  const [currentStep, setCurrentStep] = useState("review")
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [selectedShipping, setSelectedShipping] = useState<string>("standard")
  const [selectedPayment, setSelectedPayment] = useState<string>("card")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Calculate shipping cost based on selected method
  const shippingCost = selectedShipping === "express" ? 150 : selectedShipping === "standard" ? 50 : 0

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)

  // Calculate tax (5% of subtotal)
  const tax = Math.round(subtotal * 0.05)

  // Calculate total
  const total = subtotal + tax + shippingCost

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getCurrentUserId()
        if (!userId) {
          setError("Please log in to proceed with checkout")
          setLoading(false)
          return
        }

        // Fetch cart items
        const items = await fetchCartItems(userId)
        if (items.length === 0) {
          setError("Your cart is empty")
          setLoading(false)
          return
        }
        setCartItems(items)

        // Fetch user addresses
        const userAddresses = await fetchUserAddresses(userId)
        setAddresses(userAddresses)

        // Set default address if available
        const defaultAddress = userAddresses.find((addr) => addr.isDefault)
        if (defaultAddress) {
          setSelectedAddress(defaultAddress._id)
        } else if (userAddresses.length > 0) {
          setSelectedAddress(userAddresses[0]._id)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching checkout data:", error)
        setError("Failed to load checkout information. Please try again.")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleNextStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id)
      window.scrollTo(0, 0)
    }
  }

  const handlePreviousStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id)
      window.scrollTo(0, 0)
    }
  }

  const handlePlaceOrder = async (paymentDetails: any) => {
    try {
      setLoading(true)
      const userId = getCurrentUserId()

      if (!userId || !selectedAddress) {
        toast({
          title: "Error",
          description: "Missing required information to place order",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Prepare order items
      const items = cartItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }))

      // Prepare order data according to the API requirements
      const orderData = {
        userId,
        addressId: selectedAddress,
        items,
        paymentMethod: selectedPayment,
        shippingMethod: selectedShipping,
        totalAmount: total,
      }

      console.log("Placing order with data:", orderData)

      // Call the API to place the order
      const response = await fetch("https://backend-project-r734.onrender.com/api/v1/users/order/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(orderData),
      })

      // Handle network errors
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)

        let errorMessage = "Failed to place order"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          // If the error response is not valid JSON, use the default error message
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()

      // Check API response success flag
      if (!data.success) {
        throw new Error(data.message || "Failed to place order")
      }

      // Order placed successfully
      setOrderPlaced(true)
      setOrderDetails(data.data)
      handleNextStep()

      // Clear cart items from local state
      setCartItems([])

      toast({
        title: "Order Placed Successfully",
        description: `Your order has been placed successfully.`,
      })
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to place order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col justify-center items-center min-h-[60vh]">
        <Alert variant="destructive" className="w-full max-w-md mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <button
          onClick={() => router.push("/cart")}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md"
        >
          Return to Cart
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* Checkout Progress */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center mb-4 md:mb-0">
              <motion.div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep === step.id
                    ? "bg-teal-500 text-white"
                    : steps.findIndex((s) => s.id === currentStep) > index
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {steps.findIndex((s) => s.id === currentStep) > index ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <step.icon className="h-6 w-6" />
                )}
              </motion.div>
              <span
                className={`ml-2 text-sm md:text-base ${
                  currentStep === step.id ? "font-semibold text-teal-500" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <motion.div
                  className="hidden md:block w-12 h-1 mx-2 bg-gray-200 relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    className={`h-full absolute top-0 left-0 bg-green-500`}
                    initial={{ width: "0%" }}
                    animate={{
                      width: steps.findIndex((s) => s.id === currentStep) > index ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <AnimatePresence mode="wait">
            {currentStep === "review" && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <OrderReview cartItems={cartItems} onNext={handleNextStep} />
              </motion.div>
            )}

            {currentStep === "shipping" && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ShippingAddress
                  addresses={addresses}
                  selectedAddress={selectedAddress}
                  setSelectedAddress={setSelectedAddress}
                  selectedShipping={selectedShipping}
                  setSelectedShipping={setSelectedShipping}
                  onNext={handleNextStep}
                  onPrevious={handlePreviousStep}
                />
              </motion.div>
            )}

            {currentStep === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PaymentMethod
                  selectedPayment={selectedPayment}
                  setSelectedPayment={setSelectedPayment}
                  onPlaceOrder={handlePlaceOrder}
                  onPrevious={handlePreviousStep}
                  isLoading={loading}
                />
              </motion.div>
            )}

            {currentStep === "confirmation" && orderPlaced && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <OrderConfirmation
                  orderDetails={orderDetails}
                  cartItems={cartItems}
                  selectedAddress={addresses.find((addr) => addr._id === selectedAddress)}
                  shippingMethod={selectedShipping}
                  paymentMethod={selectedPayment}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <motion.div
            className="bg-gray-50 rounded-lg p-6 border border-gray-200 sticky top-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4 pb-4 border-b border-gray-200">Order Summary</h2>

            <motion.div
              className="space-y-3 mb-4"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.3,
                  },
                },
              }}
              initial="hidden"
              animate="show"
            >
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.product._id}
                  className="flex justify-between text-sm"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <span className="text-gray-600">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium">₹{item.product.price * item.quantity}</span>
                </motion.div>
              ))}
            </motion.div>

            <div className="space-y-2 py-4 border-t border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">₹{shippingCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (5%)</span>
                <span className="font-medium">₹{tax}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4 text-lg font-semibold">
              <span>Total</span>
              <span className="text-teal-600">₹{total}</span>
            </div>

            {currentStep !== "confirmation" && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Free Returns</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>24/7 Customer Support</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
