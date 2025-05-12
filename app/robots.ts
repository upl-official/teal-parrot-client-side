export const dynamic = "force-static"

import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tealparrot.com"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/checkout/", "/account/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
