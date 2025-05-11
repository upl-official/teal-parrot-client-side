"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"

export default function NotFoundClient() {
  // Explicitly use the searchParams hook so it's properly handled
  const searchParams = useSearchParams()

  // We can use searchParams if needed, for example to show a custom message
  // based on a query parameter
  const referrer = searchParams.get("from") || ""

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-teal-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        We couldn't find the page you were looking for. It might have been moved or doesn't exist.
        {referrer && ` You came from ${referrer}.`}
      </p>
      <Button asChild>
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  )
}
