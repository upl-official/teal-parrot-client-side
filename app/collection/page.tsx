import { PageLayout } from "@/components/page-layout"
import { ProductCollection } from "@/components/product-collection"

// Define the correct type for Next.js App Router page props
type CollectionPageProps = {
  params: { [key: string]: string | string[] }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function CollectionPage({ searchParams }: CollectionPageProps) {
  return (
    <PageLayout>
      <ProductCollection />
    </PageLayout>
  )
}
