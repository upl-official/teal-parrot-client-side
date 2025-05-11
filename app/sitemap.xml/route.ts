export const dynamic = "force-static"

import { fetchCategories, fetchProducts } from "@/lib/api"

// Base URL for the site
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://teal-parrot.vercel.app"

// Current date in ISO format for lastmod
const currentDate = new Date().toISOString()

export async function GET(): Promise<Response> {
  try {
    // Fetch dynamic data for the sitemap
    const [categories, products] = await Promise.all([
      fetchCategories().catch(() => []),
      fetchProducts().catch(() => []),
    ])

    // Create XML content
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${BASE_URL}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/collection</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/brand</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guide</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${BASE_URL}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${BASE_URL}/login</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${BASE_URL}/signup</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${BASE_URL}/cart</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${BASE_URL}/wishlist</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${BASE_URL}/resources</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${BASE_URL}/privacy-policy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${BASE_URL}/terms-of-use</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${BASE_URL}/terms-and-conditions</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>

  <!-- Dynamic Category Pages -->
  ${categories
    .map(
      (category) => `
  <url>
    <loc>${BASE_URL}/collection?category=${encodeURIComponent(category._id)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
    )
    .join("")}

  <!-- Dynamic Product Pages -->
  ${products
    .map(
      (product) => `
  <url>
    <loc>${BASE_URL}/product/${encodeURIComponent(product._id)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
    )
    .join("")}
</urlset>`

    // Return the XML with appropriate headers
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("Error generating sitemap:", error)

    // Return a basic sitemap with just static pages if there's an error
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/collection</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/brand</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guide</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${BASE_URL}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.7</priority>
  </url>
</urlset>`

    return new Response(fallbackXml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  }
}
