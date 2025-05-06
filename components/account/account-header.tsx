"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface AccountHeaderProps {
  onMenuToggle: () => void
}

export function AccountHeader({ onMenuToggle }: AccountHeaderProps) {
  const { user } = useAuthStore()
  const [greeting, setGreeting] = useState("Good day")

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  return (
    <div className="flex items-center justify-between">
      <div>
        <motion.h1
          className="text-2xl font-bold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {greeting}, {user?.name?.split(" ")[0] || "there"}!
        </motion.h1>
        <motion.p
          className="text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Welcome to your account dashboard
        </motion.p>
      </div>

      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuToggle} aria-label="Toggle menu">
        <Menu className="h-6 w-6" />
      </Button>
    </div>
  )
}
