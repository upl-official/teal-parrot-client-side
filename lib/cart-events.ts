// Custom event for cart updates
export function dispatchCartUpdateEvent() {
  if (typeof window !== "undefined") {
    const event = new Event("cart-updated")
    window.dispatchEvent(event)
  }
}

// Custom event for wishlist updates
export function dispatchWishlistUpdateEvent() {
  if (typeof window !== "undefined") {
    const event = new Event("wishlist-updated")
    window.dispatchEvent(event)
  }
}
