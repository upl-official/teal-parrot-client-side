"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cardHover } from "@/lib/animation-config"
import { cn } from "@/lib/utils"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
  delay?: number
}

export function AnimatedCard({ children, className, hoverEffect = true, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={hoverEffect ? cardHover : {}}
      className={cn(className)}
    >
      <Card className="h-full">{children}</Card>
    </motion.div>
  )
}

export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
