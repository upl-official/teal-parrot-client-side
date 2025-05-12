"use client"

import type React from "react"
import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useTransition } from "@/lib/transition-context"

interface PageLayoutProps {
  children: React.ReactNode
}

// Create a client-side only component for pathname
function PageContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isFirstMount } = useTransition()

  // Page transition variants
  const variants = {
    hidden: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <motion.main
      key={pathname}
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{
        type: "tween",
        ease: "easeInOut",
        duration: 0.4,
        // Skip exit animation on first mount to prevent double animation
        when: isFirstMount ? "afterChildren" : "beforeChildren",
      }}
      className="flex-grow"
    >
      {children}
    </motion.main>
  )
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div className="h-[85px] md:h-[125px] bg-teal-500"></div>}>
        <Header />
      </Suspense>
      <Suspense fallback={<div className="flex-grow flex items-center justify-center">Loading...</div>}>
        <PageContent>{children}</PageContent>
      </Suspense>
      <Footer />
    </div>
  )
}
