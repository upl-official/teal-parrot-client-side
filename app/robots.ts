export const dynamic = "force-dynamic"

import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tealparrot.com"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/checkout/", "/account/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
