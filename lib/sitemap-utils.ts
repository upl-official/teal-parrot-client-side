export async function getSitemapXml() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tealparrot.com"

  // Static routes
  const staticRoutes = [
    "",
    "/collection",
    "/brand",
    "/guide",
    "/contact",
    "/login",
    "/signup",
    "/resources",
    "/terms-and-conditions",
    "/terms-of-use",
    "/privacy-policy",
  ]

  // Product routes - in a real app, these would be fetched from an API
  const productIds = [
    "silver-nose-ring-1",
    "silver-earrings-1",
    "silver-bracelet-1",
    "silver-necklace-1",
    "silver-anklet-1",
  ]

  // Collection routes
  const collectionSlugs = ["nose-rings", "earrings", "bracelets", "necklaces", "anklets"]

  // Generate URLs for static routes
  const staticUrls = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }))

  // Generate URLs for product routes
  const productUrls = productIds.map((id) => ({
    url: `${siteUrl}/product/${id}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  // Generate URLs for collection routes
  const collectionUrls = collectionSlugs.map((slug) => ({
    url: `${siteUrl}/collection/${slug}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  // Combine all URLs
  const allUrls = [...staticUrls, ...productUrls, ...collectionUrls]

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      (url) => `
  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
    )
    .join("")}
</urlset>`

  return xml
}
