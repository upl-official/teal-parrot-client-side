"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAccountNavigation } from "@/lib/account-navigation-context"

interface AccountTransitionLayoutProps {
  children: React.ReactNode
}

export function AccountTransitionLayout({ children }: AccountTransitionLayoutProps) {
  const pathname = usePathname()
  const { isNavigating } = useAccountNavigation()
  const [prevChildren, setPrevChildren] = useState(children)
  const [currentPathname, setCurrentPathname] = useState(pathname)
  const contentRef = useRef<HTMLDivElement>(null)

  // Keep track of content height for smooth transitions
  const [contentHeight, setContentHeight] = useState<number | "auto">("auto")

  // Store the previous children when pathname changes, for transition
  useEffect(() => {
    if (pathname !== currentPathname) {
      setPrevChildren(children)
      setCurrentPathname(pathname)
    }
  }, [pathname, children, currentPathname])

  // Measure the content height for smooth transitions
  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.offsetHeight
      setContentHeight(height)
    }
  }, [children])

  // Variants for the container
  const containerVariants = {
    initial: { height: contentHeight },
    animate: {
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      height: contentHeight,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  }

  // Variants for the content
  const contentVariants = {
    initial: { opacity: 0, x: 10 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -10,
      position: "absolute",
      inset: 0,
      transition: { duration: 0.25, ease: "easeIn" },
    },
  }

  return (
    <motion.div
      className="relative min-h-[200px]"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Overlay loader for navigation */}
      {isNavigating && (
        <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 flex items-center justify-center z-10">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        </div>
      )}

      {/* Content with transitions */}
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={pathname}
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          ref={contentRef}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
