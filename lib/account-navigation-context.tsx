"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

type AccountNavigationContextType = {
  navigateTo: (path: string) => void
  isNavigating: boolean
  activeSection: string
  isInitialLoad: boolean
}

const AccountNavigationContext = createContext<AccountNavigationContextType | undefined>(undefined)

export function AccountNavigationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isNavigating, setIsNavigating] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const previousPath = useRef<string | null>(null)
  const navigationTimer = useRef<NodeJS.Timeout | null>(null)

  // Extract the active section from the pathname
  const activeSection = pathname.split("/").pop() || "dashboard"

  useEffect(() => {
    // After initial render, set isInitialLoad to false
    const timer = setTimeout(() => {
      setIsInitialLoad(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Reset navigation state after pathname changes
  useEffect(() => {
    if (previousPath.current && previousPath.current !== pathname) {
      // Small delay to ensure content is loaded
      navigationTimer.current = setTimeout(() => {
        setIsNavigating(false)
      }, 300)
    }
    previousPath.current = pathname

    return () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current)
      }
    }
  }, [pathname])

  const navigateTo = useCallback(
    (path: string) => {
      if (pathname !== path) {
        setIsNavigating(true)

        // Small delay before navigation to ensure UI state updates
        setTimeout(() => {
          router.push(path)
        }, 50)
      }
    },
    [router, pathname],
  )

  return (
    <AccountNavigationContext.Provider value={{ navigateTo, isNavigating, activeSection, isInitialLoad }}>
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
