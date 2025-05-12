"use client"

import type { ReactNode } from "react"
import { memo } from "react"
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
  animationKey?: string
  immediate?: boolean
}

// Define animations outside component to prevent recreation on each render
const animations = {
  fade: {
    hidden: { opacity: 0 },
    visible: (props: { duration: number; delay: number }) => ({
      opacity: 1,
      transition: { duration: props.duration, delay: props.delay },
    }),
  },
  "slide-up": {
    hidden: { y: 30, opacity: 0 },
    visible: (props: { duration: number; delay: number }) => ({
      y: 0,
      opacity: 1,
      transition: { duration: props.duration, delay: props.delay },
    }),
  },
  "slide-down": {
    hidden: { y: -30, opacity: 0 },
    visible: (props: { duration: number; delay: number }) => ({
      y: 0,
      opacity: 1,
      transition: { duration: props.duration, delay: props.delay },
    }),
  },
  "slide-left": {
    hidden: { x: -30, opacity: 0 },
    visible: (props: { duration: number; delay: number }) => ({
      x: 0,
      opacity: 1,
      transition: { duration: props.duration, delay: props.delay },
    }),
  },
  "slide-right": {
    hidden: { x: 30, opacity: 0 },
    visible: (props: { duration: number; delay: number }) => ({
      x: 0,
      opacity: 1,
      transition: { duration: props.duration, delay: props.delay },
    }),
  },
  scale: {
    hidden: { scale: 0.9, opacity: 0 },
    visible: (props: { duration: number; delay: number }) => ({
      scale: 1,
      opacity: 1,
      transition: { duration: props.duration, delay: props.delay },
    }),
  },
}

function AnimatedContainerComponent({
  children,
  className,
  delay = 0,
  duration = 0.3,
  variants = fadeIn,
  animation = "fade",
  animationKey,
  immediate = false,
}: AnimatedContainerProps) {
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true })

  const selectedVariants = animations[animation] || variants

  // If immediate is true, render content without waiting for animation to complete
  // This helps prevent content flash in certain scenarios
  if (immediate) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      key={animationKey}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={selectedVariants}
      custom={{ duration, delay }}
      className={cn(className)}
      // Optimize layout transitions
      layoutDependency={false}
      layout="position"
      transition={{
        layoutDependency: false,
        layout: { duration: 0 },
      }}
    >
      {children}
    </motion.div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const AnimatedContainer = memo(AnimatedContainerComponent)
