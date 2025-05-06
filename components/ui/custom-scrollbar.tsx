import type React from "react"
import { cn } from "@/lib/utils"

type ScrollbarVariant = "default" | "thin" | "elegant" | "hidden"

interface CustomScrollbarProps {
  children: React.ReactNode
  className?: string
  variant?: ScrollbarVariant
  maxHeight?: string
}

export function CustomScrollbar({ children, className, variant = "default", maxHeight }: CustomScrollbarProps) {
  const scrollbarClasses = {
    default: "",
    thin: "custom-scrollbar-thin",
    elegant: "elegant-scrollbar",
    hidden: "hide-scrollbar",
  }

  return (
    <div
      className={cn("overflow-auto", scrollbarClasses[variant], className)}
      style={{ maxHeight: maxHeight ? maxHeight : "auto" }}
    >
      {children}
    </div>
  )
}
