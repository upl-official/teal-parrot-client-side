import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCollection } from "@/components/product-collection"

export default function CollectionPage({ params }: { params: { slug: string } }) {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-grow">
        <ProductCollection collectionSlug={params.slug} />
      </div>
      <Footer />
    </main>
  )
}

// This function is required for static export with dynamic routes
export function generateStaticParams() {
  // Return an array of objects with the slug parameter
  return [
    { slug: "nose-rings" },
    { slug: "earrings" },
    { slug: "bracelets" },
    { slug: "necklaces" },
    { slug: "anklets" },
    { slug: "pendants" },
    { slug: "rings" },
    { slug: "bangles" },
    { slug: "chains" },
    { slug: "toe-rings" },
    { slug: "cuffs" },
    { slug: "chokers" },
    { slug: "charms" },
    { slug: "brooches" },
    { slug: "hairpins" },
    { slug: "new-arrivals" },
    { slug: "best-sellers" },
    { slug: "sale" },
  ]
}
