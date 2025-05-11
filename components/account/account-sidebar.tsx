"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { User, ShoppingBag, MapPin, ClipboardList, Heart, LogOut, CreditCard, Bell, Shield } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useAuthStore } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { useAccountNavigation } from "@/lib/account-navigation-context"
import { useMemo } from "react"

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/account",
    icon: ShoppingBag,
    exact: true,
  },
  {
    name: "Profile",
    href: "/account/profile",
    icon: User,
  },
  {
    name: "Addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    name: "Orders",
    href: "/account/orders",
    icon: ClipboardList,
  },
  {
    name: "Wishlist",
    href: "/wishlist",
    icon: Heart,
  },
  {
    name: "Payment Methods",
    href: "/account/payment",
    icon: CreditCard,
  },
  {
    name: "Notifications",
    href: "/account/notifications",
    icon: Bell,
  },
  {
    name: "Security",
    href: "/account/security",
    icon: Shield,
  },
]

export function AccountSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuthStore()
  const { navigateTo, isInitialLoad } = useAccountNavigation()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Memoize the isActive function to prevent unnecessary calculations
  const isActive = useMemo(() => {
    return (href: string, exact = false) => {
      if (exact) {
        return pathname === href
      }
      return pathname.startsWith(href)
    }
  }, [pathname])

  // Staggered animation for sidebar items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
        when: "beforeChildren",
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  }

  return (
    <Card className="overflow-hidden">
      <motion.nav
        className="flex flex-col"
        initial={isInitialLoad ? "hidden" : "visible"}
        animate="visible"
        variants={containerVariants}
      >
        {sidebarItems.map((item, i) => (
          <motion.div key={item.name} variants={itemVariants} layout>
            <a
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                isActive(item.href, item.exact) ? "bg-gray-100 dark:bg-gray-800 border-l-4 border-teal-500" : "",
              )}
              onClick={(e) => {
                e.preventDefault()
                navigateTo(item.href)
              }}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive(item.href, item.exact) ? "text-teal-500" : "text-gray-500 dark:text-gray-400",
                )}
              />
              <span
                className={cn(
                  isActive(item.href, item.exact)
                    ? "font-medium text-gray-900 dark:text-white"
                    : "text-gray-700 dark:text-gray-300",
                )}
              >
                {item.name}
              </span>
            </a>
          </motion.div>
        ))}

        <motion.div variants={itemVariants} layout>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-500"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </motion.div>
      </motion.nav>
    </Card>
  )
}
