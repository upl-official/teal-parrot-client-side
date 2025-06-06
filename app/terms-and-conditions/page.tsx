import { PageLayout } from "@/components/page-layout"

export default function TermsAndConditionsPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-8">
              By accessing and using www.tealparrot.com, you agree to the following terms:
            </p>

            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Representation</h3>
                <p className="text-gray-700">
                  We strive for accuracy in images, descriptions, and specifications. Slight variations may occur due to
                  screen settings or lighting.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Acceptance</h3>
                <p className="text-gray-700">
                  Orders are confirmed upon successful payment. In rare cases, we reserve the right to cancel orders due
                  to pricing errors, stock unavailability, or technical issues.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Intellectual Property</h3>
                <p className="text-gray-700">
                  All content, including product images, logos, and designs, is the property of Teal Parrot.
                  Unauthorized use or reproduction is strictly prohibited.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Liability</h3>
                <p className="text-gray-700">
                  Teal Parrot is not responsible for delays or damages caused by third-party courier services or
                  incorrect shipping information provided by customers.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">User Conduct</h3>
                <p className="text-gray-700">
                  We reserve the right to refuse service to anyone engaging in fraudulent activity or abusive behavior.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Policy Changes</h3>
                <p className="text-gray-700">
                  These terms may be updated from time to time. Continued use of our website indicates your agreement to
                  the latest version.
                </p>
              </section>

              <div className="bg-gray-50 p-6 rounded-lg mt-8">
                <p className="text-gray-700">
                  For questions or assistance, contact us at{" "}
                  <a href="mailto:info@acotoman.com" className="text-teal-600 underline">
                    info@acotoman.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
