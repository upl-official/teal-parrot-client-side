import { Suspense } from "react"
import { AddressesPage } from "@/components/account/addresses-page"

export default function AddressesRoute() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading addresses...</div>}>
      <AddressesPage />
    </Suspense>
  )
}
