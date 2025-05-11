"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence } from "framer-motion"

type TransitionContextType = {
  isTransitioning: boolean
  startTransition: () => void
  completeTransition: () => void
  isFirstMount: boolean
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined)

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isFirstMount, setIsFirstMount] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // Set first mount to false after initial render
    if (isFirstMount) {
      const timer = setTimeout(() => {
        setIsFirstMount(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isFirstMount])

  useEffect(() => {
    // Handle route change
    startTransition()

    // Reset scroll position immediately
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // Use instant to avoid any animation delay
      })
    }

    const timer = setTimeout(() => {
      completeTransition()
    }, 300) // Match this with your transition duration

    return () => clearTimeout(timer)
  }, [pathname])

  const startTransition = () => {
    setIsTransitioning(true)
  }

  const completeTransition = () => {
    setIsTransitioning(false)
  }

  const handleExitComplete = () => {
    // Ensure scroll is reset after exit animation completes
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      })
    }
  }

  return (
    <TransitionContext.Provider
      value={{
        isTransitioning,
        startTransition,
        completeTransition,
        isFirstMount,
      }}
    >
      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        {children}
      </AnimatePresence>
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  const context = useContext(TransitionContext)
  if (context === undefined) {
    throw new Error("useTransition must be used within a TransitionProvider")
  }
  return context
}
