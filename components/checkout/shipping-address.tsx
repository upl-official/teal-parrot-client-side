"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { PlusCircle, CheckCircle, Clock, Truck, Zap } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddressForm } from "@/components/account/address-form"
import type { Address } from "@/lib/types"

interface ShippingAddressProps {
  addresses: Address[]
  selectedAddress: string | null
  setSelectedAddress: (addressId: string) => void
  selectedShipping: string
  setSelectedShipping: (method: string) => void
  onNext: () => void
  onPrevious: () => void
}

export function ShippingAddress({
  addresses,
  selectedAddress,
  setSelectedAddress,
  selectedShipping,
  setSelectedShipping,
  onNext,
  onPrevious,
}: ShippingAddressProps) {
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAddressAdded = (newAddress: Address) => {
    setSelectedAddress(newAddress._id)
    setIsAddingAddress(false)
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
      description: "7-10 business days",
      price: 0,
      icon: Truck,
    },
    {
      id: "standard",
      name: "Standard Shipping",
      description: "3-5 business days",
      price: 50,
      icon: Clock,
    },
    {
      id: "express",
      name: "Express Shipping",
      description: "1-2 business days",
      price: 150,
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

        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You don't have any saved addresses</p>
            <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
              <DialogTrigger asChild>
                <Button className="bg-teal-500 hover:bg-teal-600">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>
                <AddressForm onAddressAdded={handleAddressAdded} />
              </DialogContent>
            </Dialog>
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

            <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>
                <AddressForm onAddressAdded={handleAddressAdded} />
              </DialogContent>
            </Dialog>
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
