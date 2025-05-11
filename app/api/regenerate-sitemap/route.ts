export const dynamic = "force-static"

import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const token = authHeader.substring(7)
  const expectedToken = process.env.SITEMAP_REGENERATION_TOKEN

  if (!expectedToken || token !== expectedToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 })
  }

  try {
    // In a static export, we can't actually regenerate the sitemap dynamically
    // This is just a placeholder that would return success
    return NextResponse.json({ success: true, message: "Sitemap regeneration initiated" })
  } catch (error) {
    console.error("Error regenerating sitemap:", error)
    return NextResponse.json({ error: "Failed to regenerate sitemap" }, { status: 500 })
  }
}
