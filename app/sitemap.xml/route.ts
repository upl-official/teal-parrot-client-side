export const dynamic = "force-static"

export async function GET(): Promise<Response> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tealparrot.com"

  // Define static routes
  const staticRoutes = [
    "",
    "/collection",
    "/brand",
    "/guide",
    "/contact",
    "/login",
    "/signup",
    "/cart",
    "/wishlist",
    "/checkout",
    "/account",
    "/account/profile",
    "/account/orders",
    "/account/addresses",
    "/account/payment",
    "/account/security",
    "/account/notifications",
    "/terms-and-conditions",
    "/privacy-policy",
    "/terms-of-use",
  ]

  // Generate sitemap XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  // Add static routes
  staticRoutes.forEach((route) => {
    xml += "  <url>\n"
    xml += `    <loc>${baseUrl}${route}</loc>\n'
    xml += '    <changefreq>weekly</changefreq>\n'
    xml += '    <priority>0.8</priority>\n'
    xml += '  </url>\n'
  })
  
  // Add product routes (using mock data for static export)
  const productIds = [
    "silver-nose-ring-1",
    "silver-earrings-1",
    "silver-bracelet-1",
    "silver-necklace-1",
    "silver-anklet-1",
    "silver-ring-1",
    "silver-pendant-1",
    "silver-chain-1",
    "silver-bangle-1",
    "silver-charm-1"
  ]
  
  productIds.forEach(id => {
    xml += '  <url>\n'
    xml += \`    <loc>${baseUrl}/product/${id}</loc>\n'
    xml += '    <changefreq>weekly</changefreq>\n'
    xml += '    <priority>0.7</priority>\n'
    xml += '  </url>\n'
  })
  
  // Add category routes
  const categories = [
    "nose-rings",
    "earrings",
    "bracelets",
    "necklaces",
    "anklets",
    "rings",
    "pendants"
  ]
  
  categories.forEach(category => {
    xml += '  <url>\n'
    xml += \`    <loc>${baseUrl}/collection/${category}</loc>\n`
    xml += "    <changefreq>weekly</changefreq>\n"
    xml += "    <priority>0.7</priority>\n"
    xml += "  </url>\n"
  })

  xml += "</urlset>"

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
