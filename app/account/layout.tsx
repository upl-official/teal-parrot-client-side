"use client"

import type React from "react"

import { useState, useEffect, Suspense, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AccountSidebar } from "@/components/account/account-sidebar"
import { AccountHeader } from "@/components/account/account-header"
import { cn } from "@/lib/utils"
import { AuthGuard } from "@/lib/auth-utils"
import { AccountNavigationProvider } from "@/lib/account-navigation-context"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // This effect runs when the pathname changes
    // We can use it to update any state or trigger animations

    // Close sidebar when route changes (mobile)
    setIsSidebarOpen(false)

    // Scroll to top of content area
    const contentArea = document.getElementById("account-content-area")
    if (contentArea) {
      contentArea.scrollTo(0, 0)
    }
  }, [pathname])

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <AuthGuard>
          <AccountNavigationProvider>
            <div className="container mx-auto px-4 py-6">
              <AccountHeader onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

              <div className="mt-6 flex flex-col md:flex-row gap-6">
                {/* Sidebar - Desktop */}
                <div className="hidden md:block w-full md:w-1/4 lg:w-1/5">
                  <div className="sticky top-24">
                    <AccountSidebar />
                  </div>
                </div>

                {/* Sidebar - Mobile */}
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.div
                      className="fixed inset-0 bg-black/50 z-40 md:hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-white dark:bg-gray-800 p-4"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <AccountSidebar />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main Content */}
                <motion.div
                  id="account-content-area"
                  className={cn("w-full md:w-3/4 lg:w-4/5", "transition-all duration-300 ease-in-out")}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={pathname}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      {isPending && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center z-10">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                        </div>
                      )}
                      <Suspense
                        fallback={
                          <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                          </div>
                        }
                      >
                        {children}
                      </Suspense>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </AccountNavigationProvider>
        </AuthGuard>
      </main>

      <Footer />
    </div>
  )
}
