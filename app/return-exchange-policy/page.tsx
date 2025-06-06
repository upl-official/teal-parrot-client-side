import { PageLayout } from "@/components/page-layout"

export default function ReturnExchangePolicyPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Return & Exchange Policy</h1>

          <div className="prose prose-lg max-w-none">
            <div className="bg-red-50 p-6 rounded-lg mb-8">
              <p className="text-red-800 font-medium">
                At this time, we do not offer returns or refunds, as each Teal Parrot piece is made with care and
                curated in limited quantities.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">To ensure your complete satisfaction:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Every piece undergoes a thorough quality check before shipping.</li>
                  <li>
                    We provide clear product details, images, and styling support to help you make confident choices.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Exchange</h3>
                <p className="text-gray-700 mb-4">We only allow exchanges in case of:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Wrong item delivered</li>
                  <li>Manufacturing defect (must be reported within 24 hours of delivery with unboxing video)</li>
                </ul>

                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <p className="text-blue-800">
                    To request an exchange, please email us at{" "}
                    <a href="mailto:info@acotoman.com" className="underline">
                      info@acotoman.com
                    </a>{" "}
                    or WhatsApp us with your order number and issue.
                  </p>
                </div>
              </section>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <p className="text-yellow-800 font-medium">
                  We do not encourage returns for reasons of change in mind, dislike of style, or wear-related damage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
