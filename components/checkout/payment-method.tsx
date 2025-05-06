"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CreditCard, Wallet, Shield, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaymentMethodProps {
  selectedPayment: string
  setSelectedPayment: (method: string) => void
  onPlaceOrder: (paymentDetails: any) => Promise<void>
  onPrevious: () => void
  isLoading: boolean
}

export function PaymentMethod({
  selectedPayment,
  setSelectedPayment,
  onPlaceOrder,
  onPrevious,
  isLoading,
}: PaymentMethodProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [upiId, setUpiId] = useState("")
  const [walletNumber, setWalletNumber] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (selectedPayment === "card") {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast({
          title: "Error",
          description: "Please fill in all card details",
          variant: "destructive",
        })
        return
      }

      // Validate card number format (16 digits)
      if (cardNumber.replace(/\s/g, "").length !== 16 || !/^\d+$/.test(cardNumber.replace(/\s/g, ""))) {
        toast({
          title: "Error",
          description: "Please enter a valid 16-digit card number",
          variant: "destructive",
        })
        return
      }

      // Validate expiry date format (MM/YY)
      if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        toast({
          title: "Error",
          description: "Please enter a valid expiry date (MM/YY)",
          variant: "destructive",
        })
        return
      }

      // Validate CVV (3 or 4 digits)
      if (!/^\d{3,4}$/.test(cvv)) {
        toast({
          title: "Error",
          description: "Please enter a valid CVV",
          variant: "destructive",
        })
        return
      }

      onPlaceOrder({
        cardNumber: cardNumber.replace(/\s/g, ""),
        cardName,
        expiryDate,
        cvv,
      })
    } else if (selectedPayment === "upi") {
      if (!upiId) {
        toast({
          title: "Error",
          description: "Please enter your UPI ID",
          variant: "destructive",
        })
        return
      }

      // Validate UPI ID format (username@provider)
      if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId)) {
        toast({
          title: "Error",
          description: "Please enter a valid UPI ID (e.g., username@upi)",
          variant: "destructive",
        })
        return
      }

      onPlaceOrder({ upiId })
    } else if (selectedPayment === "wallet") {
      if (!walletNumber) {
        toast({
          title: "Error",
          description: "Please enter your wallet number",
          variant: "destructive",
        })
        return
      }

      // Validate wallet number (10 digits)
      if (!/^\d{10}$/.test(walletNumber)) {
        toast({
          title: "Error",
          description: "Please enter a valid 10-digit wallet number",
          variant: "destructive",
        })
        return
      }

      onPlaceOrder({ walletNumber })
    } else if (selectedPayment === "cod") {
      onPlaceOrder({ method: "cod" })
    }
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Payment Method</h2>
        <p className="text-gray-500 mt-1">Choose your preferred payment method</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6 border-b border-gray-200">
          <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="grid grid-cols-1 gap-4">
            <div className="relative">
              <RadioGroupItem value="card" id="payment-card" className="peer sr-only" />
              <Label
                htmlFor="payment-card"
                className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-teal-500 peer-data-[state=checked]:border-teal-500 peer-data-[state=checked]:bg-teal-50"
              >
                <div className="mr-4 p-2 bg-gray-100 rounded-full">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-grow">
                  <div className="font-medium">Credit / Debit Card</div>
                  <div className="text-sm text-gray-500">Pay securely with your card</div>
                </div>
              </Label>
              {selectedPayment === "card" && <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-teal-500" />}
            </div>

            <div className="relative">
              <RadioGroupItem value="upi" id="payment-upi" className="peer sr-only" />
              <Label
                htmlFor="payment-upi"
                className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-teal-500 peer-data-[state=checked]:border-teal-500 peer-data-[state=checked]:bg-teal-50"
              >
                <div className="mr-4 p-2 bg-gray-100 rounded-full">
                  <svg
                    className="h-5 w-5 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L4 6V18L12 22L20 18V6L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 22V16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20 6L12 10L4 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 14L12 18L20 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 10V16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex-grow">
                  <div className="font-medium">UPI</div>
                  <div className="text-sm text-gray-500">Pay using UPI apps like Google Pay, PhonePe, etc.</div>
                </div>
              </Label>
              {selectedPayment === "upi" && <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-teal-500" />}
            </div>

            <div className="relative">
              <RadioGroupItem value="wallet" id="payment-wallet" className="peer sr-only" />
              <Label
                htmlFor="payment-wallet"
                className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-teal-500 peer-data-[state=checked]:border-teal-500 peer-data-[state=checked]:bg-teal-50"
              >
                <div className="mr-4 p-2 bg-gray-100 rounded-full">
                  <Wallet className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-grow">
                  <div className="font-medium">Mobile Wallet</div>
                  <div className="text-sm text-gray-500">Pay using Paytm, Amazon Pay, etc.</div>
                </div>
              </Label>
              {selectedPayment === "wallet" && <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-teal-500" />}
            </div>

            <div className="relative">
              <RadioGroupItem value="cod" id="payment-cod" className="peer sr-only" />
              <Label
                htmlFor="payment-cod"
                className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-teal-500 peer-data-[state=checked]:border-teal-500 peer-data-[state=checked]:bg-teal-50"
              >
                <div className="mr-4 p-2 bg-gray-100 rounded-full">
                  <svg
                    className="h-5 w-5 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 7L12 13L21 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex-grow">
                  <div className="font-medium">Cash on Delivery</div>
                  <div className="text-sm text-gray-500">Pay when you receive your order</div>
                </div>
              </Label>
              {selectedPayment === "cod" && <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-teal-500" />}
            </div>
          </RadioGroup>
        </div>

        <div className="p-6 border-b border-gray-200">
          {selectedPayment === "card" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="card-name">Cardholder Name</Label>
                <Input
                  id="card-name"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry-date">Expiry Date</Label>
                  <Input
                    id="expiry-date"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    maxLength={5}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                    maxLength={4}
                    className="mt-1"
                    type="password"
                  />
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500 mt-4">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                <span>Your payment information is encrypted and secure</span>
              </div>
            </div>
          )}

          {selectedPayment === "upi" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="upi-id">UPI ID</Label>
                <Input
                  id="upi-id"
                  placeholder="username@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center text-sm text-gray-500 mt-4">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                <span>You will receive a payment request on your UPI app</span>
              </div>
            </div>
          )}

          {selectedPayment === "wallet" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="wallet-number">Mobile Number</Label>
                <Input
                  id="wallet-number"
                  placeholder="10-digit mobile number"
                  value={walletNumber}
                  onChange={(e) => setWalletNumber(e.target.value.replace(/\D/g, ""))}
                  maxLength={10}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center text-sm text-gray-500 mt-4">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                <span>You will receive a payment request on your registered wallet</span>
              </div>
            </div>
          )}

          {selectedPayment === "cod" && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                Cash on Delivery is available for this order. You will need to pay ₹50 extra as COD handling charges.
              </p>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 flex flex-col sm:flex-row justify-between items-center">
          <Button type="button" variant="outline" onClick={onPrevious} className="mb-4 sm:mb-0">
            Back to Shipping
          </Button>

          <Button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white px-8" disabled={isLoading}>
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Place Order"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
