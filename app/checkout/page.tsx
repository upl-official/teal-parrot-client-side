import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckoutProcess } from "@/components/checkout/checkout-process"

export default function CheckoutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-grow">
        <CheckoutProcess />
      </div>
      <Footer />
    </main>
  )
}
