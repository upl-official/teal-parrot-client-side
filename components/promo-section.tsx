import Link from "next/link"

export function PromoSection() {
  return (
    <section
      className="w-full h-[90vh] bg-cover bg-center relative"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%), url('https://teal-parrot.s3.eu-north-1.amazonaws.com/website-images/landing-images-2/teal-parrot+(1).webp')",
      }}
    >
      <div className="container mx-auto h-full flex items-center justify-center px-4">
        <div className="text-center text-white max-w-2xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Timeless Elegance in Silver</h2>
          <p className="text-lg mb-6">
            Our handcrafted pieces combine traditional craftsmanship with contemporary design.
          </p>
          <Link href="/collection" className="primary-button inline-block">
            See Catalogue
          </Link>
        </div>
      </div>
    </section>
  )
}
