import { PageLayout } from "@/components/page-layout"
import { Mail, Instagram, Facebook } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | Teal Parrot",
  description: "Get in touch with Teal Parrot for inquiries about our products, orders, or any other questions.",
}

export default function ContactPage() {
  return (
    <PageLayout>
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

        {/* Contact Information */}
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl">
            {/* Email Section */}
            <div className="mb-8">
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-gray-900">
                <Mail className="h-6 w-6 text-teal-600" />
                Email:
              </h2>
              <p className="text-lg text-gray-700">
                Email us at:{" "}
                <a
                  href="mailto:info@acotoman.com"
                  className="font-medium text-teal-600 transition-colors hover:text-teal-700 hover:underline"
                >
                  info@acotoman.com
                </a>
              </p>
            </div>

            {/* Social Media Section */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Social Media:</h2>
              <p className="mb-4 text-lg text-gray-700">You can also reach out via:</p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Instagram className="h-5 w-5 text-pink-600" />
                  <span className="text-lg text-gray-700">
                    Instagram:{" "}
                    <a
                      href="https://www.instagram.com/teal_parrot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-teal-600 transition-colors hover:text-teal-700 hover:underline"
                    >
                      @teal_parrot
                    </a>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <span className="text-lg text-gray-700">
                    Facebook:{" "}
                    <a
                      href="https://www.facebook.com/profile.php?id=61571249081806"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-teal-600 transition-colors hover:text-teal-700 hover:underline"
                    >
                      @teal_parrot
                    </a>
                  </span>
                </div>
              </div>
            </div>

            {/* Note Section */}
            <div className="rounded-lg bg-teal-50 p-6 border-l-4 border-teal-500">
              <p className="text-gray-700">
                <strong>Note:</strong> Emails are checked more frequently than social messages. For urgent requests, we
                recommend contacting us via email!
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
