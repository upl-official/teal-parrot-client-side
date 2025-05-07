"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Button, type ButtonProps } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnimatedCtaButtonProps extends ButtonProps {
  rightIcon?: boolean
  glowEffect?: boolean
  pulseEffect?: boolean
  children: React.ReactNode
}

export function AnimatedCtaButton({
  rightIcon = true,
  glowEffect = false,
  pulseEffect = false,
  className,
  children,
  variant = "cta",
  size = "xl",
  ...props
}: AnimatedCtaButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative inline-block",
        glowEffect &&
          "after:absolute after:inset-0 after:z-[-1] after:animate-pulse after:bg-teal-400/40 after:blur-xl",
        pulseEffect && "animate-pulse",
      )}
    >
      <Button
        variant={variant}
        size={size}
        className={cn("group font-semibold tracking-wide", rightIcon && "pr-12 relative", className)}
        {...props}
      >
        {children}
        {rightIcon && (
          <span className="absolute right-4 transition-transform duration-300 group-hover:translate-x-1">
            <ChevronRight className="h-5 w-5" />
          </span>
        )}
      </Button>
    </motion.div>
  )
}

export function PrimaryCta({ children, className, ...props }: Omit<AnimatedCtaButtonProps, "variant">) {
  return (
    <AnimatedCtaButton variant="cta" size="xl" className={cn("shadow-teal-200/50", className)} glowEffect {...props}>
      {children}
    </AnimatedCtaButton>
  )
}

export function SecondaryCta({ children, className, ...props }: Omit<AnimatedCtaButtonProps, "variant">) {
  return (
    <AnimatedCtaButton variant="cta-secondary" size="lg" className={cn("", className)} {...props}>
      {children}
    </AnimatedCtaButton>
  )
}

export function AccentCta({ children, className, ...props }: Omit<AnimatedCtaButtonProps, "variant">) {
  return (
    <AnimatedCtaButton variant="cta-accent" size="lg" className={cn("", className)} {...props}>
      {children}
    </AnimatedCtaButton>
  )
}

export function DarkCta({ children, className, ...props }: Omit<AnimatedCtaButtonProps, "variant">) {
  return (
    <AnimatedCtaButton variant="cta-dark" size="lg" className={cn("", className)} {...props}>
      {children}
    </AnimatedCtaButton>
  )
}
