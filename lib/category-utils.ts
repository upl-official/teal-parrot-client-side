import { fetchProducts } from "./api"

/**
 * Fetches the count of products for each category
 * @param categoryIds Array of category IDs to fetch counts for
 * @returns Object mapping category IDs to their product counts
 */
export async function fetchCategoryProductCounts(categoryIds: string[]): Promise<Record<string, number>> {
  try {
    // Create a result object to store counts
    const counts: Record<string, number> = {}

    // If no categories provided, return empty object
    if (!categoryIds || categoryIds.length === 0) {
      return counts
    }

    // Process each category ID
    for (const categoryId of categoryIds) {
      try {
        // Fetch products for this category
        const products = await fetchProducts(categoryId)
        counts[categoryId] = products.length
      } catch (error) {
        console.error(`Error fetching products for category ${categoryId}:`, error)
        counts[categoryId] = 0
      }
    }

    return counts
  } catch (error) {
    console.error("Error fetching category product counts:", error)
    return {}
  }
}

/**
 * Fetches the count of products for a single category
 * @param categoryId Category ID to fetch count for
 * @returns Number of products in the category
 */
export async function fetchCategoryProductCount(categoryId: string): Promise<number> {
  if (!categoryId) return 0

  const counts = await fetchCategoryProductCounts([categoryId])
  return counts[categoryId] || 0
}
