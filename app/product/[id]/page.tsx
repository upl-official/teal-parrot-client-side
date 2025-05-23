import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetail } from "@/components/product-detail"
import { SimilarProducts } from "@/components/similar-products"
import { SameFamilyProducts } from "@/components/same-family-products"
import { PromoSection } from "@/components/promo-section"
import { Suspense } from "react"
import { fetchProductById } from "@/lib/api"

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Fetch the product data to get the name and category
  const product = await fetchProductById(params.id)

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-grow">
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          }
        >
          <ProductDetail productId={params.id} />
        </Suspense>

        {/* Add the new SameFamilyProducts component */}
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading related products...</div>}>
          <SameFamilyProducts productName={product.name} currentCategory={product.category} />
        </Suspense>

        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading similar products...</div>}>
          <SimilarProducts category={product.category} />
        </Suspense>

        <PromoSection />
      </div>
      <Footer />
    </main>
  )
}
