export const dynamic = "force-static"

import { getSitemapXml } from "@/lib/sitemap-utils"

export async function GET() {
  const xml = await getSitemapXml()

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}
