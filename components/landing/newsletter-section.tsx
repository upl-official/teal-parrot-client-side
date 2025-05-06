"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2 } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your newsletter service
    setIsSubmitted(true)
    setEmail("")
  }

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Connected</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive offers, new arrivals, and insider tips on styling your silver
              jewelry.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-50 p-8 rounded-lg shadow-sm"
          >
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="bg-green-100 rounded-full p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Thank You for Subscribing!</h3>
                <p className="text-gray-600 text-center">
                  You've been added to our newsletter list. Get ready for exclusive offers and updates.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-grow py-6 px-4 text-base"
                />
                <Button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-base md:whitespace-nowrap"
                >
                  Subscribe Now
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
