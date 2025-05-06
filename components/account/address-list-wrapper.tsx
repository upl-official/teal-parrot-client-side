"use client"

import { useSearchParams } from "next/navigation"
import { AddressList } from "./address-list"

interface AddressListWrapperProps {
  refreshTrigger: number
  onAddressDeleted: () => void
  onAddressUpdated: () => void
}

export function AddressListWrapper(props: AddressListWrapperProps) {
  // This component's sole purpose is to handle the useSearchParams hook
  // and pass the data down to the actual AddressList component
  const searchParams = useSearchParams()

  return <AddressList {...props} editId={searchParams.get("edit")} />
}
