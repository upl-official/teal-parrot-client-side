/**
 * Utility functions for sitemap management
 */

/**
 * Pings search engines to notify them of sitemap updates
 * @param sitemapUrl The full URL to the sitemap
 */
export async function pingSearchEngines(sitemapUrl: string): Promise<void> {
  const searchEngines = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  ]

  try {
    await Promise.all(
      searchEngines.map(async (pingUrl) => {
        const response = await fetch(pingUrl)
        console.log(`Pinged ${pingUrl} - Status: ${response.status}`)
      }),
    )
    console.log("Successfully pinged search engines about sitemap update")
  } catch (error) {
    console.error("Error pinging search engines:", error)
  }
}

/**
 * Validates a sitemap XML against the sitemap protocol
 * @param xml The sitemap XML content
 * @returns True if valid, false otherwise
 */
export function validateSitemapXml(xml: string): boolean {
  // Basic validation - check for required elements
  const requiredElements = ["urlset", "url", "loc"]

  return requiredElements.every((element) => xml.includes(`<${element}`))
}
