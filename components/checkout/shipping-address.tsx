"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { PlusCircle, CheckCircle, Truck, Zap } from "lucide-react"
import type { Address } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { addUserAddress } from "@/lib/api"
import { useAuthStore } from "@/lib/auth"

interface ShippingAddressProps {
  addresses: Address[]
  selectedAddress: string | null
  setSelectedAddress: (addressId: string) => void
  selectedShipping: string
  setSelectedShipping: (method: string) => void
  onNext: () => void
  onPrevious: () => void
  onAddressAdded: (newAddress: Address) => void
}

export function ShippingAddress({
  addresses,
  selectedAddress,
  setSelectedAddress,
  selectedShipping,
  setSelectedShipping,
  onNext,
  onPrevious,
  onAddressAdded,
}: ShippingAddressProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showInlineForm, setShowInlineForm] = useState(false)
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false)
  const [addressFormData, setAddressFormData] = useState({
    address: "",
    state: "",
    city: "",
    pincode: "",
  })
  const [addressFormErrors, setAddressFormErrors] = useState<Record<string, string>>({})
  const [addressSubmissionMessage, setAddressSubmissionMessage] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const { user } = useAuthStore()

  const handleAddressAdded = (newAddress: Address) => {
    onAddressAdded(newAddress)
    setShowInlineForm(false)
    setAddressFormData({ address: "", state: "", city: "", pincode: "" })
    setAddressSubmissionMessage({ type: "success", message: "Address added successfully!" })
    setTimeout(() => setAddressSubmissionMessage(null), 3000)
  }

  const validateAddressForm = () => {
    const errors: Record<string, string> = {}

    if (!addressFormData.address.trim()) {
      errors.address = "Address is required"
    }
    if (!addressFormData.state.trim()) {
      errors.state = "State is required"
    }
    if (!addressFormData.city.trim()) {
      errors.city = "City is required"
    }
    if (!addressFormData.pincode.trim()) {
      errors.pincode = "Pincode is required"
    } else if (!/^\d{6}$/.test(addressFormData.pincode.trim())) {
      errors.pincode = "Pincode must be 6 digits"
    }

    setAddressFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInlineAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateAddressForm()) {
      return
    }

    if (!user?._id) {
      setAddressSubmissionMessage({
        type: "error",
        message: "User not authenticated. Please log in again.",
      })
      return
    }

    setIsSubmittingAddress(true)
    setAddressSubmissionMessage(null)

    try {
      const newAddress = await addUserAddress(user._id, {
        address: addressFormData.address.trim(),
        state: addressFormData.state.trim(),
        city: addressFormData.city.trim(),
        pincode: addressFormData.pincode.trim(),
      })

      handleAddressAdded(newAddress)
    } catch (error) {
      console.error("Error adding address:", error)
      setAddressSubmissionMessage({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to add address. Please try again.",
      })
    } finally {
      setIsSubmittingAddress(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setAddressFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (addressFormErrors[field]) {
      setAddressFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleContinueToPayment = async () => {
    setIsProcessing(true)
    try {
      await onNext()
    } catch (error) {
      console.error("Error proceeding to payment:", error)
      setIsProcessing(false)
    }
  }

  const shippingOptions = [
    {
      id: "free",
      name: "Free Shipping",
      description: "10-14 business days",
      price: 0,
      icon: Truck,
    },
    {
      id: "express",
      name: "Express Shipping",
      description: "7 business days",
      price: 100,
      icon: Zap,
    },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Shipping Information</h2>
        <p className="text-gray-500 mt-1">Select your shipping address and delivery method</p>
      </div>

      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium mb-4">Shipping Address</h3>

        {/* Address submission message */}
        {addressSubmissionMessage && (
          <div
            className={`mb-4 p-3 rounded-md ${
              addressSubmissionMessage.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {addressSubmissionMessage.message}
          </div>
        )}

        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You don't have any saved addresses</p>
            <Button onClick={() => setShowInlineForm(true)} className="bg-teal-500 hover:bg-teal-600">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <RadioGroup
              value={selectedAddress || undefined}
              onValueChange={setSelectedAddress}
              className="grid grid-cols-1 gap-4"
            >
              {addresses.map((address) => (
                <div key={address._id} className="relative">
                  <RadioGroupItem value={address._id} id={`address-${address._id}`} className="peer sr-only" />
                  <Label
                    htmlFor={`address-${address._id}`}
                    className="flex flex-col p-4 border-2 rounded-lg cursor-pointer hover:border-teal-500 peer-data-[state=checked]:border-teal-500 peer-data-[state=checked]:bg-teal-50"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{address.address}</span>
                      {address.isDefault && (
                        <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">Default</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 mt-1">
                      {address.city}, {address.state}, {address.pincode}
                    </span>
                  </Label>
                  {selectedAddress === address._id && (
                    <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-teal-500" />
                  )}
                </div>
              ))}
            </RadioGroup>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowInlineForm(true)} className="flex-1">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
              </Button>
            </div>
          </div>
        )}

        {/* Inline Address Form */}
        {showInlineForm && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">Add New Address</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowInlineForm(false)
                  setAddressFormData({ address: "", state: "", city: "", pincode: "" })
                  setAddressFormErrors({})
                  setAddressSubmissionMessage(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleInlineAddressSubmit} className="space-y-4">
              <div>
                <Label htmlFor="inline-address" className="text-sm font-medium text-gray-700">
                  Address *
                </Label>
                <Input
                  id="inline-address"
                  type="text"
                  value={addressFormData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="House No., Apartment No."
                  className={`mt-1 ${addressFormErrors.address ? "border-red-500" : ""}`}
                  disabled={isSubmittingAddress}
                />
                {addressFormErrors.address && <p className="text-red-500 text-sm mt-1">{addressFormErrors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inline-city" className="text-sm font-medium text-gray-700">
                    City *
                  </Label>
                  <Input
                    id="inline-city"
                    type="text"
                    value={addressFormData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="City"
                    className={`mt-1 ${addressFormErrors.city ? "border-red-500" : ""}`}
                    disabled={isSubmittingAddress}
                  />
                  {addressFormErrors.city && <p className="text-red-500 text-sm mt-1">{addressFormErrors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="inline-state" className="text-sm font-medium text-gray-700">
                    State *
                  </Label>
                  <Input
                    id="inline-state"
                    type="text"
                    value={addressFormData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="State"
                    className={`mt-1 ${addressFormErrors.state ? "border-red-500" : ""}`}
                    disabled={isSubmittingAddress}
                  />
                  {addressFormErrors.state && <p className="text-red-500 text-sm mt-1">{addressFormErrors.state}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="inline-pincode" className="text-sm font-medium text-gray-700">
                  Pincode *
                </Label>
                <Input
                  id="inline-pincode"
                  type="text"
                  value={addressFormData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  placeholder="Pincode"
                  maxLength={6}
                  className={`mt-1 ${addressFormErrors.pincode ? "border-red-500" : ""}`}
                  disabled={isSubmittingAddress}
                />
                {addressFormErrors.pincode && <p className="text-red-500 text-sm mt-1">{addressFormErrors.pincode}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowInlineForm(false)
                    setAddressFormData({ address: "", state: "", city: "", pincode: "" })
                    setAddressFormErrors({})
                    setAddressSubmissionMessage(null)
                  }}
                  disabled={isSubmittingAddress}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingAddress}
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
                >
                  {isSubmittingAddress ? (
                    <>
                      <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Adding...
                    </>
                  ) : (
                    "Add Address"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium mb-4">Shipping Method</h3>

        <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping} className="grid grid-cols-1 gap-4">
          {shippingOptions.map((option) => (
            <div key={option.id} className="relative">
              <RadioGroupItem value={option.id} id={`shipping-${option.id}`} className="peer sr-only" />
              <Label
                htmlFor={`shipping-${option.id}`}
                className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-teal-500 peer-data-[state=checked]:border-teal-500 peer-data-[state=checked]:bg-teal-50"
              >
                <div className="mr-4 p-2 bg-gray-100 rounded-full">
                  <option.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-grow">
                  <div className="font-medium">{option.name}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
                <div className="text-right">
                  {option.price === 0 ? (
                    <span className="font-medium text-green-600">FREE</span>
                  ) : (
                    <span className="font-medium">₹{option.price}</span>
                  )}
                </div>
              </Label>
              {selectedShipping === option.id && (
                <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-teal-500" />
              )}
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="p-6 bg-gray-50 flex flex-col sm:flex-row justify-between items-center">
        <Button variant="outline" onClick={onPrevious} className="mb-4 sm:mb-0" disabled={isProcessing}>
          Back to Order Review
        </Button>

        <Button
          onClick={handleContinueToPayment}
          className="bg-teal-500 hover:bg-teal-600 text-white px-8"
          disabled={!selectedAddress || isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </>
          ) : (
            "Continue to Payment"
          )}
        </Button>
      </div>
    </div>
  )
}

// Also export as default for backward compatibility
export default ShippingAddress
