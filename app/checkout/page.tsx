import { Suspense } from "react"
import { CheckoutProcess } from "@/components/checkout/checkout-process"

interface CheckoutPageProps {
  searchParams: {
    productId?: string
    quantity?: string
  }
}

export default function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const directProductId = searchParams.productId || null
  const directQuantity = searchParams.quantity ? Number.parseInt(searchParams.quantity, 10) : undefined

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      }
    >
      <CheckoutProcess directProductId={directProductId} directQuantity={directQuantity} />
    </Suspense>
  )
}
