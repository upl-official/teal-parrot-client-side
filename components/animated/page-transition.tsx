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

  // Skip animation on first render to prevent hydration issues
  if (isFirstMount) {
    return <>{children}</>
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onExitComplete={() => {
        // Ensure scroll is reset after exit animation completes
        if (typeof window !== "undefined") {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
          })
        }
      }}
    >
      {children}
    </motion.div>
  )
}
