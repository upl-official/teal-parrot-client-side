"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle,
  ShoppingBag,
  Truck,
  CreditCard,
  Tag,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Minus,
  Plus,
} from "lucide-react"
import {
  fetchCartItems,
  getCurrentUserId,
  fetchUserAddresses,
  fetchProductById,
  validateCoupon,
  updateCartItem,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShippingAddress } from "./shipping-address"
import type { CartItem, Address, Product, Coupon, CouponValidationResult } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { useAuthStore } from "@/lib/auth"
import { cn } from "@/lib/utils"

const steps = [
  { id: "review", title: "Order Review", icon: ShoppingBag },
  { id: "shipping", title: "Shipping", icon: Truck },
  { id: "payment", title: "Payment", icon: CreditCard },
]

interface CheckoutProcessProps {
  directProductId?: string | null
  directQuantity?: number
}

export function CheckoutProcess({ directProductId, directQuantity }: CheckoutProcessProps) {
  const [currentStep, setCurrentStep] = useState("review")
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [selectedShipping, setSelectedShipping] = useState<string>("free")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [redirectingToPayment, setRedirectingToPayment] = useState(false)

  // Coupon states
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [couponValidationResult, setCouponValidationResult] = useState<CouponValidationResult | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  // Check if we're in a direct purchase mode (from Buy Now button)
  const [directPurchase, setDirectPurchase] = useState<{
    productId: string
    quantity: number
    product?: Product
  } | null>(null)

  // Calculate shipping cost based on selected method
  const shippingCost = selectedShipping === "express" ? 100 : 0

  // Calculate subtotal
  const subtotal =
    directPurchase && directPurchase.product
      ? directPurchase.product.price * directPurchase.quantity
      : cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)

  // Calculate discount from coupon validation result
  const discount = couponValidationResult?.isValid ? couponValidationResult.discountAmount || 0 : 0

  // Calculate total
  const total = subtotal - discount + shippingCost

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getCurrentUserId()
        if (!userId) {
          setError("Please log in to proceed with checkout")
          setLoading(false)
          return
        }

        // Check if there's a direct purchase from props or URL params
        if (directProductId && directQuantity) {
          try {
            // Fetch the product details to validate it exists
            const product = await fetchProductById(directProductId)

            // This is a direct purchase from product page
            setDirectPurchase({
              productId: directProductId,
              quantity: directQuantity,
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

        // Check URL params as fallback
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
  }, [directProductId, directQuantity])

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponValidationResult({
        isValid: false,
        message: "Please enter a coupon code",
      })
      return
    }

    try {
      setCouponLoading(true)
      setCouponValidationResult(null)

      // Prepare cart items for validation
      const itemsForValidation =
        directPurchase && directPurchase.product
          ? [
              {
                product: directPurchase.product,
                quantity: directPurchase.quantity,
              },
            ]
          : cartItems

      const validation = await validateCoupon(couponCode, subtotal, itemsForValidation)
      setCouponValidationResult(validation)

      if (validation.isValid && validation.coupon) {
        setAppliedCoupon(validation.coupon)
        setCouponCode("")
        toast({
          title: "Coupon Applied Successfully!",
          description: validation.message,
        })
      } else {
        setAppliedCoupon(null)
        toast({
          title: "Coupon Application Failed",
          description: validation.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error applying coupon:", error)
      setCouponValidationResult({
        isValid: false,
        message: "Unable to validate coupon. Please try again later.",
      })
      toast({
        title: "Error",
        description: "Unable to validate coupon. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponValidationResult(null)
    setCouponCode("")
    toast({
      title: "Coupon Removed",
      description: "The coupon has been removed from your order.",
    })
  }

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

  const handlePlaceOrder = async () => {
    try {
      setProcessingPayment(true)
      const userId = getCurrentUserId()

      if (!userId || !selectedAddress) {
        toast({
          title: "Error",
          description: "Missing required information to place order",
          variant: "destructive",
        })
        setProcessingPayment(false)
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
        setProcessingPayment(false)
        router.push("/login?redirect=/checkout")
        return
      }

      // Get selected address details
      const selectedAddressDetails = addresses.find((addr) => addr._id === selectedAddress)

      // Prepare order data based on scenario using the new API structure
      const orderData: any = {
        userId,
        addressId: selectedAddress,
        shippingCost,
      }

      // Add coupon if applied
      if (appliedCoupon) {
        orderData.couponId = appliedCoupon._id
      }

      // Scenario 1: Direct purchase (Buy Now)
      if (directPurchase) {
        if (!directPurchase.product) {
          toast({
            title: "Error",
            description: "Product information is missing. Please try again.",
            variant: "destructive",
          })
          setProcessingPayment(false)
          return
        }

        orderData.productId = directPurchase.productId
        orderData.quantity = directPurchase.quantity

        console.log("Placing direct purchase order with data:", orderData)
      }
      // Scenario 2: Cart checkout
      else {
        if (cartItems.length === 0) {
          toast({
            title: "Error",
            description: "Your cart is empty. Please add items to your cart.",
            variant: "destructive",
          })
          setProcessingPayment(false)
          return
        }

        console.log("Placing cart checkout order with data:", orderData)
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
      console.log("Order placement response:", data)

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

      // Check if we're in development mode and redirect to test page
      const isDevelopment = process.env.NODE_ENV === "development" || window.location.hostname === "localhost"

      if (isDevelopment) {
        // Prepare comprehensive order data for test page
        const testOrderData = {
          orderId: data.data?.order?._id || `test-${Date.now()}`,
          orderData: data.data,
          paymentRequest: data.data?.payment?.paymentRequest,
          // Enhanced order details for test page
          orderDetails: {
            shippingAddress: selectedAddressDetails || {
              address: "Test Address",
              city: "Test City",
              state: "Test State",
              pincode: "123456",
            },
            paymentDetails: {
              transactionId: data.data?.payment?.paymentRequest?.txnid || `txn-${Date.now()}`,
              paymentMethod: "PayU",
              paymentDate: new Date().toISOString(),
            },
            items: directPurchase
              ? [
                  {
                    product: {
                      _id: directPurchase.productId,
                      name: directPurchase.product?.name || "Product",
                      price: directPurchase.product?.price || 0,
                      image: directPurchase.product?.images?.[0] || "/images/tp-placeholder-img.jpg",
                      category: directPurchase.product?.category || "General",
                      material: directPurchase.product?.material || "Sterling Silver",
                      grade: directPurchase.product?.grade || "925",
                      gem: directPurchase.product?.gem || "Zircon",
                      coating: directPurchase.product?.coating || "Rhodium Plated",
                    },
                    quantity: directPurchase.quantity,
                    _id: `item-${Date.now()}`,
                  },
                ]
              : cartItems.map((item, index) => ({
                  product: {
                    _id: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    image: item.product.images?.[0] || "/images/tp-placeholder-img.jpg",
                    category: item.product.category,
                    material: item.product.material,
                    grade: item.product.grade,
                    gem: item.product.gem,
                    coating: item.product.coating,
                  },
                  quantity: item.quantity,
                  _id: `item-${Date.now()}-${index}`,
                })),
            totalPrice: total,
            status: "pending",
            paymentStatus: "pending",
            couponApplied: appliedCoupon
              ? {
                  couponId: appliedCoupon._id,
                  discountAmount: discount,
                  originalPrice: subtotal + shippingCost,
                  couponType: appliedCoupon.type,
                  eligibleProducts: [],
                  _id: `coupon-${Date.now()}`,
                }
              : null,
            shippingCost,
            placedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }

        // Store order data in sessionStorage for the test page
        sessionStorage.setItem("testOrderData", JSON.stringify(testOrderData))

        setRedirectingToPayment(true)

        toast({
          title: "Order Placed Successfully",
          description: "Redirecting to test payment page...",
        })

        console.log("Development mode detected, redirecting to test page with data:", testOrderData)

        // Redirect to test page after a short delay
        setTimeout(() => {
          router.push("/payment/test")
        }, 1500)

        return
      }

      // Production flow - Check if we have payment URL for direct redirect
      if (data.data?.payment?.paymentUrl) {
        setRedirectingToPayment(true)

        toast({
          title: "Order Placed Successfully",
          description: "Redirecting to payment gateway...",
        })

        console.log("Redirecting to payment URL:", data.data.payment.paymentUrl)

        // Redirect to payment URL after a short delay
        setTimeout(() => {
          window.location.href = data.data.payment.paymentUrl
        }, 1500)

        return
      }

      // Check if we have payment request data for form submission
      if (data.data?.payment?.paymentRequest) {
        setRedirectingToPayment(true)

        toast({
          title: "Order Placed Successfully",
          description: "Redirecting to payment gateway...",
        })

        // Create a form and submit to PayU gateway
        const form = document.createElement("form")
        form.method = "POST"
        form.action = "https://test.payu.in/_payment"
        form.style.display = "none"

        const paymentData = data.data.payment.paymentRequest

        // Add all required fields
        const fields = {
          key: paymentData.key,
          txnid: paymentData.txnid,
          amount: paymentData.amount,
          productinfo: paymentData.productinfo,
          firstname: paymentData.firstname,
          email: paymentData.email,
          phone: paymentData.phone,
          surl: paymentData.surl,
          furl: paymentData.furl,
          hash: paymentData.hash,
        }

        Object.entries(fields).forEach(([key, value]) => {
          const input = document.createElement("input")
          input.type = "hidden"
          input.name = key
          input.value = value
          form.appendChild(input)
        })

        document.body.appendChild(form)

        // Submit form after a short delay
        setTimeout(() => {
          form.submit()
        }, 1500)

        return
      }

      // If no payment data, show error
      throw new Error("Payment information not received from server")
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to place order. Please try again.",
        variant: "destructive",
      })
      setProcessingPayment(false)
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
        <p className="text-gray-600 text-center mb-4">
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
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4">{directPurchase ? "Direct Purchase" : "Order Review"}</h2>

                  {/* Order Items with Quantity Controls */}
                  <div className="space-y-4 mb-6">
                    {directPurchase
                      ? directPurchase.product && (
                          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <img
                              src={directPurchase.product.images[0] || "/images/tp-placeholder-img.jpg"}
                              alt={directPurchase.product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium">{directPurchase.product.name}</h3>
                              <p className="text-sm font-medium">₹{directPurchase.product.price}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (directPurchase.quantity > 1) {
                                    setDirectPurchase({
                                      ...directPurchase,
                                      quantity: directPurchase.quantity - 1,
                                    })
                                  }
                                }}
                                disabled={directPurchase.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center font-medium">{directPurchase.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setDirectPurchase({
                                    ...directPurchase,
                                    quantity: directPurchase.quantity + 1,
                                  })
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      : cartItems.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <img
                              src={item.product.images[0] || "/images/tp-placeholder-img.jpg"}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium">{item.product.name}</h3>
                              <p className="text-sm font-medium">₹{item.product.price}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  if (item.quantity > 1) {
                                    const newQuantity = item.quantity - 1
                                    try {
                                      const userId = getCurrentUserId()
                                      await updateCartItem(userId, item.product._id, newQuantity)
                                      setCartItems((prev) =>
                                        prev.map((cartItem) =>
                                          cartItem.product._id === item.product._id
                                            ? { ...cartItem, quantity: newQuantity }
                                            : cartItem,
                                        ),
                                      )
                                      toast({
                                        title: "Quantity Updated",
                                        description: "Item quantity has been decreased",
                                      })
                                    } catch (error) {
                                      toast({
                                        title: "Error",
                                        description: "Failed to update quantity",
                                        variant: "destructive",
                                      })
                                    }
                                  }
                                }}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  const newQuantity = item.quantity + 1
                                  try {
                                    const userId = getCurrentUserId()
                                    await updateCartItem(userId, item.product._id, newQuantity)
                                    setCartItems((prev) =>
                                      prev.map((cartItem) =>
                                        cartItem.product._id === item.product._id
                                          ? { ...cartItem, quantity: newQuantity }
                                          : cartItem,
                                      ),
                                    )
                                    toast({
                                      title: "Quantity Updated",
                                      description: "Item quantity has been increased",
                                    })
                                  } catch (error) {
                                    toast({
                                      title: "Error",
                                      description: "Failed to update quantity",
                                      variant: "destructive",
                                    })
                                  }
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                  </div>

                  {/* Coupon Section */}
                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <h3 className="text-lg font-medium mb-4">Apply Coupon Code</h3>

                    {appliedCoupon ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium text-green-800">{appliedCoupon.code}</p>
                              <p className="text-sm text-green-600">
                                {appliedCoupon.offerPercentage}% off •
                                {appliedCoupon.type === "product"
                                  ? " Applicable to specific products"
                                  : " All products"}
                              </p>
                              {appliedCoupon.minimumOrderAmount > 0 && (
                                <p className="text-xs text-green-600">
                                  Min. order: ₹{appliedCoupon.minimumOrderAmount}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveCoupon}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {couponValidationResult?.message && (
                          <Alert className="border-green-200 bg-green-50">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                              {couponValidationResult.message}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value.toUpperCase())
                              setCouponValidationResult(null)
                            }}
                            className={cn(
                              couponValidationResult && !couponValidationResult.isValid && "border-red-300",
                            )}
                          />
                          <Button
                            onClick={handleApplyCoupon}
                            disabled={couponLoading || !couponCode.trim()}
                            className="whitespace-nowrap"
                          >
                            {couponLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                                Validating...
                              </>
                            ) : (
                              "Apply Coupon"
                            )}
                          </Button>
                        </div>

                        {couponValidationResult && !couponValidationResult.isValid && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{couponValidationResult.message}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </div>

                  <Button onClick={handleNextStep} className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                    Continue to Shipping
                  </Button>
                </div>
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
                  onNext={handlePlaceOrder}
                  onPrevious={handlePreviousStep}
                  isProcessing={processingPayment}
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

            <div className="space-y-2 py-4 border-t border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              {appliedCoupon && discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">₹{shippingCost}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4 text-lg font-semibold">
              <span>Total</span>
              <span className="text-teal-600">₹{total}</span>
            </div>

            {appliedCoupon && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center text-sm text-green-800">
                  <Tag className="h-4 w-4 mr-2" />
                  <span>
                    You saved ₹{discount} with {appliedCoupon.code}!
                  </span>
                </div>
              </div>
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
