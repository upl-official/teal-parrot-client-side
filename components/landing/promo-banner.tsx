"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"

export function PromoBanner() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      className="py-24 bg-cover bg-center relative"
      style={{
        backgroundImage: "url('https://teal-parrot.s3.eu-north-1.amazonaws.com/website-images/landing-images/teal-parrot+(4).webp')",
      }}
      ref={ref}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl text-white"
        >
          <span className="inline-block px-4 py-1.5 mb-4 bg-teal-500/90 text-white text-sm font-medium rounded-full backdrop-blur-sm">
            Limited Time Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">20% Off Your First Purchase</h2>
          <p className="text-white/90 text-lg mb-8">
            Join our community today and receive an exclusive discount on your first order. Discover the perfect piece
            to complement your style.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg rounded-md">
              Sign Up Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
