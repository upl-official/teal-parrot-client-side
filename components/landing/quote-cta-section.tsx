"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function QuoteCtaSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col justify-center space-y-6"
          >
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-serif italic text-white leading-relaxed">
              "Silver carries the luster of the moon—mystical, pure, and forever enchanting."
            </blockquote>
            <div className="w-16 h-1 bg-teal-400"></div>
            <p className="text-gray-300">
              Experience the enchantment of our silver collection, where each piece captures the mystical essence of
              moonlight.
            </p>
            <div>
              <Button
                asChild
                className="justify-center font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg rounded-md flex items-center gap-2 group"
              >
                <Link href="/collection?sort=newest">
                  <Button className="justify-center font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg rounded-md flex items-center gap-2 group">
                    Discover Moonlight Collection
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden"
          >
            <Image
              src="/silver-moonlight-reflection.jpg"
              alt="Silver jewelry reflecting moonlight"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
