import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact/contact-form"
import { Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | Teal Parrot",
  description: "Get in touch with Teal Parrot for inquiries about our products, orders, or any other questions.",
}

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-teal-600 to-teal-500 py-20 text-white">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
            <div className="absolute bottom-10 left-10 h-20 w-20 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-10 right-1/4 h-32 w-32 rounded-full bg-white/5"></div>
          </div>
          <div className="container relative mx-auto px-4 text-center">
            <span className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur-sm">
              We'd Love To Hear From You
            </span>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Get In Touch</h1>
            <p className="mx-auto max-w-2xl text-lg text-white/90">
              Have questions about our products, your order, or anything else? Our team is here to help and ready to
              assist you with any inquiries.
            </p>
          </div>
        </div>

        {/* Contact Information Cards */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-teal-50 transition-transform group-hover:scale-110"></div>
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Email Us</h3>
                <p className="mb-4 text-gray-600">For general inquiries and support</p>
                <a
                  href="mailto:hello@tealparrot.com"
                  className="block items-center text-teal-500 transition-colors hover:text-teal-700"
                >
                  hello@tealparrot.com
                </a>
                <a
                  href="mailto:support@tealparrot.com"
                  className="mt-1 block items-center text-teal-500 transition-colors hover:text-teal-700"
                >
                  support@tealparrot.com
                </a>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-teal-50 transition-transform group-hover:scale-110"></div>
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Call Us</h3>
                <p className="mb-4 text-gray-600">Mon-Fri from 9am to 6pm</p>
                <a
                  href="tel:+919999999999"
                  className="block items-center text-teal-500 transition-colors hover:text-teal-700"
                >
                  +91 99999 99999
                </a>
                <a
                  href="tel:04719999999"
                  className="mt-1 block items-center text-teal-500 transition-colors hover:text-teal-700"
                >
                  0471 999 9999
                </a>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg md:col-span-2 lg:col-span-1">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-teal-50 transition-transform group-hover:scale-110"></div>
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Visit Us</h3>
                <p className="mb-4 text-gray-600">Our flagship store</p>
                <address className="not-italic text-gray-700">
                  Acotoman India Pvt. Ltd.
                  <br />
                  Sasthamangalam, Thiruvananthapuram,
                  <br />
                  Kerala, IND, 695010
                </address>
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Open 10:00 AM - 8:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="rounded-xl bg-white p-6 shadow-md md:p-8">
                <div className="mb-8">
                  <h2 className="mb-2 text-2xl font-bold">Send Us a Message</h2>
                  <p className="text-gray-600">
                    Fill out the form below and our team will get back to you as soon as possible.
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-2xl font-bold">Find Us</h2>
                <div className="h-[300px] overflow-hidden rounded-lg bg-gray-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.859861826859!2d76.9698123!3d8.512984600000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05bbeda235d6b9%3A0x4537ea80c34b50b6!2sAcotoman%20India%20Private%20Limited!5e0!3m2!1sen!2sin!4v1745422849972!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Teal Parrot Store Location"
                  ></iframe>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-md">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                  <HelpCircle className="h-5 w-5 text-teal-500" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">What are your shipping times?</h4>
                    <p className="text-sm text-gray-600">
                      We typically ship within 1-2 business days, with delivery taking 3-5 days depending on your
                      location.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Do you offer international shipping?</h4>
                    <p className="text-sm text-gray-600">
                      Yes, we ship to most countries worldwide. International shipping typically takes 7-14 business
                      days.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">What is your return policy?</h4>
                    <p className="text-sm text-gray-600">
                      We offer a 30-day return policy for unused items in their original packaging.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between rounded-lg bg-teal-50 p-4">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-teal-500" />
                    <span className="text-sm font-medium">Need more help?</span>
                  </div>
                  <a
                    href="#contact-form"
                    className="rounded bg-teal-100 px-3 py-1 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-200"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
