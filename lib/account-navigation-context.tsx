"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

type AccountNavigationContextType = {
  isNavigating: boolean
  navigateTo: (path: string) => void
}

const AccountNavigationContext = createContext<AccountNavigationContextType | undefined>(undefined)

export function AccountNavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const navigateTo = useCallback(
    (path: string) => {
      if (pathname === path) return

      setIsNavigating(true)

      // Use setTimeout to simulate a loading state
      // This gives the UI time to show a loading indicator
      setTimeout(() => {
        router.push(path)

        // Reset the navigating state after a short delay
        // This allows the animation to complete
        setTimeout(() => {
          setIsNavigating(false)
        }, 300)
      }, 100)
    },
    [router, pathname],
  )

  return (
    <AccountNavigationContext.Provider value={{ isNavigating, navigateTo }}>
      {children}
    </AccountNavigationContext.Provider>
  )
}

export function useAccountNavigation() {
  const context = useContext(AccountNavigationContext)
  if (context === undefined) {
    throw new Error("useAccountNavigation must be used within an AccountNavigationProvider")
  }
  return context
}
