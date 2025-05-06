"use client"

import { useState } from "react"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight, Ruler, HelpCircle } from "lucide-react"
import { AnimatedContainer } from "@/components/animated/animated-container"

export function SizeGuide() {
  const [ringSize, setRingSize] = useState("")
  const [mmSize, setMmSize] = useState("")
  const [usSize, setUsSize] = useState("")

  // Ring size conversion
  const handleRingSizeConvert = () => {
    if (!ringSize) return

    // Simple conversion logic (would be more accurate in production)
    const sizeNum = Number.parseFloat(ringSize)
    setMmSize((sizeNum * 3.14 + 14).toFixed(1))
    setUsSize((sizeNum / 2 + 4).toFixed(1))
  }

  return (
    <div className="space-y-12">
      <AnimatedContainer animation="fade" className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Finding Your Perfect Fit</h2>
        <p className="text-gray-600 mb-6">
          Proper sizing ensures your jewelry is comfortable and secure. Use our comprehensive guides below to find your
          perfect size for any piece in our collection.
        </p>

        <Tabs defaultValue="rings" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="rings">Rings</TabsTrigger>
            <TabsTrigger value="necklaces">Necklaces</TabsTrigger>
            <TabsTrigger value="bracelets">Bracelets</TabsTrigger>
            <TabsTrigger value="nose-rings">Nose Rings</TabsTrigger>
          </TabsList>

          <TabsContent value="rings" className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">How to Measure Your Ring Size</h3>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <ol className="list-decimal list-inside space-y-3 text-gray-700">
                      <li>Wrap a piece of string or paper around your finger where the ring will sit.</li>
                      <li>Mark the point where the string or paper meets.</li>
                      <li>Measure the length in millimeters.</li>
                      <li>Use our conversion chart or calculator below to find your ring size.</li>
                    </ol>

                    <div className="mt-6 p-4 bg-teal-50 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center">
                        <HelpCircle className="h-4 w-4 mr-2 text-teal-500" />
                        Pro Tips
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        <li>Measure when your fingers are warm (they shrink when cold).</li>
                        <li>Measure 3-4 times for accuracy.</li>
                        <li>Consider wider bands may need a slightly larger size.</li>
                        <li>If between sizes, go with the larger size.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Image
                      src="/measuring-ring-size.png"
                      alt="How to measure ring size"
                      width={300}
                      height={300}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Ring Size Calculator</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Enter your Indian ring size:</label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="e.g., 12"
                          value={ringSize}
                          onChange={(e) => setRingSize(e.target.value)}
                        />
                        <Button onClick={handleRingSizeConvert}>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {mmSize && usSize && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Conversion Results:</h4>
                        <p className="text-sm">
                          Circumference: <span className="font-semibold">{mmSize} mm</span>
                        </p>
                        <p className="text-sm">
                          US Size: <span className="font-semibold">{usSize}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Ring Size Conversion Chart</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left">India</th>
                          <th className="px-4 py-2 text-left">US</th>
                          <th className="px-4 py-2 text-left">UK</th>
                          <th className="px-4 py-2 text-left">Circumference (mm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="px-4 py-2">8</td>
                          <td className="px-4 py-2">4</td>
                          <td className="px-4 py-2">H</td>
                          <td className="px-4 py-2">46.8</td>
                        </tr>
                        <tr className="border-t bg-gray-50">
                          <td className="px-4 py-2">10</td>
                          <td className="px-4 py-2">5</td>
                          <td className="px-4 py-2">J</td>
                          <td className="px-4 py-2">49.3</td>
                        </tr>
                        <tr className="border-t">
                          <td className="px-4 py-2">12</td>
                          <td className="px-4 py-2">6</td>
                          <td className="px-4 py-2">L</td>
                          <td className="px-4 py-2">51.9</td>
                        </tr>
                        <tr className="border-t bg-gray-50">
                          <td className="px-4 py-2">14</td>
                          <td className="px-4 py-2">7</td>
                          <td className="px-4 py-2">N</td>
                          <td className="px-4 py-2">54.4</td>
                        </tr>
                        <tr className="border-t">
                          <td className="px-4 py-2">16</td>
                          <td className="px-4 py-2">8</td>
                          <td className="px-4 py-2">P</td>
                          <td className="px-4 py-2">57.0</td>
                        </tr>
                        <tr className="border-t bg-gray-50">
                          <td className="px-4 py-2">18</td>
                          <td className="px-4 py-2">9</td>
                          <td className="px-4 py-2">R</td>
                          <td className="px-4 py-2">59.5</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="necklaces" className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Necklace Length Guide</h3>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-gray-700 mb-4">
                      Necklace length is measured from end to end, including the clasp. The right length depends on your
                      neck size and where you want the necklace to sit.
                    </p>

                    <h4 className="font-medium mb-2">How to Measure:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Use a soft measuring tape or string.</li>
                      <li>Wrap it around your neck where the necklace will sit.</li>
                      <li>Add 2-3 inches (5-7.5 cm) for comfort.</li>
                    </ol>

                    <div className="mt-6 p-4 bg-teal-50 rounded-lg">
                      <h4 className="font-medium mb-2">Standard Necklace Lengths:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>
                          <span className="font-medium">Choker:</span> 14-16 inches (35-40 cm)
                        </li>
                        <li>
                          <span className="font-medium">Princess:</span> 18 inches (45 cm)
                        </li>
                        <li>
                          <span className="font-medium">Matinee:</span> 20-24 inches (50-60 cm)
                        </li>
                        <li>
                          <span className="font-medium">Opera:</span> 28-36 inches (70-90 cm)
                        </li>
                        <li>
                          <span className="font-medium">Rope:</span> 36+ inches (90+ cm)
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Image
                      src="/necklace-length-guide.png"
                      alt="Necklace length guide"
                      width={300}
                      height={400}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bracelets" className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Bracelet Size Guide</h3>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-2">How to Measure Your Wrist:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Wrap a measuring tape or string around your wrist where you'd wear the bracelet.</li>
                      <li>If using string, mark where it meets and measure against a ruler.</li>
                      <li>Add 1/2 to 1 inch (1.3-2.5 cm) to your wrist measurement for comfort.</li>
                    </ol>

                    <div className="mt-6 p-4 bg-teal-50 rounded-lg">
                      <h4 className="font-medium mb-2">Bracelet Size Chart:</h4>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="py-2 text-left">Wrist Size</th>
                            <th className="py-2 text-left">Bracelet Size</th>
                            <th className="py-2 text-left">Fit</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2">5.5-6 inches (14-15 cm)</td>
                            <td className="py-2">6.5-7 inches (16.5-18 cm)</td>
                            <td className="py-2">Snug</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">6-6.5 inches (15-16.5 cm)</td>
                            <td className="py-2">7-7.5 inches (18-19 cm)</td>
                            <td className="py-2">Comfort</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">6.5-7 inches (16.5-18 cm)</td>
                            <td className="py-2">7.5-8 inches (19-20.5 cm)</td>
                            <td className="py-2">Loose</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Image
                      src="/wrist-measurement-guide.png"
                      alt="Bracelet sizing guide"
                      width={300}
                      height={300}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nose-rings" className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Nose Ring Size Guide</h3>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-gray-700 mb-4">
                      Nose rings come in various styles and sizes. The two most important measurements are gauge
                      (thickness) and diameter (for hoops) or length (for studs).
                    </p>

                    <h4 className="font-medium mb-2">Common Nose Ring Gauges:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>
                        <span className="font-medium">20G (0.8mm):</span> Most common for nostril piercings
                      </li>
                      <li>
                        <span className="font-medium">18G (1.0mm):</span> Standard for many nose piercings
                      </li>
                      <li>
                        <span className="font-medium">16G (1.2mm):</span> Slightly thicker, used for some nostril and
                        septum piercings
                      </li>
                    </ul>

                    <div className="mt-6 p-4 bg-teal-50 rounded-lg">
                      <h4 className="font-medium mb-2">Nose Ring Diameter Guide:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>
                          <span className="font-medium">Small:</span> 6-7mm (subtle, close to nostril)
                        </li>
                        <li>
                          <span className="font-medium">Medium:</span> 8-9mm (standard size)
                        </li>
                        <li>
                          <span className="font-medium">Large:</span> 10-11mm (more noticeable)
                        </li>
                        <li>
                          <span className="font-medium">Extra Large:</span> 12mm+ (statement piece)
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Image
                      src="/nose-ring-size-guide.png"
                      alt="Nose ring sizing guide"
                      width={300}
                      height={300}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </AnimatedContainer>

      <AnimatedContainer animation="fade" delay={0.2} className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I know if my ring fits correctly?</AccordionTrigger>
            <AccordionContent>
              <p>
                A properly fitting ring should slide over your knuckle with slight resistance and feel snug but
                comfortable on your finger. It shouldn't spin too easily or leave deep marks on your finger. You should
                be able to remove it with some effort, but it shouldn't be so tight that it's difficult to remove or
                causes discomfort.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Do fingers change size?</AccordionTrigger>
            <AccordionContent>
              <p>
                Yes, finger size can fluctuate due to various factors including temperature (fingers shrink in cold
                weather and expand in hot weather), time of day (fingers are often smaller in the morning and larger in
                the evening), weight changes, water retention, and hormonal changes. It's best to measure your finger
                size at different times of day and in average temperature conditions.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>What if I'm between bracelet sizes?</AccordionTrigger>
            <AccordionContent>
              <p>
                If you're between bracelet sizes, it's generally better to choose the larger size for comfort. A
                slightly loose bracelet is usually more comfortable than one that's too tight. However, if you prefer a
                snug fit or are concerned about the bracelet sliding off, you might opt for the smaller size. Consider
                the style of the bracelet too - chain bracelets can be more flexible with sizing than rigid bangles.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>How do I measure for an anklet?</AccordionTrigger>
            <AccordionContent>
              <p>
                To measure for an anklet, wrap a measuring tape or string around the narrowest part of your ankle, just
                above the ankle bone. If using string, mark where it meets and measure against a ruler. Add 1/4 to 1/2
                inch (0.6-1.3 cm) to this measurement for comfort. Standard anklet sizes range from 9-11 inches (23-28
                cm), with 10 inches (25 cm) being the most common size for women.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>Can I resize my silver jewelry?</AccordionTrigger>
            <AccordionContent>
              <p>
                Many silver jewelry pieces can be resized, particularly rings and some bracelets. However, the ability
                to resize depends on the design and construction of the piece. Rings with stones or intricate designs
                may be more difficult to resize. Necklaces and chains can usually be shortened but not lengthened unless
                additional links are added. For any resizing needs, we recommend consulting with our customer service
                team or a professional jeweler.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </AnimatedContainer>

      <AnimatedContainer animation="fade" delay={0.3} className="max-w-3xl mx-auto bg-teal-50 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Ruler className="h-5 w-5 text-teal-500" />
          <h2 className="text-xl font-semibold">Need More Help?</h2>
        </div>
        <p className="text-gray-700 mb-4">
          If you're still unsure about your size or have specific questions about a particular piece, our customer
          service team is here to help.
        </p>
        <Button className="bg-teal-500 hover:bg-teal-600">Contact Us</Button>
      </AnimatedContainer>
    </div>
  )
}
