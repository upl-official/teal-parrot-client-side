import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCollection } from "@/components/product-collection"
import { PageTransition } from "@/components/animated/page-transition"

// Define the correct type for Next.js App Router page props
type CollectionPageProps = {
  params: { [key: string]: string | string[] }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function CollectionPage({ searchParams }: CollectionPageProps) {
  return (
    <PageTransition>
      <main className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-grow">
          <ProductCollection searchParams={searchParams} />
        </div>
        <Footer />
      </main>
    </PageTransition>
  )
}
