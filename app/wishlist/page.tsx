import { PageLayout } from "@/components/page-layout"
import { WishlistItems } from "@/components/wishlist-items"
import { AuthGuard } from "@/lib/auth-utils"

export default function WishlistPage() {
  return (
    <PageLayout>
      <div className="flex-grow">
        <AuthGuard>
          <WishlistItems />
        </AuthGuard>
      </div>
    </PageLayout>
  )
}
