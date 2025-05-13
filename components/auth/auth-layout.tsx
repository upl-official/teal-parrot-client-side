"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { TRANSITION_NORMAL, fadeIn, slideInFromLeft, slideInFromRight } from "@/lib/animation-config"
import { Button } from "@/components/ui/button"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  isLoginPage?: boolean
}

export function AuthLayout({ children, title, subtitle, isLoginPage = false }: AuthLayoutProps) {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Decorative */}
      <motion.div
        className="hidden justify-center md:flex md:w-1/2 bg-gradient-to-br from-teal-500 to-teal-700 relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={slideInFromLeft}
      >
        <div className="absolute inset-0 bg-black/10 z-10"></div>

        {/* Decorative circles */}
        <motion.div
          className="absolute top-[20%] left-[15%] w-64 h-64 rounded-full bg-teal-400/20 z-0"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[10%] w-48 h-48 rounded-full bg-teal-300/20 z-0"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />

        {/* Content */}
        <div className="relative z-20 flex flex-col justify-center items-center h-full px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, ...TRANSITION_NORMAL }}
            className="mb-8"
          >
            <Image src="/logos/teal-parrot-logo-white.svg" alt="Teal Parrot" width={180} height={60} className="mb-6" />
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, ...TRANSITION_NORMAL }}
          >
            {isLoginPage ? "Welcome Back" : "Join Our Community"}
          </motion.h2>

          <motion.p
            className="text-lg text-center max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, ...TRANSITION_NORMAL }}
          >
            {isLoginPage
              ? "Discover our exclusive collection of handcrafted silver jewelry."
              : "Create an account to access exclusive offers and track your orders."}
          </motion.p>

          <motion.div
            className="mt-12 relative w-full max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-300 to-white/50 rounded-lg blur opacity-30"></div>
            <div className="relative bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20">
              <p className="text-center text-white/90 italic">
                {isLoginPage
                  ? '"Elegance is the only beauty that never fades."'
                  : '"Every piece tells a story of craftsmanship and heritage."'}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Form */}
      <motion.div
        className={cn("relative flex-1 flex flex-col justify-center items-center p-6 md:p-12", "bg-white dark:bg-gray-900")}
        initial="hidden"
        animate="visible"
        variants={slideInFromRight}
      >
        {/* Back button */}
        <motion.div
          className="absolute top-4 left-4 z-10"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, ...TRANSITION_NORMAL }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full w-10 h-10 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </Button>
        </motion.div>

        <div className="w-full max-w-md">
          <motion.div className="md:hidden mb-8 flex justify-center" variants={fadeIn}>
            <Image
              src="/logos/teal-parrot-logo-black.svg"
              alt="Teal Parrot"
              width={150}
              height={50}
              className="dark:hidden"
            />
            <Image
              src="/logos/teal-parrot-logo-white.svg"
              alt="Teal Parrot"
              width={150}
              height={50}
              className="hidden dark:block"
            />
          </motion.div>

          <motion.div
            className="space-y-2 mb-8"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { delay: 0.3, ...TRANSITION_NORMAL },
              },
            }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
            <p className="text-gray-500 dark:text-gray-400">{subtitle}</p>
          </motion.div>

          {children}
        </div>
      </motion.div>
    </div>
  )
}
