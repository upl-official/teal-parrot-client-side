"use client"

import type React from "react"
import { createContext, useContext, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

type ScrollContextType = {
  resetScroll: () => void
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined)

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Function to reset scroll position
  const resetScroll = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // Use instant to avoid any animation delay
      })
    }
  }

  // Reset scroll position on route change
  useEffect(() => {
    resetScroll()
  }, [pathname, searchParams])

  return <ScrollContext.Provider value={{ resetScroll }}>{children}</ScrollContext.Provider>
}

export function useScroll() {
  const context = useContext(ScrollContext)
  if (context === undefined) {
    throw new Error("useScroll must be used within a ScrollProvider")
  }
  return context
}
