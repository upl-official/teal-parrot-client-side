import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    host: process.env.NEXT_PUBLIC_SITE_URL || "https://teal-parrot.com",
  }
}
