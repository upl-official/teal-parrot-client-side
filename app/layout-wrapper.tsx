"use client"

import type React from "react"
import { useEffect, Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/animated/page-transition"
import { usePathname } from "next/navigation"
import { useTransition } from "@/lib/transition-context"

interface LayoutWrapperProps {
  children: React.ReactNode
}

// Create a client-side only header component with pathname
function ClientHeader() {
  const pathname = usePathname()

  // Check if the current route is for authentication pages
  const isAuthPage = pathname === "/login" || pathname === "/signup"

  if (isAuthPage) {
    return null
  }

  return <Header />
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
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
  }, [isFirstMount])

  // Check if the current route is for authentication pages using client component
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/signup"

  // Don't include header/footer on auth pages
  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <>
      <Suspense fallback={<div className="h-[85px] md:h-[125px] bg-teal-500"></div>}>
        <ClientHeader />
      </Suspense>
      <main>
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading...</div>}>
          <PageTransition>{children}</PageTransition>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
