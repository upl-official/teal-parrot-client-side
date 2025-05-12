"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type TransitionContextType = {
  isFirstMount: boolean
  setIsFirstMount: (value: boolean) => void
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined)

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [isFirstMount, setIsFirstMount] = useState(true)

  useEffect(() => {
    // After the component mounts, set isFirstMount to false
    // This ensures the header animation only happens once
    if (isFirstMount) {
      const timer = setTimeout(() => {
        setIsFirstMount(false)
      }, 1000) // Give enough time for initial animations
      return () => clearTimeout(timer)
    }
  }, [isFirstMount])

  return <TransitionContext.Provider value={{ isFirstMount, setIsFirstMount }}>{children}</TransitionContext.Provider>
}

export function useTransition() {
  const context = useContext(TransitionContext)
  if (context === undefined) {
    throw new Error("useTransition must be used within a TransitionProvider")
  }
  return context
}
