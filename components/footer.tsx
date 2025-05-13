import Link from "next/link"
import Image from "next/image"
import { Mail, Linkedin, Instagram, Facebook } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-teal-500 text-white pt-10 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Sitemap and Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Sitemap */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-4">Sitemap</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Main Pages</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="hover:text-gray-200">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/collection" className="hover:text-gray-200">
                      Collection
                    </Link>
                  </li>
                  <li>
                    <Link href="/brand" className="hover:text-gray-200">
                      Our Brand
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-gray-200">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Shopping</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/cart" className="hover:text-gray-200">
                      Cart
                    </Link>
                  </li>
                  <li>
                    <Link href="/wishlist" className="hover:text-gray-200">
                      Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link href="/guide" className="hover:text-gray-200">
                      Size Guide
                    </Link>
                  </li>
                  <li>
                    <Link href="/account" className="hover:text-gray-200">
                      My Account
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://www.instagram.com/teal_parrot" className="hover:text-gray-200">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="https://www.facebook.com/profile.php?id=61571249081806" className="hover:text-gray-200">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-200">
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-200">
                  YouTube
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link href="mailto:support@tealparrot.com" className="hover:text-gray-200">
                  Support
                </Link>
              </li>
              <li>
                <Link
                  href="https://wa.me/91999999999?text=Hey%20there%20I%27m%20facing%20some%20issue.%20Can%20you%20help?"
                  className="hover:text-gray-200"
                >
                  Troubleshooting
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Logo and Legal Links */}
          <div className="flex flex-col items-center md:items-end">
            <Image
              src="/logos/teal-parrot-logo-white.svg"
              alt="Teal Parrot Logo"
              width={200}
              height={100}
              className="h-24 w-auto mb-4"
              priority
            />
            <div className="text-sm mb-4 flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-2">
              <Link href="/terms-and-conditions" className="hover:text-gray-200">
                Terms & Conditions
              </Link>
              <Link href="/terms-of-use" className="hover:text-gray-200">
                Terms Of Use
              </Link>
              <Link href="/privacy-policy" className="hover:text-gray-200">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mb-8">
          <Link href="mailto:hello@tealparrot.com" className="hover:text-gray-200">
            <Mail className="w-6 h-6" />
          </Link>
          <Link href="#" className="hover:text-gray-200">
            <Linkedin className="w-6 h-6" />
          </Link>
          <Link href="https://www.instagram.com/teal_parrot" className="hover:text-gray-200">
            <Instagram className="w-6 h-6" />
          </Link>
          <Link href="https://www.facebook.com/profile.php?id=61571249081806" className="hover:text-gray-200">
            <Facebook className="w-6 h-6" />
          </Link>
        </div>

        {/* Contact Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <Link
            href="tel:+919999999999"
            className="bg-white text-teal-500 font-montserrat font-semibold py-2 px-4 rounded text-center hover:bg-gray-200"
          >
            +91 99999 99999
          </Link>
          <Link
            href="tel:04719999999"
            className="bg-white text-teal-500 font-montserrat font-semibold py-2 px-4 rounded text-center hover:bg-gray-200"
          >
            0471 999 9999
          </Link>
          <Link
            href="mailto:hello@tealparrot.com"
            className="bg-white text-teal-500 font-montserrat font-semibold py-2 px-4 rounded text-center hover:bg-gray-200"
          >
            hello@tealparrot.com
          </Link>
        </div>

        {/* Copyright and Address */}
        <div className="border-t border-white/20 py-6 text-center">
          <div className="mb-3 inline-block border border-white/20 rounded-lg px-6 py-3 bg-white/5 backdrop-blur-sm">
            <p className="font-medium">Acotoman India Pvt. Ltd.</p>
            <p className="text-sm text-white/90">Sasthamangalam, Thiruvananthapuram, Kerala, IND, 695010</p>
          </div>
          <p>&copy; {currentYear} All Rights Reserved. Teal Parrot.</p>
          <p className="text-sm mt-1">
            Designed and developed by{" "}
            <a href="https://brandsthink.in/" className="underline hover:text-gray-200">
              Brandsthink.
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
