"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ShoppingBag, Truck, CreditCard } from "lucide-react"
import { fetchCartItems, getCurrentUserId, fetchUserAddresses, fetchProductById } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { OrderReview } from "./order-review"
import { ShippingAddress } from "./shipping-address"
import type { CartItem, Address, Product } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { useAuthStore } from "@/lib/auth"

const steps = [
  { id: "review", title: "Order Review", icon: ShoppingBag },
  { id: "shipping", title: "Shipping", icon: Truck },
  { id: "payment", title: "Payment", icon: CreditCard },
]

export function CheckoutProcess() {
  const [currentStep, setCurrentStep] = useState("review")
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [selectedShipping, setSelectedShipping] = useState<string>("standard")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [redirectingToPayment, setRedirectingToPayment] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Check if we're in a direct purchase mode (from Buy Now button)
  const [directPurchase, setDirectPurchase] = useState<{
    productId: string
    quantity: number
    product?: Product
  } | null>(null)

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

        // Check if there's a direct purchase from URL params
        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search)
          const productId = urlParams.get("productId")
          const quantity = urlParams.get("quantity")

          if (productId && quantity) {
            try {
              // Fetch the product details to validate it exists
              const product = await fetchProductById(productId)

              // This is a direct purchase from product page
              setDirectPurchase({
                productId,
                quantity: Number.parseInt(quantity, 10),
                product,
              })

              console.log("Direct purchase product loaded:", product)

              // Skip loading cart items for direct purchase
              // But still load addresses
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
              return
            } catch (productError) {
              console.error("Error fetching product for direct purchase:", productError)
              setError("Product not found. Please try again from the product page.")
              setLoading(false)
              return
            }
          }
        }

        // Regular checkout flow - fetch cart items
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

  const handlePlaceOrderAndRedirect = async () => {
    try {
      setRedirectingToPayment(true)
      const userId = getCurrentUserId()

      if (!userId || !selectedAddress) {
        toast({
          title: "Error",
          description: "Missing required information to place order",
          variant: "destructive",
        })
        setRedirectingToPayment(false)
        return
      }

      // Get the authentication token from the auth store
      const token = useAuthStore.getState().token

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to continue",
          variant: "destructive",
        })
        setRedirectingToPayment(false)
        router.push("/login?redirect=/checkout")
        return
      }

      // Prepare order data according to the API requirements
      const orderData: any = {
        userId,
        addressId: selectedAddress,
      }

      // Handle direct purchase (Scenario 1)
      if (directPurchase) {
        // Validate that we have the product data
        if (!directPurchase.product) {
          toast({
            title: "Error",
            description: "Product information is missing. Please try again.",
            variant: "destructive",
          })
          setRedirectingToPayment(false)
          return
        }

        orderData.productId = directPurchase.productId
        orderData.quantity = directPurchase.quantity

        console.log("Placing direct purchase order with data:", {
          ...orderData,
          productInfo: {
            id: directPurchase.product._id,
            name: directPurchase.product.name,
            category: directPurchase.product.category,
            price: directPurchase.product.price,
          },
        })
      }
      // Handle cart checkout (Scenario 2)
      else {
        // Validate that we have cart items
        if (cartItems.length === 0) {
          toast({
            title: "Error",
            description: "Your cart is empty. Please add items to your cart.",
            variant: "destructive",
          })
          setRedirectingToPayment(false)
          return
        }

        console.log("Placing cart checkout order with data:", {
          ...orderData,
          cartItemsCount: cartItems.length,
          cartItems: cartItems.map((item) => ({
            id: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            category: item.product.category,
          })),
        })
      }

      // Call the API to place the order
      const response = await fetch("https://backend-project-r734.onrender.com/api/v1/users/order/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors.map((err: any) => err.message).join(", ")
          } else {
            errorMessage = errorData.message || errorMessage
          }
        } catch (e) {
          // If the error response is not valid JSON, use the default error message
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()

      // Check API response success flag
      if (!data.success) {
        let errorMessage = "Failed to place order"
        if (data.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.map((err: any) => err.message).join(", ")
        } else {
          errorMessage = data.message || errorMessage
        }
        throw new Error(errorMessage)
      }

      // Check if we have a payment URL to redirect to
      if (data.paymentUrl) {
        // Show toast before redirecting
        toast({
          title: "Order Placed Successfully",
          description: "Redirecting to payment gateway...",
        })

        // Set a small timeout to allow the toast to be seen
        setTimeout(() => {
          // Redirect to payment URL
          window.location.href = data.paymentUrl
        }, 1500)

        return
      }

      // If no payment URL, show error
      throw new Error("Payment URL not received from server")
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to place order. Please try again.",
        variant: "destructive",
      })
      setRedirectingToPayment(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  if (redirectingToPayment) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Processing Your Order</h2>
        <p className="text-gray-600 text-center">
          Please wait while we process your order and redirect you to the payment gateway...
        </p>
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Do not refresh or close this page. You will be redirected automatically.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col justify-center items-center min-h-[60vh]">
        <Alert variant="destructive" className="w-full max-w-md mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/cart")}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md"
          >
            Return to Cart
          </button>
          <button
            onClick={() => router.push("/collection")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
          >
            Continue Shopping
          </button>
        </div>
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
                {directPurchase ? (
                  // For direct purchase, show a simplified review
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Direct Purchase</h2>
                    {directPurchase.product ? (
                      <div className="mb-4">
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <img
                            src={directPurchase.product.images[0] || "/images/tp-placeholder-img.jpg"}
                            alt={directPurchase.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{directPurchase.product.name}</h3>
                            <p className="text-sm text-gray-600">Quantity: {directPurchase.quantity}</p>
                            <p className="text-sm font-medium">₹{directPurchase.product.price}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-blue-800">
                          <strong>Product ID:</strong> {directPurchase.productId}
                        </p>
                        <p className="text-sm text-blue-800">
                          <strong>Quantity:</strong> {directPurchase.quantity}
                        </p>
                      </div>
                    )}
                    <button
                      onClick={handleNextStep}
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-md font-medium"
                    >
                      Continue to Shipping
                    </button>
                  </div>
                ) : (
                  // For cart checkout, show the regular order review
                  <OrderReview cartItems={cartItems} onNext={handleNextStep} />
                )}
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
                  onNext={handlePlaceOrderAndRedirect}
                  onPrevious={handlePreviousStep}
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
              {directPurchase ? (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {directPurchase.product?.name || "Direct Purchase"} × {directPurchase.quantity}
                  </span>
                  <span className="font-medium">
                    {directPurchase.product
                      ? `₹${directPurchase.product.price * directPurchase.quantity}`
                      : "Price calculated at checkout"}
                  </span>
                </div>
              ) : (
                cartItems.map((item, index) => (
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
                ))
              )}
            </motion.div>

            {(!directPurchase || directPurchase.product) && (
              <>
                <div className="space-y-2 py-4 border-t border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ₹
                      {directPurchase && directPurchase.product
                        ? directPurchase.product.price * directPurchase.quantity
                        : subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">₹{shippingCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="font-medium">
                      ₹
                      {directPurchase && directPurchase.product
                        ? Math.round(directPurchase.product.price * directPurchase.quantity * 0.05)
                        : tax}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between pt-4 text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-teal-600">
                    ₹
                    {directPurchase && directPurchase.product
                      ? directPurchase.product.price * directPurchase.quantity +
                        shippingCost +
                        Math.round(directPurchase.product.price * directPurchase.quantity * 0.05)
                      : total}
                  </span>
                </div>
              </>
            )}

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
          </motion.div>
        </div>
      </div>
    </div>
  )
}
