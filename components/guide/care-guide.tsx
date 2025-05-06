"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import { AnimatedContainer } from "@/components/animated/animated-container"

export function CareGuide() {
  return (
    <div className="space-y-12">
      <AnimatedContainer animation="fade" className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Caring for Your Silver Jewelry</h2>
        <p className="text-gray-600 mb-6">
          Silver jewelry is beautiful, but it requires proper care to maintain its luster and prevent tarnishing. Follow
          our expert tips to keep your pieces looking their best for years to come.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Check className="h-5 w-5 mr-2 text-green-500" />
                Do's
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                  <span>Store in a cool, dry place in an anti-tarnish bag or cloth</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                  <span>Clean regularly with a soft polishing cloth specifically designed for silver</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                  <span>Remove jewelry before swimming, bathing, or using household chemicals</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                  <span>Put on jewelry after applying perfume, lotion, or hairspray</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                  <span>Handle with clean, dry hands to avoid transferring oils and dirt</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <X className="h-5 w-5 mr-2 text-red-500" />
                Don'ts
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <X className="h-4 w-4 mr-2 text-red-500 mt-1 flex-shrink-0" />
                  <span>Expose to chlorine, salt water, or hot springs</span>
                </li>
                <li className="flex items-start">
                  <X className="h-4 w-4 mr-2 text-red-500 mt-1 flex-shrink-0" />
                  <span>Use toothpaste, baking soda, or other abrasive cleaners</span>
                </li>
                <li className="flex items-start">
                  <X className="h-4 w-4 mr-2 text-red-500 mt-1 flex-shrink-0" />
                  <span>Store multiple pieces together where they can scratch each other</span>
                </li>
                <li className="flex items-start">
                  <X className="h-4 w-4 mr-2 text-red-500 mt-1 flex-shrink-0" />
                  <span>Wear while exercising or during activities that cause excessive sweating</span>
                </li>
                <li className="flex items-start">
                  <X className="h-4 w-4 mr-2 text-red-500 mt-1 flex-shrink-0" />
                  <span>Use harsh chemicals or ultrasonic cleaners without professional guidance</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </AnimatedContainer>

      <AnimatedContainer animation="fade" delay={0.1} className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Cleaning Methods</h2>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Gentle Cleaning Solution</h3>
                  <p className="text-gray-700 mb-4">
                    For regular cleaning, this gentle method is safe for most silver jewelry.
                  </p>

                  <h4 className="font-medium mb-2">You'll Need:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
                    <li>Warm water</li>
                    <li>Mild dish soap</li>
                    <li>Soft-bristled toothbrush</li>
                    <li>Microfiber cloth</li>
                  </ul>

                  <h4 className="font-medium mb-2">Steps:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Mix a few drops of mild dish soap in warm water</li>
                    <li>Soak your silver jewelry for 5-10 minutes</li>
                    <li>Gently scrub with a soft-bristled toothbrush to reach crevices</li>
                    <li>Rinse thoroughly with clean water</li>
                    <li>Pat dry with a soft cloth, then air dry completely</li>
                  </ol>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Important Notes:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-teal-500 font-bold mr-2">•</span>
                      <span>Never soak jewelry with gemstones or pearls as water can damage them</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-500 font-bold mr-2">•</span>
                      <span>Ensure water is not too hot as it can damage certain adhesives</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-500 font-bold mr-2">•</span>
                      <span>Always dry thoroughly to prevent water spots</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-500 font-bold mr-2">•</span>
                      <span>For intricate pieces, use a cotton swab to reach small areas</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Silver Polish Method</h3>
                  <p className="text-gray-700 mb-4">
                    For restoring shine and removing light tarnish, a silver polish is effective.
                  </p>

                  <h4 className="font-medium mb-2">You'll Need:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
                    <li>Silver polishing cloth</li>
                    <li>Silver polish (cream or liquid)</li>
                    <li>Cotton balls or soft cloth</li>
                    <li>Rubber gloves (optional)</li>
                  </ul>

                  <h4 className="font-medium mb-2">Steps:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Apply a small amount of polish to a soft cloth</li>
                    <li>Gently rub the silver in a back-and-forth motion (not circular)</li>
                    <li>Focus on tarnished areas, working the polish into crevices</li>
                    <li>Rinse thoroughly to remove all polish residue</li>
                    <li>Buff with a clean, dry cloth until shiny</li>
                  </ol>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Pro Tips:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-teal-500 font-bold mr-2">•</span>
                      <span>Use a silver polishing cloth for regular maintenance between deep cleanings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-500 font-bold mr-2">•</span>
                      <span>Always follow the manufacturer's instructions on silver polish products</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-500 font-bold mr-2">•</span>
                      <span>
                        For pieces with oxidized details (blackened areas), avoid polishing these sections as it's part
                        of the design
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-500 font-bold mr-2">•</span>
                      <span>Test polish on a small, inconspicuous area first</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Baking Soda Method (For Heavy Tarnish)</h3>
                  <p className="text-gray-700 mb-4">
                    For heavily tarnished pieces, this method can help restore your silver.
                  </p>

                  <h4 className="font-medium mb-2">You'll Need:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
                    <li>Aluminum foil</li>
                    <li>Baking soda (1 tablespoon per cup of water)</li>
                    <li>Boiling water</li>
                    <li>Glass or ceramic dish</li>
                    <li>Tongs</li>
                  </ul>

                  <h4 className="font-medium mb-2">Steps:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Line a glass dish with aluminum foil, shiny side up</li>
                    <li>Place tarnished silver on the foil, ensuring it touches the foil</li>
                    <li>Add baking soda (1 tbsp per cup of water needed)</li>
                    <li>Pour in enough boiling water to cover the items</li>
                    <li>Let sit for 5-10 minutes as tarnish transfers to the foil</li>
                    <li>Remove with tongs, rinse thoroughly, and dry</li>
                  </ol>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-amber-600">Caution:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-amber-600 font-bold mr-2">!</span>
                      <span>
                        Do NOT use this method for jewelry with gemstones, pearls, or oxidized/antiqued finishes
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 font-bold mr-2">!</span>
                      <span>This method uses a chemical reaction that can affect certain designs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 font-bold mr-2">!</span>
                      <span>Be careful with boiling water to avoid burns</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 font-bold mr-2">!</span>
                      <span>For valuable or antique pieces, consult a professional instead</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedContainer>

      <AnimatedContainer animation="fade" delay={0.2} className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Proper Storage</h2>

        <Card>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 mb-4">
                  Proper storage is crucial for preventing tarnish and keeping your silver jewelry in pristine
                  condition.
                </p>

                <h4 className="font-medium mb-2">Best Storage Practices:</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Store each piece separately in anti-tarnish bags, pouches, or cloth</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Keep in a cool, dry place away from direct sunlight</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Add a silica gel packet to your jewelry box to absorb moisture</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>For necklaces, fasten clasps to prevent tangling</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Consider a jewelry box with individual compartments or a hanging organizer</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">What Causes Tarnish?</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Silver tarnishes when it reacts with sulfur-containing substances in the air. The following can
                  accelerate tarnishing:
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <X className="h-4 w-4 mr-2 text-red-500 mt-1 flex-shrink-0" />
                    <span>Humidity and moisture</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-4 w-4 mr-2 text-red-500 mt-1 flex-shrink-0" />
                    <span>Air pollution</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-4 w-4 mr-2 text-red-500 mt-1 flex-shrink-0" />
                    <span>Cosmetics, perfumes, and hairsprays</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-4 w-4 mr-2 text-red-500 mt-1 flex-shrink-0" />
                    <span>Wool, rubber, and latex materials</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-4 w-4 mr-2 text-red-500 mt-1 flex-shrink-0" />
                    <span>Foods like eggs, onions, and certain fruits</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedContainer>

      <AnimatedContainer animation="fade" delay={0.3} className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">When to Seek Professional Help</h2>

        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-700 mb-6">
              While regular at-home cleaning is sufficient for most silver jewelry, there are times when professional
              cleaning and maintenance are recommended:
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-3">Consider Professional Cleaning When:</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-teal-500 font-bold mr-2">•</span>
                    <span>Your piece has gemstones or delicate settings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-500 font-bold mr-2">•</span>
                    <span>The jewelry has intricate or hard-to-reach details</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-500 font-bold mr-2">•</span>
                    <span>There's severe tarnish that home methods can't remove</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-500 font-bold mr-2">•</span>
                    <span>The piece is an antique or has significant value</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-500 font-bold mr-2">•</span>
                    <span>You notice loose stones, bent prongs, or other damage</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-3">Professional Services Include:</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-teal-500 font-bold mr-2">•</span>
                    <span>Deep cleaning with specialized equipment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-500 font-bold mr-2">•</span>
                    <span>Rhodium plating to enhance shine and durability</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-500 font-bold mr-2">•</span>
                    <span>Stone tightening and prong inspection</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-500 font-bold mr-2">•</span>
                    <span>Repair of clasps, chains, and settings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-500 font-bold mr-2">•</span>
                    <span>Restoration of antique or damaged pieces</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-teal-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Teal Parrot Tip:</span> We recommend professional cleaning for your fine
                silver jewelry once a year to maintain its beauty and extend its lifespan. Contact our customer service
                team to learn about our cleaning and maintenance services.
              </p>
            </div>
          </CardContent>
        </Card>
      </AnimatedContainer>

      <AnimatedContainer animation="fade" delay={0.4} className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Troubleshooting Common Issues</h2>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Stubborn Tarnish</h3>
              <p className="text-gray-700 mb-3">
                If your silver has developed dark, stubborn tarnish that won't come off with regular cleaning:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-500 font-bold mr-2">1.</span>
                  <span>Try the baking soda method described above (for pieces without gemstones)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 font-bold mr-2">2.</span>
                  <span>Use a commercial silver dip for very tarnished pieces (follow instructions carefully)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 font-bold mr-2">3.</span>
                  <span>For valuable pieces, seek professional cleaning rather than using harsh methods</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Scratches</h3>
              <p className="text-gray-700 mb-3">Minor scratches on silver jewelry:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-500 font-bold mr-2">1.</span>
                  <span>For very light scratches, gentle polishing with a silver cloth may help</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 font-bold mr-2">2.</span>
                  <span>Do not attempt to buff out deeper scratches yourself as this can damage the piece</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 font-bold mr-2">3.</span>
                  <span>Professional jewelers can often remove or minimize scratches with specialized equipment</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Discoloration</h3>
              <p className="text-gray-700 mb-3">If your silver has turned yellow or developed strange colors:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-500 font-bold mr-2">1.</span>
                  <span>This may indicate exposure to harsh chemicals or excessive heat</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 font-bold mr-2">2.</span>
                  <span>Try a gentle cleaning with mild soap and water first</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 font-bold mr-2">3.</span>
                  <span>If discoloration persists, consult a professional as it may require specialized treatment</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Skin Discoloration</h3>
              <p className="text-gray-700 mb-3">If wearing silver jewelry turns your skin green or black:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-500 font-bold mr-2">1.</span>
                  <span>
                    This is a normal reaction between metals and skin oils/acids and doesn't indicate poor quality
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 font-bold mr-2">2.</span>
                  <span>Keep your jewelry and skin clean and dry to minimize this reaction</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 font-bold mr-2">3.</span>
                  <span>
                    Apply a thin layer of clear nail polish to the part that touches your skin (reapply as needed)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 font-bold mr-2">4.</span>
                  <span>Consider rhodium plating for pieces that consistently cause discoloration</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </AnimatedContainer>

      <AnimatedContainer animation="fade" delay={0.5} className="max-w-3xl mx-auto bg-teal-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Care Calendar Reminder</h2>
        <p className="text-gray-700 mb-4">
          To keep your silver jewelry looking its best, follow this simple care schedule:
        </p>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="text-teal-500 font-bold mr-2">•</span>
            <span>
              <strong>After each wear:</strong> Wipe with a soft cloth to remove oils and moisture
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-500 font-bold mr-2">•</span>
            <span>
              <strong>Weekly:</strong> Polish with a silver polishing cloth for frequently worn pieces
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-500 font-bold mr-2">•</span>
            <span>
              <strong>Monthly:</strong> Check for tarnish and clean with mild soap if needed
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-500 font-bold mr-2">•</span>
            <span>
              <strong>Every 6 months:</strong> Deep clean all your silver jewelry
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-500 font-bold mr-2">•</span>
            <span>
              <strong>Annually:</strong> Consider professional cleaning for valuable or intricate pieces
            </span>
          </li>
        </ul>
      </AnimatedContainer>
    </div>
  )
}
