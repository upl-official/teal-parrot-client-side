// Smooth scroll to element by ID
export function scrollToElement(elementId: string, offset = 0) {
  if (typeof window !== "undefined") {
    const element = document.getElementById(elementId)
    if (element) {
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }
}

// Smooth scroll to top
export function scrollToTop() {
  if (typeof window !== "undefined") {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
}

// Check if element is in viewport
export function isInViewport(element: HTMLElement): boolean {
  if (typeof window !== "undefined") {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }
  return false
}
