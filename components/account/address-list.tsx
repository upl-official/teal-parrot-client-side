"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { fetchUserAddresses, deleteUserAddress } from "@/lib/api"
import { useAuthStore } from "@/lib/auth"
import type { Address } from "@/lib/types"
import { EditAddressForm } from "./edit-address-form"

interface AddressListProps {
  onAddressDeleted?: () => void
  onAddressUpdated?: () => void
  addresses?: Address[]
  refreshTrigger?: number
}

export function AddressList({
  onAddressDeleted,
  onAddressUpdated,
  addresses: propAddresses,
  refreshTrigger = 0,
}: AddressListProps) {
  const [addresses, setAddresses] = useState<Address[]>(propAddresses || [])
  const [loading, setLoading] = useState(!propAddresses)
  const [error, setError] = useState<string | null>(null)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { user } = useAuthStore()

  useEffect(() => {
    if (propAddresses) {
      setAddresses(propAddresses)
      return
    }

    if (!user) return

    const getAddresses = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchUserAddresses(user._id)
        setAddresses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load addresses")
      } finally {
        setLoading(false)
      }
    }

    getAddresses()
  }, [user, propAddresses, refreshTrigger])

  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return

    setDeletingId(addressId)

    try {
      await deleteUserAddress(addressId)
      setAddresses(addresses.filter((addr) => addr._id !== addressId))

      if (onAddressDeleted) {
        onAddressDeleted()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete address")
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (addressId: string) => {
    setEditingAddressId(addressId)
  }

  const handleAddressUpdated = (updatedAddress: Address) => {
    setAddresses(addresses.map((addr) => (addr._id === updatedAddress._id ? updatedAddress : addr)))
    setEditingAddressId(null)

    if (onAddressUpdated) {
      onAddressUpdated()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (addresses.length === 0) {
    return (
      <motion.div className="text-center py-8 text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        No addresses found. Add an address to get started.
      </motion.div>
    )
  }

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <AnimatePresence>
        {addresses.map((address, index) => (
          <motion.div
            key={address._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Card className="overflow-hidden">
              {editingAddressId === address._id ? (
                <CardContent className="p-6">
                  <EditAddressForm
                    address={address}
                    onAddressUpdated={handleAddressUpdated}
                    onCancel={() => setEditingAddressId(null)}
                  />
                </CardContent>
              ) : (
                <>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="font-medium">{address.address}</p>
                      <p className="text-sm text-gray-500">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 dark:bg-gray-800 px-6 py-3">
                    <div className="flex justify-end w-full space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(address._id)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(address._id)}
                        disabled={deletingId === address._id}
                      >
                        {deletingId === address._id ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </>
              )}
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
