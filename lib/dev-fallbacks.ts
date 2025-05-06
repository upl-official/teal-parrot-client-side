import type { WishlistItem } from "./types"

// Fallback data for development environment
export const DEV_MODE = process.env.NODE_ENV === "development"

// Fallback wishlist items
export const FALLBACK_WISHLIST_ITEMS: WishlistItem[] = [
  {
    product: {
      _id: "fallback-product-1",
      name: "Silver Filigree Earrings",
      price: 1299,
      description: "Delicate silver filigree earrings with intricate patterns",
      category: "Earrings",
      material: "Silver",
      grade: "925 Sterling",
      images: ["/delicate-silver-earrings.png"],
    },
  },
  {
    product: {
      _id: "fallback-product-2",
      name: "Silver Nose Ring",
      price: 899,
      description: "Traditional silver nose ring with detailed craftsmanship",
      category: "Nose Rings",
      material: "Silver",
      grade: "925 Sterling",
      images: ["/silver-nose-ring-close-up.png"],
    },
  },
]

// Function to get fallback data in development mode
export function getFallbackWishlistItems(): WishlistItem[] {
  if (DEV_MODE) {
    console.info("Using fallback wishlist data for development")
    return FALLBACK_WISHLIST_ITEMS
  }
  return []
}
