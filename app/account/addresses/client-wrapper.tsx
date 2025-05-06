"use client"

import dynamic from "next/dynamic"

// Use dynamic import with SSR disabled to avoid any server-side rendering issues
const AddressesClient = dynamic(() => import("./client"), { ssr: false })

export default function AddressesClientWrapper() {
  return <AddressesClient />
}
