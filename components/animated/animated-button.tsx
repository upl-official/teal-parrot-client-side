"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { buttonHover } from "@/lib/animation-config"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  hoverAnimation?: boolean
  tapAnimation?: boolean
}

export function AnimatedButton({
  children,
  className,
  hoverAnimation = true,
  tapAnimation = true,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={hoverAnimation ? buttonHover : {}}
      whileTap={tapAnimation ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      <Button className={cn(className)} {...props}>
        {children}
      </Button>
    </motion.div>
  )
}
