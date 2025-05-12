"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useTransition } from "@/lib/transition-context"
import type { ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const { isFirstMount } = useTransition()

  // Page transition variants
  const variants = {
    hidden: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <motion.div
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
    >
      {children}
    </motion.div>
  )
}
