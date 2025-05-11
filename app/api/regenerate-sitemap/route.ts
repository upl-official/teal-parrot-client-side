import { pingSearchEngines } from "@/lib/sitemap-utils"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check for authorization - this should be a secure token in production
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    // In production, compare with a secure environment variable
    if (token !== process.env.SITEMAP_REGENERATION_TOKEN) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 })
    }

    // Force clear the cache for the sitemap
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://teal-parrot.vercel.app"
    const sitemapUrl = `${baseUrl}/sitemap.xml`

    // Fetch the sitemap to regenerate it
    await fetch(sitemapUrl, { cache: "no-store" })

    // Ping search engines about the update
    await pingSearchEngines(sitemapUrl)

    return NextResponse.json({ success: true, message: "Sitemap regenerated successfully" })
  } catch (error) {
    console.error("Error regenerating sitemap:", error)
    return NextResponse.json({ error: "Failed to regenerate sitemap" }, { status: 500 })
  }
}
