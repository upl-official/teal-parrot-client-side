import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturedCollections } from "@/components/landing/featured-collections"
import { FeaturedProducts } from "@/components/landing/featured-products"
import { BenefitsSection } from "@/components/landing/benefits-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { PromoBanner } from "@/components/landing/promo-banner"
import { NewsletterSection } from "@/components/landing/newsletter-section"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-grow">
        <HeroSection />
        <FeaturedCollections />
        <FeaturedProducts />
        <BenefitsSection />
        <TestimonialsSection />
        <PromoBanner />
        <NewsletterSection />
      </div>
      <Footer />
    </main>
  )
}
