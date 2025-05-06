"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Award, Truck, RefreshCw, Shield } from "lucide-react"

const benefits = [
  {
    icon: Award,
    title: "Premium Quality",
    description: "Each piece is crafted with the finest 925 sterling silver, ensuring lasting beauty and value.",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Enjoy complimentary shipping on all orders over ₹1999 across India.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "Not completely satisfied? Return within 30 days for a full refund or exchange.",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Shop with confidence using our secure and encrypted payment methods.",
  },
]

export function BenefitsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Teal Parrot</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to providing exceptional quality, service, and value with every purchase.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-50 text-teal-500 mb-4 mx-auto">
                <benefit.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
