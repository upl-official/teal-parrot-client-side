import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="prose max-w-none">
          <p className="text-lg mb-6">Last Updated: April 22, 2024</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">Introduction</h2>
            <p className="mb-4">
              Teal Parrot ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you visit our website and use our
              services, including when you make purchases, create an account, or contact our customer service.
            </p>
            <p>
              Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge that you
              have read, understood, and agree to be bound by all the terms outlined in this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">Information We Collect</h2>

            <h3 className="text-xl font-medium mb-3">Personal Information</h3>
            <p className="mb-4">We may collect personal information that you voluntarily provide to us when you:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Create an account</li>
              <li>Make a purchase</li>
              <li>Sign up for our newsletter</li>
              <li>Contact our customer service</li>
              <li>Participate in promotions or surveys</li>
              <li>Post reviews or comments</li>
            </ul>
            <p className="mb-4">This information may include:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Billing and shipping address</li>
              <li>Payment information (credit card numbers, etc.)</li>
              <li>Account passwords</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">Automatically Collected Information</h3>
            <p className="mb-4">
              When you visit our website, we may automatically collect certain information about your device and usage
              patterns, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Device information</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
              <li>Click patterns</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect for various purposes, including to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Process and fulfill your orders</li>
              <li>Create and manage your account</li>
              <li>Provide customer support</li>
              <li>Send transactional emails (order confirmations, shipping updates)</li>
              <li>Send marketing communications (if you've opted in)</li>
              <li>Improve our website and services</li>
              <li>Personalize your shopping experience</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">Data Sharing and Disclosure</h2>
            <p className="mb-4">We may share your information with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Service Providers:</strong> Third parties that help us operate our business, such as payment
                processors, shipping companies, and cloud service providers.
              </li>
              <li>
                <strong>Business Partners:</strong> Trusted third parties who assist us in offering products and
                services.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law, court order, or governmental authority.
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.
              </li>
            </ul>
            <p>
              We do not sell your personal information to third parties for their marketing purposes without your
              explicit consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Encryption of sensitive data</li>
              <li>Secure socket layer (SSL) technology</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication procedures</li>
              <li>Staff training on data protection</li>
            </ul>
            <p>
              However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">Data Retention</h2>
            <p className="mb-4">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this
              Privacy Policy, unless a longer retention period is required or permitted by law. When determining the
              appropriate retention period, we consider:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>The amount, nature, and sensitivity of the personal information</li>
              <li>The potential risk of harm from unauthorized use or disclosure</li>
              <li>The purposes for which we process the data</li>
              <li>Whether we can achieve those purposes through other means</li>
              <li>Legal, regulatory, and contractual requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">Your Rights</h2>
            <p className="mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Access:</strong> The right to request copies of your personal information.
              </li>
              <li>
                <strong>Rectification:</strong> The right to request that we correct inaccurate information.
              </li>
              <li>
                <strong>Erasure:</strong> The right to request that we delete your personal information.
              </li>
              <li>
                <strong>Restriction:</strong> The right to request that we restrict the processing of your information.
              </li>
              <li>
                <strong>Data Portability:</strong> The right to request that we transfer your information to another
                organization.
              </li>
              <li>
                <strong>Objection:</strong> The right to object to our processing of your personal information.
              </li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the information provided in the "Contact Us"
              section below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">Cookies and Tracking Technologies</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to collect and use information about you and your
              interaction with our website. Cookies help us identify you when you visit our website, remember your
              preferences, and improve your overall experience.
            </p>
            <p className="mb-4">We use the following types of cookies:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Essential Cookies:</strong> Necessary for the website to function properly.
              </li>
              <li>
                <strong>Analytical/Performance Cookies:</strong> Allow us to recognize and count visitors and see how
                they move around our website.
              </li>
              <li>
                <strong>Functionality Cookies:</strong> Enable us to personalize content and remember your preferences.
              </li>
              <li>
                <strong>Targeting Cookies:</strong> Record your visit to our website, the pages you visit, and the links
                you follow.
              </li>
            </ul>
            <p>
              You can set your browser to refuse all or some browser cookies or to alert you when websites set or access
              cookies. If you disable or refuse cookies, please note that some parts of our website may become
              inaccessible or not function properly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 16, and we do not knowingly collect
              personal information from children. If we learn that we have collected personal information from a child
              under 16, we will take steps to delete that information as quickly as possible. If you believe we might
              have any information from or about a child under 16, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other
              operational, legal, or regulatory reasons. We will notify you of any material changes by posting the
              updated Privacy Policy on this page with a new "Last Updated" date. We encourage you to review this
              Privacy Policy periodically to stay informed about how we are protecting your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices,
              please contact us at:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-2">
                <strong>Teal Parrot Customer Service</strong>
              </p>
              <p className="mb-2">Email: privacy@tealparrot.com</p>
              <p className="mb-2">Phone: +91 99999 99999</p>
              <p>
                Address: 123 Silver Street
                <br />
                Jewelry District
                <br />
                New Delhi, 110001
                <br />
                India
              </p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
