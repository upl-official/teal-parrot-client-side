"use client"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface SizeSelectorProps {
  sizes: string[]
  selectedSize: string
  onChange: (size: string) => void
  className?: string
  compact?: boolean
}

export function SizeSelector({ sizes, selectedSize, onChange, className, compact = false }: SizeSelectorProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {sizes.map((size) => (
        <motion.button
          key={size}
          type="button"
          onClick={() => onChange(size)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "relative min-w-[40px] h-8 px-2 text-xs font-medium rounded-md border transition-all",
            selectedSize === size
              ? "border-teal-500 bg-teal-50 text-teal-700"
              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400",
            compact && "min-w-[32px] h-7 px-1",
          )}
          aria-pressed={selectedSize === size}
        >
          {selectedSize === size && (
            <motion.span
              layoutId="selectedSizeIndicator"
              className="absolute inset-0 bg-teal-50 rounded-md -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
          {size}
        </motion.button>
      ))}
    </div>
  )
}
