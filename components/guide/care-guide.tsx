"use client"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedContainer } from "@/components/animated/animated-container"

export function CareGuide() {
  return (
    <div className="space-y-8">
      <AnimatedContainer animation="fade" className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Caring for Your Teal Parrot Jewelry</h2>
        <p className="text-gray-600 mb-6">
          To preserve the beauty and brilliance of your Teal Parrot jewelry, we recommend following these simple care
          tips:
        </p>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Keep it Clean and Dry</h3>
              <p className="text-gray-700">
                Gently wipe your jewelry with a soft, dry cloth after every use to remove moisture, oils, and dust.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Avoid Wearing It to the Gym or Spa</h3>
              <p className="text-gray-700">
                Sweat, steam, and water can dull the shine and weaken stone settings over time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Keep Away from Chemicals</h3>
              <p className="text-gray-700">
                Perfumes, lotions, hairsprays, and household cleaners can cause tarnishing and discoloration. Always
                wear your jewelry last when getting ready.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Store It in Our Teal Parrot Box</h3>
              <p className="text-gray-700">
                When not in use, store your jewelry in the original Teal Parrot box provided. It's designed to protect
                your piece from scratches, dust, and oxidation, keeping it safe and beautiful for years.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Use Gentle Cleaners</h3>
              <p className="text-gray-700">
                If needed, clean with mild, non-abrasive jewelry cleaners or a damp cloth. Avoid ultrasonic cleaners for
                stone-studded pieces.
              </p>
            </CardContent>
          </Card>
        </div>
      </AnimatedContainer>

      <AnimatedContainer animation="fade" delay={0.1} className="max-w-3xl mx-auto bg-teal-50 p-6 rounded-lg">
        <p className="text-gray-700 italic text-center">
          Treat your jewelry with love and care, and it will continue to shine with you through every moment.
        </p>
      </AnimatedContainer>
    </div>
  )
}
