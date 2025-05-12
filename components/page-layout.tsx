"use client"

import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useTransition } from "@/lib/transition-context"

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  const pathname = usePathname()
  const { isFirstMount } = useTransition()

  // Page transition variants
  const variants = {
    hidden: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
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
      <Footer />
    </div>
  )
}
