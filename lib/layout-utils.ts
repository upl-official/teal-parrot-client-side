/**
 * Utility functions for layout management
 */

/**
 * Checks for elements causing horizontal overflow and logs them to console
 * Only runs in development mode
 */
export const detectHorizontalOverflow = () => {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "development") return

  const docWidth = document.documentElement.offsetWidth

  // Find all elements
  document.querySelectorAll("*").forEach((element) => {
    const elWidth = element.offsetWidth
    const elLeft = element.getBoundingClientRect().left
    const elRight = elLeft + elWidth

    // Check if element extends beyond viewport
    if (elRight > docWidth || elLeft < 0) {
      console.warn("Element causing horizontal overflow:", element)
      console.log("Element width:", elWidth)
      console.log("Element position:", elLeft, "to", elRight)
      console.log("Document width:", docWidth)
      console.log("Overflow amount:", Math.max(elRight - docWidth, -elLeft))

      // Highlight the element in red for visual debugging
      if (process.env.NODE_ENV === "development") {
        const originalOutline = element.style.outline
        element.style.outline = "2px solid red"

        // Reset after 5 seconds
        setTimeout(() => {
          element.style.outline = originalOutline
        }, 5000)
      }
    }
  })
}
