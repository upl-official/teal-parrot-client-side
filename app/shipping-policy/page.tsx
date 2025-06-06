import { PageLayout } from "@/components/page-layout"

export default function ShippingPolicyPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Shipping Policy</h1>

          <div className="prose prose-lg max-w-none">
            <div className="bg-teal-50 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold text-teal-800 mb-4">Shipping & Delivery</h2>
              <p className="text-teal-700">
                We're committed to making your Teal Parrot experience smooth and delightful from start to finish.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Processing</h3>
                <p className="text-gray-700">Orders are processed within 2–5 business days.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping Timeline</h3>
                <p className="text-gray-700">
                  After dispatch, deliveries usually take 4–8 business days, depending on your location.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping Charges</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Free shipping across India on orders above ₹2,000.</li>
                  <li>A nominal fee applies to orders below ₹2,000 and is visible at checkout.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Tracking</h3>
                <p className="text-gray-700">
                  Once your order is shipped, a tracking link will be shared via email or WhatsApp.
                </p>
              </section>

              <div className="bg-gray-50 p-6 rounded-lg mt-8">
                <p className="text-gray-700">
                  If you have any concerns regarding your shipment, feel free to contact us for assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
