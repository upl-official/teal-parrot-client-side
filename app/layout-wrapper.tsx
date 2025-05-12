"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { ScrollToTop } from "@/components/scroll-to-top"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      {children}
      <ScrollToTop />
    </>
  )
}
