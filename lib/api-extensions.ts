import { apiRequest } from "./api-core"

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

    // Fetch all products (we'll filter by category)
    const data = await apiRequest<{ success: boolean; data: { products: any[] } }>("/product/list")
    const products = data.data.products

    // Count products for each category
    categoryIds.forEach((categoryId) => {
      const categoryProducts = products.filter(
        (product) => product.category === categoryId || product.categoryId === categoryId,
      )
      counts[categoryId] = categoryProducts.length
    })

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
