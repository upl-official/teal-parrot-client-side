"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EditAddressForm } from "@/components/account/edit-address-form"
import { useAuthStore } from "@/lib/auth"
import type { Address } from "@/lib/types"

interface AddressListProps {
  refreshTrigger: number
  onAddressDeleted: () => void
  onAddressUpdated: () => void
  editId: string | null
}

export function AddressList({ refreshTrigger, onAddressDeleted, onAddressUpdated, editId }: AddressListProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true)
      // In a real app, fetch from API
      // For demo, we'll use mock data
      const mockAddresses: Address[] = [
        {
          id: "1",
          name: "Home",
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
          isDefault: true,
        },
        {
          id: "2",
          name: "Work",
          street: "456 Market St",
          city: "San Francisco",
          state: "CA",
          zipCode: "94103",
          country: "USA",
          isDefault: false,
        },
      ]

      setAddresses(mockAddresses)
      setLoading(false)

      // Check if we should edit an address based on URL param
      if (editId) {
        const addressToEdit = mockAddresses.find((a) => a.id === editId)
        if (addressToEdit) {
          setEditingAddress(addressToEdit)
        }
      }
    }

    fetchAddresses()
  }, [refreshTrigger, editId])

  const handleDelete = async (addressId: string) => {
    // In a real app, delete via API
    setAddresses(addresses.filter((address) => address.id !== addressId))
    onAddressDeleted()
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
  }

  const handleCancelEdit = () => {
    setEditingAddress(null)
  }

  if (loading) {
    return <div>Loading addresses...</div>
  }

  if (editingAddress) {
    return (
      <EditAddressForm
        address={editingAddress}
        onCancel={handleCancelEdit}
        onAddressUpdated={() => {
          setEditingAddress(null)
          onAddressUpdated()
        }}
      />
    )
  }

  if (addresses.length === 0) {
    return <div>No addresses found. Add your first address.</div>
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <Card key={address.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium flex items-center">
                {address.name}
                {address.isDefault && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {address.street}
                <br />
                {address.city}, {address.state} {address.zipCode}
                <br />
                {address.country}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(address)}>
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDelete(address.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
