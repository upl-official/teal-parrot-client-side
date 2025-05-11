import { PageLayout } from "@/components/page-layout"
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
    <PageLayout>
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
    </PageLayout>
  )
}
