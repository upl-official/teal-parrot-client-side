"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Sparkles, Gem, Hourglass } from "lucide-react"

const benefits = [
  {
    icon: Sparkles,
    title: "925 Sterling Silver",
    description: "Hallmarked and premium quality.",
  },
  {
    icon: Gem,
    title: "Ethical Stones",
    description: "Moissanite and zircon sourced with care.",
  },
  {
    icon: Hourglass,
    title: "Timeless Design",
    description: "Minimal pieces made to stay in style.",
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Teal Parrot</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Thoughtfully crafted. Honestly priced. Designed to last.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
