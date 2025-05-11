"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h1 className="text-6xl font-bold text-red-600 mb-4">Error</h1>
          <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-8 max-w-md">We apologize for the inconvenience. Please try again later.</p>
          <div className="flex gap-4">
            <Button onClick={reset}>Try Again</Button>
            <Button asChild variant="outline">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
