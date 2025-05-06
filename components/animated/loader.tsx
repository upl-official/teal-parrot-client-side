"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LoaderProps {
  size?: "small" | "medium" | "large"
  color?: "primary" | "white"
  className?: string
}

export function Loader({ size = "medium", color = "primary", className }: LoaderProps) {
  // Define sizes
  const sizes = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  }

  // Define colors
  const colors = {
    primary: "border-teal-500",
    white: "border-white",
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <motion.div
        className={cn("rounded-full border-t-2 border-b-2", sizes[size], colors[color])}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  )
}
