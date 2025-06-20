"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { updateUserAddress } from "@/lib/api"
import type { Address } from "@/lib/types"

const addressSchema = z.object({
  address: z.string().min(5, "Please enter a valid address"),
  city: z.string().min(2, "Please enter a valid City name"),
  state: z.string().min(2, "Please enter a valid State"),
  pincode: z.string().min(6, "Please enter a valid pincode"),
})

type AddressFormValues = z.infer<typeof addressSchema>

interface EditAddressFormProps {
  address: Address
  onAddressUpdated?: (address: Address) => void
  onCancel?: () => void
}

export function EditAddressForm({ address, onAddressUpdated, onCancel }: EditAddressFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode ? String(address.pincode) : "",
    },
  })

  async function onSubmit(data: AddressFormValues) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Convert pincode to number if it's a string
      const formattedData = {
        ...data,
        pincode: typeof data.pincode === "string" ? Number.parseInt(data.pincode, 10) : data.pincode,
      }

      const updatedAddress = await updateUserAddress(address._id, formattedData)
      setSuccess("Address updated successfully")

      if (onAddressUpdated) {
        onAddressUpdated(updatedAddress)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update address. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="House No., Apartment No." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pincode</FormLabel>
                <FormControl>
                  <Input placeholder="Pincode" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex space-x-2">
            <Button type="submit" className="bg-teal-500 hover:bg-teal-600 transition-all" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Address"
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="transition-all">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
