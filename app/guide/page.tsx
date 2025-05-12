import { PageLayout } from "@/components/page-layout"
import GuidePageClient from "./GuidePageClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Size & Care Guide | Teal Parrot",
  description: "Learn how to measure for the perfect fit and properly care for your silver jewelry.",
}

export default function GuidePage() {
  return (
    <PageLayout>
      <GuidePageClient />
    </PageLayout>
  )
}
