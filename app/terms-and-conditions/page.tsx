import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsAndConditionsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>

        <div className="prose max-w-none">
          <p className="text-lg mb-6">Last Updated: April 22, 2024</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">Introduction</h2>
            <p className="mb-4">
              These Terms and Conditions ("Terms") govern your use of the Teal Parrot website and services
              (collectively, the "Services") operated by Teal Parrot ("we," "us," or "our"). By accessing or using our
              Services, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not
              access the Services.
            </p>
            <p>
              These Terms include our Privacy Policy, which is incorporated by reference, and together they constitute
              the entire agreement between you and Teal Parrot regarding your use of our Services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By creating an account, making a purchase, or otherwise using our Services, you acknowledge that you have
              read, understood, and agree to be bound by these Terms. If you are using our Services on behalf of a
              company or other legal entity, you represent that you have the authority to bind such entity to these
              Terms.
            </p>
            <p>
              We reserve the right to change or modify these Terms at any time. Any changes will be effective
              immediately upon posting on our website. Your continued use of our Services following the posting of any
              changes constitutes acceptance of those changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">2. User Accounts</h2>
            <p className="mb-4">
              To access certain features of our Services, you may be required to create an account. You agree to provide
              accurate, current, and complete information during the registration process and to update such information
              to keep it accurate, current, and complete.
            </p>
            <p className="mb-4">
              You are responsible for safeguarding your account credentials and for all activities that occur under your
              account. You agree to notify us immediately of any unauthorized use of your account or any other breach of
              security.
            </p>
            <p>
              We reserve the right to disable any user account at any time in our sole discretion, including if we
              believe that you have violated any provision of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">3. Products and Purchases</h2>
            <h3 className="text-xl font-medium mb-3">3.1 Product Information</h3>
            <p className="mb-4">
              We strive to provide accurate product descriptions, pricing, and availability information. However, we do
              not warrant that product descriptions or other content on our website are accurate, complete, reliable,
              current, or error-free. Colors of products may vary depending on display settings.
            </p>

            <h3 className="text-xl font-medium mb-3">3.2 Pricing and Payment</h3>
            <p className="mb-4">
              All prices are listed in USD and are subject to change without notice. We reserve the right to correct any
              pricing errors, even if we have already accepted your order and/or charged your credit card.
            </p>
            <p className="mb-4">
              Payment must be received prior to shipment of any products. By providing a payment method, you represent
              and warrant that you are authorized to use the designated payment method and authorize us to charge your
              payment method for the total amount of your order (including taxes and shipping charges).
            </p>

            <h3 className="text-xl font-medium mb-3">3.3 Order Acceptance</h3>
            <p className="mb-4">
              Your receipt of an order confirmation does not constitute our acceptance of your order. We reserve the
              right to accept or decline your order for any reason up until the time of shipment, including but not
              limited to product availability, errors in pricing or product information, or problems identified by our
              credit and fraud avoidance department.
            </p>

            <h3 className="text-xl font-medium mb-3">3.4 Shipping and Delivery</h3>
            <p>
              Shipping and delivery dates are estimates only and cannot be guaranteed. We are not liable for any delays
              in shipments. Risk of loss and title for items purchased pass to you upon delivery of the items to the
              carrier.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">4. Returns and Refunds</h2>
            <p className="mb-4">Our return and refund policy is as follows:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Returns must be initiated within 30 days of receiving your order</li>
              <li>Products must be in their original condition, unworn, and with all tags attached</li>
              <li>Custom or personalized items are not eligible for return unless defective</li>
              <li>
                Shipping costs for returns are the responsibility of the customer unless the return is due to our error
              </li>
              <li>
                Refunds will be issued to the original payment method within 10 business days of receiving the returned
                items
              </li>
            </ul>
            <p>We reserve the right to reject returns that do not comply with these requirements.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">5. Intellectual Property Rights</h2>
            <p className="mb-4">
              All content on our website, including but not limited to text, graphics, logos, images, audio clips,
              digital downloads, data compilations, and software, is the property of Teal Parrot or its content
              suppliers and is protected by international copyright laws.
            </p>
            <p className="mb-4">
              Our trademarks and trade dress may not be used in connection with any product or service without our prior
              written consent. All other trademarks not owned by us that appear on our website are the property of their
              respective owners.
            </p>
            <p>
              You are granted a limited, non-exclusive, non-transferable, revocable license to access and use our
              Services for personal, non-commercial purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">6. User Content</h2>
            <p className="mb-4">
              By submitting reviews, comments, or other content to our website, you grant us a non-exclusive,
              royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt,
              publish, translate, create derivative works from, distribute, and display such content throughout the
              world in any media.
            </p>
            <p className="mb-4">You represent and warrant that:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>You own or control all rights to the content you post</li>
              <li>The content is accurate and not misleading</li>
              <li>The content does not violate these Terms and will not cause injury to any person or entity</li>
              <li>The content does not contain any defamatory, offensive, or illegal material</li>
            </ul>
            <p>
              We have the right to remove any content that, in our judgment, violates these Terms or is otherwise
              objectionable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">7. Privacy Policy</h2>
            <p className="mb-4">
              Your use of our Services is also governed by our Privacy Policy, which is incorporated into these Terms by
              reference. Our Privacy Policy details how we collect, use, and disclose information about you when you use
              our Services.
            </p>
            <p>
              By using our Services, you consent to the collection, use, and disclosure of your information as described
              in our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">8. Limitation of Liability</h2>
            <p className="mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL TEAL PARROT, ITS DIRECTORS, EMPLOYEES, PARTNERS,
              AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE
              LOSSES, RESULTING FROM:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES</li>
              <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICES</li>
              <li>ANY CONTENT OBTAINED FROM THE SERVICES</li>
              <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT</li>
            </ul>
            <p>
              WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR
              NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE, AND EVEN IF A REMEDY SET FORTH HEREIN IS
              FOUND TO HAVE FAILED OF ITS ESSENTIAL PURPOSE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">9. Disclaimer of Warranties</h2>
            <p className="mb-4">
              OUR SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED. TEAL PARROT EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p>
              WE DO NOT GUARANTEE, REPRESENT, OR WARRANT THAT OUR SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE, OR
              ERROR-FREE, OR THAT DEFECTS WILL BE CORRECTED. WE DO NOT GUARANTEE THAT THE RESULTS THAT MAY BE OBTAINED
              FROM THE USE OF THE SERVICES WILL BE ACCURATE OR RELIABLE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">10. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Teal Parrot and its officers, directors, employees, and
              agents from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and
              expenses (including but not limited to attorney's fees) arising from: (i) your use of and access to the
              Services; (ii) your violation of any term of these Terms; (iii) your violation of any third-party right,
              including without limitation any copyright, property, or privacy right; or (iv) any claim that your
              content caused damage to a third party.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">11. Governing Law and Dispute Resolution</h2>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its
              conflict of law provisions.
            </p>
            <p className="mb-4">
              Any dispute arising from or relating to these Terms or your use of our Services shall be resolved
              exclusively through final and binding arbitration in New Delhi, India, under the rules of the Indian
              Arbitration and Conciliation Act, 1996. The arbitration shall be conducted by a single arbitrator
              appointed by mutual agreement of the parties.
            </p>
            <p>
              You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in
              a class, consolidated, or representative action. If for any reason a claim proceeds in court rather than
              in arbitration, you waive any right to a jury trial.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">12. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your account and bar access to our Services immediately, without prior notice
              or liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach
              of these Terms.
            </p>
            <p>
              If you wish to terminate your account, you may simply discontinue using our Services or contact us to
              request account deletion. All provisions of these Terms which by their nature should survive termination
              shall survive termination, including, without limitation, ownership provisions, warranty disclaimers,
              indemnity, and limitations of liability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">13. Severability</h2>
            <p>
              If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and
              interpreted to accomplish the objectives of such provision to the greatest extent possible under
              applicable law, and the remaining provisions will continue in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-500 mb-4">14. Contact Information</h2>
            <p className="mb-4">If you have any questions about these Terms and Conditions, please contact us at:</p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-2">
                <strong>Teal Parrot Customer Service</strong>
              </p>
              <p className="mb-2">Email: legal@tealparrot.com</p>
              <p className="mb-2">Phone: +91 99999 99999</p>
              <p>
                Address: Acotoman India Pvt. Ltd.
                <br />
                Sasthamangalam, Thiruvananthapuram
                <br />
                Kerala, IND, 695010
              </p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
