"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
// import { ArrowRight } from 'lucide-react' // Removed ArrowRight import

export function GiftSuggestionSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Some moments deserve to be framed in silver
          </h2>
          <p className="text-xl text-gray-600">Gift a ring to your loved ones.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="order-2 md:order-1 flex flex-col justify-center space-y-6"
          >
            <p className="text-gray-700 leading-relaxed">
              A silver ring is more than just an accessory—it's a token of affection, a symbol of commitment, and a
              timeless keepsake that carries your sentiments for years to come.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our collection features exquisite designs ranging from minimalist bands to intricate statement pieces,
              ensuring you'll find the perfect ring to express your feelings.
            </p>
            <div>
              <Button
                asChild
                className="justify-center font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg rounded-md flex items-center gap-2 group"
              >
                <Link href="/collection?category=rings">
                  <Button className="justify-center font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg rounded-md flex items-center gap-2 group">
                    Explore Our Ring Collection
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-right h-5 w-5 transition-transform group-hover:translate-x-1"
                      >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Button>
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="order-1 md:order-2 relative h-[400px] rounded-lg overflow-hidden shadow-xl"
          >
            <Image src="https://teal-parrot.s3.eu-north-1.amazonaws.com/website-images/landing-images/teal-parrot+(2).webp" alt="Silver ring as a gift" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
