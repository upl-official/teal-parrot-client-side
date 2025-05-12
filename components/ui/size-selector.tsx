"use client"
import { cn } from "@/lib/utils"

interface SizeSelectorProps {
  sizes: string[]
  selectedSize: string
  onChange: (size: string) => void
  className?: string
}

export function SizeSelector({ sizes, selectedSize, onChange, className }: SizeSelectorProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => onChange(size)}
          className={cn(
            "min-w-[40px] h-8 px-2 text-xs font-medium rounded-md border transition-all",
            selectedSize === size
              ? "border-teal-500 bg-teal-50 text-teal-700 ring-1 ring-teal-500"
              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400",
          )}
          aria-pressed={selectedSize === size}
        >
          {size}
        </button>
      ))}
    </div>
  )
}
