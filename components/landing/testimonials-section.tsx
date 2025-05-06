"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Lejin",
    role: "Loyal Customer",
    image: "/serene-gaze.png",
    content:
      "The craftsmanship of Teal Parrot's jewelry is exceptional. I've received countless compliments on my silver necklace, and it's become my signature piece for both casual and formal occasions.",
    rating: 5,
  },
  {
    id: 2,
    name: "Ullas",
    role: "First-time Buyer",
    image: "/thoughtful-gaze.png",
    content:
      "I was hesitant about buying jewelry online, but Teal Parrot exceeded my expectations. The packaging was beautiful, and the earrings I purchased for my wife were even more stunning in person.",
    rating: 5,
  },
  {
    id: 3,
    name: "Anzy",
    role: "Jewelry Enthusiast",
    image: "/serene-gaze.png",
    content:
      "As someone who collects silver jewelry, I can attest to the quality and uniqueness of Teal Parrot's designs. Their pieces stand out in my collection and the customer service is impeccable.",
    rating: 5,
  },
  {
    id: 4,
    name: "Anas",
    role: "Regular Customer",
    image: "/thoughtful-indian-man.png",
    content:
      "I've been shopping with Teal Parrot for over a year now, and each piece I've purchased has been of consistent quality. The attention to detail in their designs is remarkable.",
    rating: 4,
  },
]

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it – hear from our satisfied customers about their Teal Parrot experience.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-lg p-8 shadow-lg">
                    <div className="flex items-center mb-6">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{testimonial.name}</h3>
                        <p className="text-gray-500 text-sm">{testimonial.role}</p>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-gray-700 italic">"{testimonial.content}"</blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeIndex === index ? "bg-teal-500 w-8" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10 hidden md:block"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-teal-500" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10 hidden md:block"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-teal-500" />
          </button>
        </div>
      </div>
    </section>
  )
}
