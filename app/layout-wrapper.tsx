"use client"

import type React from "react"
import { useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/animated/page-transition"
import { usePathname } from "next/navigation"
import { useTransition } from "@/lib/transition-context"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const { isFirstMount } = useTransition()

  // Reset scroll position on route change
  useEffect(() => {
    if (!isFirstMount && typeof window !== "undefined") {
      // Reset scroll immediately at the start of navigation
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      })
    }
  }, [pathname, isFirstMount])

  // Check if the current route is for authentication pages
  const isAuthPage = pathname === "/login" || pathname === "/signup"

  // Don't include header/footer on auth pages
  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  )
}
