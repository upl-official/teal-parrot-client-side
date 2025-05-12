import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturedCollections } from "@/components/landing/featured-collections"
import { FeaturedProducts } from "@/components/landing/featured-products"
import { BenefitsSection } from "@/components/landing/benefits-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { PromoBanner } from "@/components/landing/promo-banner"
import { NewsletterSection } from "@/components/landing/newsletter-section"
import { FeaturedQuoteSection } from "@/components/landing/featured-quote-section"
import { GiftSuggestionSection } from "@/components/landing/gift-suggestion-section"
import { QuoteCtaSection } from "@/components/landing/quote-cta-section"
import { FeaturedProductSection } from "@/components/landing/featured-product-section"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-grow">
        <HeroSection />
        <FeaturedCollections />
        <FeaturedQuoteSection />
        <FeaturedProducts />
        <GiftSuggestionSection />
        <BenefitsSection />
        <QuoteCtaSection />
        <FeaturedProductSection />
        <TestimonialsSection />
        <PromoBanner />
        <NewsletterSection />
      </div>
      <Footer />
    </main>
  )
}
