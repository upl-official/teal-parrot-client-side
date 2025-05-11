import { PageLayout } from "@/components/page-layout"
import { CartItems } from "@/components/cart-items"
import { AuthGuard } from "@/lib/auth-utils"

export default function CartPage() {
  return (
    <PageLayout>
      <div className="flex-grow">
        <AuthGuard>
          <CartItems />
        </AuthGuard>
      </div>
    </PageLayout>
  )
}
