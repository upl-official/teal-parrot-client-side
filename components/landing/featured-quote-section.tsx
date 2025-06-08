"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function FeaturedQuoteSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden"
          >
            <Image
              src="https://teal-parrot.s3.eu-north-1.amazonaws.com/website-images/landing-images-2/teal-parrot+(2).webp"
              alt="Silver jewelry reflecting light like starlight"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col justify-center space-y-6"
          >
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-serif italic text-gray-800 leading-relaxed">
              "All the Sparkle. None of the Compromise."
            </blockquote>
            <div className="w-16 h-1 bg-teal-500"></div>
            <p className="text-gray-600">
              Brilliant like a diamond, but more sustainable and just as stunning — moissanite stones offer fire, clarity, and timeless beauty without the luxury markup.
            </p>
            <ul className="list-inside list-disc">
              <li>Ethically Sourced</li>
              <li>Higher brilliance than diamonds</li>
              <li>Exceptional durability</li>
              <li>Great value for everyday elegance</li>
            </ul>
            <div>
              <Button
                asChild
                className="justify-center font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg rounded-md flex items-center gap-2 group"
              >
                <Link href="/collection">
                  <Button className="justify-center font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg rounded-md flex items-center gap-2 group">
                     Discover the Magic of Moissanite
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
        </div>
      </div>
    </section>
  )
}
