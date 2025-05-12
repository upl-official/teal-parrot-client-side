"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { fadeIn } from "@/lib/animation-config"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

interface AnimatedContainerProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  variants?: any
  animation?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale"
  animationKey?: string // Changed from 'key' to 'animationKey'
}

export function AnimatedContainer({
  children,
  className,
  delay = 0,
  duration = 0.3,
  variants = fadeIn,
  animation = "fade",
  animationKey, // Changed from 'key' to 'animationKey'
}: AnimatedContainerProps) {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  // Define different animation variants
  const animations = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration, delay } },
    },
    "slide-up": {
      hidden: { y: 30, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { duration, delay } },
    },
    "slide-down": {
      hidden: { y: -30, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { duration, delay } },
    },
    "slide-left": {
      hidden: { x: -30, opacity: 0 },
      visible: { x: 0, opacity: 1, transition: { duration, delay } },
    },
    "slide-right": {
      hidden: { x: 30, opacity: 0 },
      visible: { x: 0, opacity: 1, transition: { duration, delay } },
    },
    scale: {
      hidden: { scale: 0.9, opacity: 0 },
      visible: { scale: 1, opacity: 1, transition: { duration, delay } },
    },
  }

  const selectedVariants = animations[animation] || variants

  return (
    <motion.div
      ref={ref}
      key={animationKey} // Changed from 'key' to 'animationKey'
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={selectedVariants}
      className={cn(className)}
      // Add layout transition optimization
      layoutDependency={false}
      transition={{
        layoutDependency: false,
        layout: { duration: 0 },
      }}
    >
      {children}
    </motion.div>
  )
}
