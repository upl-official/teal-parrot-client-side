"use client"

import { useState, useEffect, memo } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
}

export const AnimatedImage = memo(function AnimatedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  objectFit = "cover",
}: AnimatedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Reset loaded state when src changes
  useEffect(() => {
    setIsLoaded(false)
  }, [src])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
      >
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          onLoad={() => setIsLoaded(true)}
          priority={priority}
          style={{ objectFit }}
          className="w-full h-full transition-all"
        />
      </motion.div>

      {!isLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
    </div>
  )
})
