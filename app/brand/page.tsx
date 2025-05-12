import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { AnimatedContainer } from "@/components/animated/animated-container"
import { AnimatedImage } from "@/components/animated/animated-image"

export default function BrandPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-teal-500/70 z-10"></div>
        <Image src="/silver-elegance.png" alt="Teal Parrot Jewelry" fill className="object-cover" priority />
        <div className="relative z-20 container mx-auto h-full flex flex-col justify-center px-4">
          <AnimatedContainer animation="slide-up" delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">Our Brand Story</h1>
          </AnimatedContainer>
          <AnimatedContainer animation="slide-up" delay={0.4}>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl">
              Crafting exquisite silver jewelry that combines tradition with contemporary elegance
            </p>
          </AnimatedContainer>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedContainer animation="slide-right" delay={0.2}>
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-teal-100 rounded-full z-0"></div>
                <AnimatedImage
                  src="/logos/teal-parrot-emblem-black.svg"
                  alt="Teal Parrot Emblem"
                  width={400}
                  height={400}
                  className="relative z-10 max-w-[400px]"
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-teal-50 rounded-full z-0"></div>
              </div>
            </AnimatedContainer>

            <AnimatedContainer animation="slide-left" delay={0.4}>
              <h2 className="text-3xl font-semibold mb-6 text-teal-500 relative">
                The Teal Parrot Story
                <span className="absolute bottom-0 left-0 w-16 h-1 bg-teal-500"></span>
              </h2>
              <p className="mb-6 text-lg">
                Teal Parrot was founded with a passion for creating exquisite silver jewelry that combines traditional
                craftsmanship with contemporary design. Our journey began with a simple belief: that beautiful jewelry
                should be accessible to everyone without compromising on quality or design.
              </p>
              <p className="text-lg">
                Each piece in our collection is meticulously crafted using 925 sterling silver, ensuring both beauty and
                durability. We take pride in our attention to detail and commitment to excellence, resulting in jewelry
                that becomes a cherished part of your personal style story.
              </p>
            </AnimatedContainer>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100 rounded-full opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-100 rounded-full opacity-50 transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-4 relative z-10">
          <AnimatedContainer animation="fade" delay={0.2}>
            <h2 className="text-3xl font-semibold mb-12 text-center text-teal-500">Our Core Values</h2>
          </AnimatedContainer>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedContainer animation="slide-up" delay={0.3}>
              <div className="bg-white p-8 rounded-lg shadow-lg text-center relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-teal-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-teal-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-medium mb-3">Quality</h3>
                <p className="text-gray-600">
                  We use only the finest 925 sterling silver and maintain rigorous quality control throughout our
                  production process.
                </p>
              </div>
            </AnimatedContainer>

            <AnimatedContainer animation="slide-up" delay={0.5}>
              <div className="bg-white p-8 rounded-lg shadow-lg text-center relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-teal-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-teal-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-medium mb-3">Craftsmanship</h3>
                <p className="text-gray-600">
                  Our skilled artisans combine traditional techniques with modern technology to create pieces that stand
                  the test of time.
                </p>
              </div>
            </AnimatedContainer>

            <AnimatedContainer animation="slide-up" delay={0.7}>
              <div className="bg-white p-8 rounded-lg shadow-lg text-center relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-teal-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-teal-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-medium mb-3">Sustainability</h3>
                <p className="text-gray-600">
                  We are committed to ethical sourcing and environmentally responsible practices throughout our supply
                  chain.
                </p>
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </section>

      {/* Logo Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedContainer animation="slide-right" delay={0.2} className="order-2 md:order-1">
              <h2 className="text-3xl font-semibold mb-6 text-teal-500 relative">
                The Meaning Behind Our Logo
                <span className="absolute bottom-0 left-0 w-16 h-1 bg-teal-500"></span>
              </h2>
              <p className="mb-6 text-lg">
                The Teal Parrot logo represents our brand's core values and aesthetic. The flowing lines symbolize the
                fluidity and elegance of our designs, while the parrot emblem represents creativity, beauty, and
                freedom.
              </p>
              <p className="text-lg">
                The teal color was chosen for its representation of clarity, communication, and creativity – qualities
                that are at the heart of our design philosophy. Just as our jewelry makes a statement, our logo reflects
                our commitment to creating pieces that are both distinctive and timeless.
              </p>
            </AnimatedContainer>

            <AnimatedContainer animation="slide-left" delay={0.4} className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-teal-100 rounded-full z-0"></div>
                <AnimatedImage
                  src="/logos/teal-parrot-logo-black.svg"
                  alt="Teal Parrot Logo"
                  width={500}
                  height={200}
                  className="relative z-10 max-w-[500px]"
                />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-50 rounded-full z-0"></div>
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-20 bg-teal-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/shimmering-strands.png')] bg-repeat opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <AnimatedContainer animation="fade" delay={0.2}>
            <h2 className="text-3xl font-semibold mb-12 text-center">Our Craftsmanship</h2>
          </AnimatedContainer>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedContainer animation="slide-up" delay={0.3}>
              <div className="text-center">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Design</h3>
                <p className="text-white/80">
                  Our designers draw inspiration from nature, architecture, and cultural motifs to create unique pieces.
                </p>
              </div>
            </AnimatedContainer>

            <AnimatedContainer animation="slide-up" delay={0.5}>
              <div className="text-center">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Creation</h3>
                <p className="text-white/80">
                  Skilled artisans handcraft each piece using traditional techniques passed down through generations.
                </p>
              </div>
            </AnimatedContainer>

            <AnimatedContainer animation="slide-up" delay={0.7}>
              <div className="text-center">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Finishing</h3>
                <p className="text-white/80">
                  Each piece undergoes meticulous finishing and quality control before reaching our customers.
                </p>
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedContainer animation="fade" delay={0.2}>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-semibold mb-6 text-teal-500 inline-block relative">
                Our Promise
                <span className="absolute bottom-0 left-1/2 w-24 h-1 bg-teal-500 transform -translate-x-1/2"></span>
              </h2>
              <p className="text-lg mb-8">
                When you choose Teal Parrot, you're not just buying jewelry – you're investing in a piece that has been
                crafted with care, designed with passion, and created to be cherished for years to come. We promise to
                continue creating beautiful, high-quality silver jewelry that helps you express your unique style and
                celebrate life's special moments.
              </p>

              <AnimatedContainer animation="scale" delay={0.4}>
                <div className="inline-block">
                  <a
                    href="/collection"
                    className="inline-block bg-teal-500 text-white font-montserrat font-semibold px-8 py-3 rounded-full hover:bg-teal-600 transition-colors duration-300"
                  >
                    Explore Our Collection
                  </a>
                </div>
              </AnimatedContainer>
            </div>
          </AnimatedContainer>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedContainer animation="fade" delay={0.2}>
            <h2 className="text-3xl font-semibold mb-12 text-center text-teal-500">Our Creations</h2>
          </AnimatedContainer>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AnimatedContainer animation="scale" delay={0.3} className="col-span-2">
              <div className="relative h-80 overflow-hidden rounded-lg shadow-lg group">
                <Image
                  src="/silver-display.png"
                  alt="Silver Necklace"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4">
                    <h3 className="text-white text-xl font-medium">Elegant Necklaces</h3>
                  </div>
                </div>
              </div>
            </AnimatedContainer>

            <AnimatedContainer animation="scale" delay={0.4}>
              <div className="relative h-80 overflow-hidden rounded-lg shadow-lg group">
                <Image
                  src="/intricate-silver-earrings.png"
                  alt="Silver Earrings"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4">
                    <h3 className="text-white text-xl font-medium">Earrings</h3>
                  </div>
                </div>
              </div>
            </AnimatedContainer>

            <AnimatedContainer animation="scale" delay={0.5}>
              <div className="relative h-80 overflow-hidden rounded-lg shadow-lg group">
                <Image
                  src="/silver-cuff-detail.png"
                  alt="Silver Bracelet"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4">
                    <h3 className="text-white text-xl font-medium">Bracelets</h3>
                  </div>
                </div>
              </div>
            </AnimatedContainer>

            <AnimatedContainer animation="scale" delay={0.6} className="col-span-2">
              <div className="relative h-80 overflow-hidden rounded-lg shadow-lg group">
                <Image
                  src="/placeholder.svg?height=600&width=800&query=silver rings collection display"
                  alt="Silver Rings"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4">
                    <h3 className="text-white text-xl font-medium">Stunning Rings</h3>
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
