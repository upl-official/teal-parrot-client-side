"use client"

import type React from "react"
import { createContext, useContext, useEffect, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"

type ScrollContextType = {
  resetScroll: () => void
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined)

// Separate client component that uses navigation hooks
function ScrollWatcher({ onRouteChange }: { onRouteChange: () => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Effect to reset scroll on route change
  useEffect(() => {
    onRouteChange()
  }, [pathname, searchParams, onRouteChange])

  // This component doesn't render anything visible
  return null
}

export function ScrollProvider({ children }: { children: React.ReactNode }) {
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

  return (
    <ScrollContext.Provider value={{ resetScroll }}>
      <Suspense fallback={null}>
        <ScrollWatcher onRouteChange={resetScroll} />
      </Suspense>
      {children}
    </ScrollContext.Provider>
  )
}

export function useScroll() {
  const context = useContext(ScrollContext)
  if (context === undefined) {
    throw new Error("useScroll must be used within a ScrollProvider")
  }
  return context
}
