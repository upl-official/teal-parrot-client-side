"use client"

import React from "react"

import { motion } from "framer-motion"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

interface AnimatedListProps {
  children: React.ReactNode
  className?: string
  itemClassName?: string
  staggerDelay?: number
}

export function AnimatedList({ children, className, itemClassName, staggerDelay = 0.1 }: AnimatedListProps) {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  // Clone children and wrap them in motion.div
  const animatedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return (
        <motion.div variants={itemVariants} className={cn(itemClassName)} custom={index}>
          {child}
        </motion.div>
      )
    }
    return child
  })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={cn(className)}
    >
      {animatedChildren}
    </motion.div>
  )
}
