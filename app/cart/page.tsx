import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartItems } from "@/components/cart-items"
import { AuthGuard } from "@/lib/auth-utils"

export default function CartPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-grow">
        <AuthGuard>
          <CartItems />
        </AuthGuard>
      </div>
      <Footer />
    </main>
  )
}
