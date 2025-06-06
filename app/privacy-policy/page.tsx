import { PageLayout } from "@/components/page-layout"

export default function PrivacyPolicyPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none">
            <div className="bg-teal-50 p-6 rounded-lg mb-8">
              <p className="text-teal-800 font-medium">
                At Teal Parrot, your trust means everything to us. We are committed to protecting your privacy and
                ensuring a safe shopping experience.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Information Collection</h3>
                <p className="text-gray-700">
                  We collect only the necessary personal information (such as name, contact number, address, and payment
                  details) to process your order and provide support.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Usage</h3>
                <p className="text-gray-700">
                  Your information is used strictly to fulfill orders, personalize your experience, and occasionally
                  update you about new launches or offers (if opted in).
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Protection</h3>
                <p className="text-gray-700">
                  We use secure systems and encryption to protect your data. We never sell, rent, or share your personal
                  information with third-party advertisers.
                </p>
              </section>

              <div className="bg-blue-50 p-6 rounded-lg mt-8">
                <p className="text-blue-800">
                  By shopping with Teal Parrot, you agree to this policy. You can reach out to us at any time to update
                  or delete your data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
