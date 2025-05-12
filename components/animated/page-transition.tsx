"use client"

import type React from "react"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { useTransition } from "@/lib/transition-context"

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const { isFirstMount } = useTransition()

  // Reset scroll position at the beginning of the transition
  useEffect(() => {
    if (!isFirstMount && typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // Use instant to avoid any animation delay
      })
    }
  }, [pathname, isFirstMount])

  // Add effect to reset scroll after animation completes
  useEffect(() => {
    // This will run after the animation completes
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant",
        })
      }
    }, 300) // Match with animation duration

    return () => clearTimeout(timer)
  }, [pathname])

  // Skip animation on first render to prevent hydration issues
  if (isFirstMount) {
    return <>{children}</>
  }

  // Each child needs a unique key for AnimatePresence to work properly
  return (
    <motion.div
      key={pathname || "page"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
