import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import {
  ExternalLink,
  FileText,
  Book,
  HelpCircle,
  MessageCircle,
  Youtube,
  Ruler,
  PenToolIcon as Tool,
} from "lucide-react"

export default function ResourcesPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Resources</h1>

        <div className="mb-8">
          <p className="text-lg mb-6">
            Welcome to our resources page. Here you'll find helpful guides, tutorials, and information to help you make
            the most of your Teal Parrot jewelry and shopping experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product Care Guides */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-teal-500 p-4 text-white">
              <h2 className="text-xl font-semibold flex items-center">
                <Tool className="mr-2 h-5 w-5" />
                Product Care Guides
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Learn how to properly care for and maintain your silver jewelry to keep it looking beautiful for years
                to come.
              </p>
              <ul className="space-y-3">
                <li>
                  <Link href="/guides/silver-care" className="text-teal-500 hover:underline flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Silver Jewelry Care Guide
                  </Link>
                </li>
                <li>
                  <Link href="/guides/cleaning" className="text-teal-500 hover:underline flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Cleaning and Polishing Tips
                  </Link>
                </li>
                <li>
                  <Link href="/guides/storage" className="text-teal-500 hover:underline flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Proper Storage Techniques
                  </Link>
                </li>
                <li>
                  <Link href="/guides/tarnish-prevention" className="text-teal-500 hover:underline flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Preventing Tarnish
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Size Guides */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-teal-500 p-4 text-white">
              <h2 className="text-xl font-semibold flex items-center">
                <Ruler className="mr-2 h-5 w-5" />
                Size Guides
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Find the perfect fit with our comprehensive sizing guides for all types of jewelry.
              </p>
              <ul className="space-y-3">
                <li>
                  <Link href="/guides/ring-sizing" className="text-teal-500 hover:underline flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Ring Size Guide
                  </Link>
                </li>
                <li>
                  <Link href="/guides/bracelet-sizing" className="text-teal-500 hover:underline flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Bracelet Size Guide
                  </Link>
                </li>
                <li>
                  <Link href="/guides/necklace-lengths" className="text-teal-500 hover:underline flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Necklace Length Guide
                  </Link>
                </li>
                <li>
                  <Link href="/guides/nose-ring-sizing" className="text-teal-500 hover:underline flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Nose Ring Size Guide
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Educational Resources */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-teal-500 p-4 text-white">
              <h2 className="text-xl font-semibold flex items-center">
                <Book className="mr-2 h-5 w-5" />
                Educational Resources
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Expand your knowledge about silver jewelry, craftsmanship, and the stories behind our designs.
              </p>
              <ul className="space-y-3">
                <li>
                  <Link href="/education/silver-grades" className="text-teal-500 hover:underline flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Understanding Silver Grades
                  </Link>
                </li>
                <li>
                  <Link href="/education/craftsmanship" className="text-teal-500 hover:underline flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Traditional Craftsmanship
                  </Link>
                </li>
                <li>
                  <Link
                    href="/education/design-inspiration"
                    className="text-teal-500 hover:underline flex items-center"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Design Inspiration
                  </Link>
                </li>
                <li>
                  <Link href="/education/sustainability" className="text-teal-500 hover:underline flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Our Sustainability Practices
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Video Tutorials */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-teal-500 p-4 text-white">
              <h2 className="text-xl font-semibold flex items-center">
                <Youtube className="mr-2 h-5 w-5" />
                Video Tutorials
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Watch our video tutorials for visual guidance on jewelry care, styling tips, and more.
              </p>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=example1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-500 hover:underline flex items-center"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    How to Clean Silver Jewelry
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=example2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-500 hover:underline flex items-center"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Styling Silver Jewelry
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=example3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-500 hover:underline flex items-center"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    How to Measure Your Ring Size
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=example4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-500 hover:underline flex items-center"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Behind the Scenes: Our Crafting Process
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-teal-500 p-4 text-white">
              <h2 className="text-xl font-semibold flex items-center">
                <HelpCircle className="mr-2 h-5 w-5" />
                Frequently Asked Questions
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Find answers to common questions about our products, ordering, shipping, and more.
              </p>
              <ul className="space-y-3">
                <li>
                  <Link href="/faq/ordering" className="text-teal-500 hover:underline flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Ordering & Payment
                  </Link>
                </li>
                <li>
                  <Link href="/faq/shipping" className="text-teal-500 hover:underline flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link href="/faq/returns" className="text-teal-500 hover:underline flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link href="/faq/product" className="text-teal-500 hover:underline flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Product Questions
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Community & Support */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-teal-500 p-4 text-white">
              <h2 className="text-xl font-semibold flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Community & Support
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Connect with our community and get support when you need it.</p>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-teal-500 hover:underline flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Contact Customer Service
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/tealparrot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-500 hover:underline flex items-center"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Instagram Community
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/groups/tealparrot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-500 hover:underline flex items-center"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Facebook Group
                  </a>
                </li>
                <li>
                  <Link href="/blog" className="text-teal-500 hover:underline flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Our Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* External Resources */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-teal-500 mb-6">External Resources</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                These external resources provide additional information about jewelry care, silver properties, and
                industry standards.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-lg mb-3">Jewelry Care & Information</h3>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="https://www.gia.edu/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-500 hover:underline flex items-center"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Gemological Institute of America (GIA)
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.silverinstitute.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-500 hover:underline flex items-center"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        The Silver Institute
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.jewelrywise.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-500 hover:underline flex items-center"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Jewelry Wise
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-3">Industry Standards & Certifications</h3>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="https://responsiblejewellery.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-500 hover:underline flex items-center"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Responsible Jewellery Council
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.fairtrade.net/product/gold"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-500 hover:underline flex items-center"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Fairtrade Precious Metals
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.jewelersvigilance.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-500 hover:underline flex items-center"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Jewelers Vigilance Committee
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Resources */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-teal-500 mb-6">Downloadable Resources</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <p className="text-gray-600 mb-6">Download these helpful resources for offline reference.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <a
                  href="/downloads/silver-care-guide.pdf"
                  className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors flex flex-col items-center text-center"
                >
                  <FileText className="h-12 w-12 text-teal-500 mb-3" />
                  <h3 className="font-medium mb-1">Silver Care Guide</h3>
                  <p className="text-sm text-gray-500">PDF, 2.4 MB</p>
                </a>
                <a
                  href="/downloads/size-chart.pdf"
                  className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors flex flex-col items-center text-center"
                >
                  <FileText className="h-12 w-12 text-teal-500 mb-3" />
                  <h3 className="font-medium mb-1">Complete Size Chart</h3>
                  <p className="text-sm text-gray-500">PDF, 1.8 MB</p>
                </a>
                <a
                  href="/downloads/product-catalog.pdf"
                  className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors flex flex-col items-center text-center"
                >
                  <FileText className="h-12 w-12 text-teal-500 mb-3" />
                  <h3 className="font-medium mb-1">Product Catalog</h3>
                  <p className="text-sm text-gray-500">PDF, 5.6 MB</p>
                </a>
                <a
                  href="/downloads/gift-guide.pdf"
                  className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors flex flex-col items-center text-center"
                >
                  <FileText className="h-12 w-12 text-teal-500 mb-3" />
                  <h3 className="font-medium mb-1">Gift Guide</h3>
                  <p className="text-sm text-gray-500">PDF, 3.2 MB</p>
                </a>
                <a
                  href="/downloads/warranty-info.pdf"
                  className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors flex flex-col items-center text-center"
                >
                  <FileText className="h-12 w-12 text-teal-500 mb-3" />
                  <h3 className="font-medium mb-1">Warranty Information</h3>
                  <p className="text-sm text-gray-500">PDF, 1.1 MB</p>
                </a>
                <a
                  href="/downloads/care-checklist.pdf"
                  className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors flex flex-col items-center text-center"
                >
                  <FileText className="h-12 w-12 text-teal-500 mb-3" />
                  <h3 className="font-medium mb-1">Care Checklist</h3>
                  <p className="text-sm text-gray-500">PDF, 0.9 MB</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
