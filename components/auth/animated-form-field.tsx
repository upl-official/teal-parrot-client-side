"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { TRANSITION_NORMAL } from "@/lib/animation-config"

interface AnimatedFormFieldProps {
  form: any
  name: string
  label: string
  placeholder: string
  type?: string
  index: number
  required?: boolean
}

export function AnimatedFormField({
  form,
  name,
  label,
  placeholder,
  type = "text",
  index,
  required = false,
}: AnimatedFormFieldProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 + index * 0.1,
        ...TRANSITION_NORMAL,
      },
    },
  }

  const labelVariants = {
    idle: { y: 0, scale: 1 },
    focus: { y: -2, scale: 0.95 },
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={fieldVariants}>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="relative">
            <motion.div
              animate={isFocused || field.value ? "focus" : "idle"}
              variants={labelVariants}
              transition={{ duration: 0.2 }}
            >
              <FormLabel
                className={cn(
                  "transition-colors duration-200",
                  (isFocused || field.value) && "text-teal-600 dark:text-teal-400",
                )}
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
            </motion.div>

            <FormControl>
              <div className="relative">
                <Input
                  placeholder={placeholder}
                  type={isPassword ? (showPassword ? "text" : "password") : type}
                  className={cn(
                    "transition-all duration-200 border-gray-300 dark:border-gray-700",
                    "focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
                    isFocused && "border-teal-500 ring-2 ring-teal-500/20",
                  )}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  {...field}
                />

                {isPassword && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </motion.button>
                )}
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  )
}
