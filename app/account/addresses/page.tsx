import { Suspense } from "react"
import { AddressesContent } from "@/components/account/addresses-content"

export default function AddressesPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading addresses...</div>}>
      <AddressesContent />
    </Suspense>
  )
}
