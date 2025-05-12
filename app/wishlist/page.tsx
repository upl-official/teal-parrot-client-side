import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WishlistItems } from "@/components/wishlist-items"
import { AuthGuard } from "@/lib/auth-utils"

export default function WishlistPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-grow">
        <AuthGuard>
          <WishlistItems />
        </AuthGuard>
      </div>
      <Footer />
    </main>
  )
}
