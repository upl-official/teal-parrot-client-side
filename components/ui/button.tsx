import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // New enhanced CTA variants
        cta: "bg-teal-500 text-white shadow-lg hover:bg-teal-600 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 font-semibold",
        "cta-secondary":
          "bg-white text-teal-600 border-2 border-teal-500 shadow-md hover:bg-teal-50 hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 font-semibold",
        "cta-accent":
          "bg-accent-100 text-gray-900 shadow-md hover:bg-accent-100/90 hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 font-semibold",
        "cta-dark":
          "bg-gray-900 text-white shadow-lg hover:bg-gray-800 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 font-semibold",
        "cta-outline":
          "bg-transparent text-teal-500 border-2 border-teal-500 hover:bg-teal-50 transform transition-all duration-300 hover:-translate-y-1 font-semibold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-md px-10 text-base",
        "2xl": "h-16 rounded-md px-12 text-lg",
        icon: "h-10 w-10",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "hover:animate-bounce",
        glow: "relative after:absolute after:inset-0 after:z-[-1] after:animate-pulse after:bg-teal-400/40 after:blur-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animation, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, animation, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
