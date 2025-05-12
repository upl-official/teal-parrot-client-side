"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        An unexpected error occurred. Please try again or contact support if the problem persists.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="outline">
          Try again
        </Button>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}
