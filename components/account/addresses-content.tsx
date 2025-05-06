"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddressForm } from "@/components/account/address-form"
import { AddressList } from "@/components/account/address-list"
import { AnimatedContainer } from "@/components/animated/animated-container"
import { useAuthStore } from "@/lib/auth"
import type { Address } from "@/lib/types"

export function AddressesContent() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { user } = useAuthStore()

  const handleAddressAdded = async (address: Address) => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleAddressDeleted = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleAddressUpdated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <AnimatedContainer animation="fade" key="addresses-page">
      <h1 className="text-2xl font-bold mb-6">My Addresses</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Address</CardTitle>
          </CardHeader>
          <CardContent>
            <AddressForm onAddressAdded={handleAddressAdded} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            <AddressList
              refreshTrigger={refreshTrigger}
              onAddressDeleted={handleAddressDeleted}
              onAddressUpdated={handleAddressUpdated}
            />
          </CardContent>
        </Card>
      </div>
    </AnimatedContainer>
  )
}
