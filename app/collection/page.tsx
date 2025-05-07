import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCollection } from "@/components/product-collection"
import { PageTransition } from "@/components/animated/page-transition"

export default function CollectionPage() {
  return (
    <PageTransition>
      <main className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-grow">
          <ProductCollection />
        </div>
        <Footer />
      </main>
    </PageTransition>
  )
}
