"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"
import { AnimatedContainer } from "@/components/animated/animated-container"

export function SizeGuide() {
  return (
    <div className="space-y-12">
      <AnimatedContainer animation="fade" className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Size Guide – Find Your Perfect Ring Size</h2>
        <p className="text-gray-600 mb-6">
          Finding the right ring size is essential for a perfect fit. You can measure using a ring you already own or
          use a printable ring sizer. Here's a detailed conversion chart to help you choose accurately:
        </p>

        <Card className="mb-8">
          <CardContent className="pt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">US Size</th>
                  <th className="px-4 py-2 text-left">Diameter (mm)</th>
                  <th className="px-4 py-2 text-left">Circumference (mm)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2">5</td>
                  <td className="px-4 py-2">15.7</td>
                  <td className="px-4 py-2">49.3</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="px-4 py-2">6</td>
                  <td className="px-4 py-2">16.5</td>
                  <td className="px-4 py-2">51.8</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">7</td>
                  <td className="px-4 py-2">17.3</td>
                  <td className="px-4 py-2">54.4</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="px-4 py-2">8</td>
                  <td className="px-4 py-2">18.1</td>
                  <td className="px-4 py-2">56.9</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">9</td>
                  <td className="px-4 py-2">19.0</td>
                  <td className="px-4 py-2">59.5</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="px-4 py-2">10</td>
                  <td className="px-4 py-2">19.8</td>
                  <td className="px-4 py-2">62.1</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">11</td>
                  <td className="px-4 py-2">20.6</td>
                  <td className="px-4 py-2">64.6</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="px-4 py-2">12</td>
                  <td className="px-4 py-2">21.4</td>
                  <td className="px-4 py-2">67.2</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <h3 className="text-xl font-semibold mb-4">How to Measure Your Ring Size</h3>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium mb-3">Option 1: Use an Existing Ring</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Take a ring that fits well.</li>
                <li>Measure the internal diameter in millimeters.</li>
                <li>Refer to the chart above to find your US ring size.</li>
              </ol>
              <div className="mt-4 flex justify-center">
                <Image
                  src="https://teal-parrot.s3.eu-north-1.amazonaws.com/website-images/guide-images/teal-parrot-guide-ring-1.webp"
                  alt="Measuring an existing ring"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium mb-3">Option 2: Use a String or Paper Strip</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Wrap it around the base of your finger.</li>
                <li>Mark where the ends meet.</li>
                <li>Measure the length (circumference) in millimeters.</li>
                <li>Match your measurement to the chart to find your size.</li>
              </ol>
              <div className="mt-4 flex justify-center">
                <Image
                  src="https://teal-parrot.s3.eu-north-1.amazonaws.com/website-images/guide-images/teal-parrot-guide-ring-2.webp"
                  alt="Measuring with string"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedContainer>

      <AnimatedContainer animation="fade" delay={0.3} className="max-w-3xl mx-auto bg-teal-50 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle className="h-5 w-5 text-teal-500" />
          <h2 className="text-xl font-semibold">Tip</h2>
        </div>
        <p className="text-gray-700">
          Make sure the string is snug but not too tight. Measure at the end of the day when your fingers are at their
          largest.
        </p>
      </AnimatedContainer>
    </div>
  )
}
