"use client"

import { useEffect } from "react"
import { detectHorizontalOverflow } from "@/lib/layout-utils"

export function OverflowDetector() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV === "development") {
      // Initial check
      detectHorizontalOverflow()

      // Check on window resize
      const handleResize = () => {
        detectHorizontalOverflow()
      }

      window.addEventListener("resize", handleResize)

      // Check after content has likely loaded
      const timeoutId = setTimeout(() => {
        detectHorizontalOverflow()
      }, 1000)

      return () => {
        window.removeEventListener("resize", handleResize)
        clearTimeout(timeoutId)
      }
    }
  }, [])

  // This component doesn't render anything
  return null
}
