"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { User, ShoppingBag, MapPin, ClipboardList, Heart, LogOut, CreditCard, Bell, Shield } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useAuthStore } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { useAccountNavigation } from "@/lib/account-navigation-context"

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

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
}

export function AccountSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuthStore()
  const { navigateTo } = useAccountNavigation()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <Card className="overflow-hidden">
      <nav className="flex flex-col">
        {sidebarItems.map((item, i) => (
          <motion.div key={item.name} custom={i} initial="hidden" animate="visible" variants={listItemVariants}>
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

        <motion.div custom={sidebarItems.length} initial="hidden" animate="visible" variants={listItemVariants}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-500"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </motion.div>
      </nav>
    </Card>
  )
}
