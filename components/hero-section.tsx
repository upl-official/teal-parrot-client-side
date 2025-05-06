"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] },
    },
  }

  return (
    <section
      className="w-full h-[90vh] bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%), url('/elegant-silver-display.png')",
      }}
    >
      <motion.div
        className="absolute inset-0 bg-black opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
      />
      <div className="container mx-auto h-full px-4">
        <motion.div
          className="flex h-full items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="w-full md:w-1/2 text-white">
            <motion.h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" variants={itemVariants}>
              Exquisite Silver Jewelry
            </motion.h2>
            <motion.p className="text-lg mb-6" variants={itemVariants}>
              Discover our handcrafted collection of sterling silver pieces that combine elegance with everyday
              wearability.
            </motion.p>
            <motion.div className="flex flex-wrap gap-4" variants={itemVariants}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link href="/collection" className="primary-button">
                  Browse Collection
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link href="/new-arrivals" className="secondary-button">
                  New Arrivals
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
