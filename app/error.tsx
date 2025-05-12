"use client"

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
      <p className="text-gray-600 mb-8 max-w-md">We apologize for the inconvenience. Please try again later.</p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="px-4 py-2 border border-teal-600 text-teal-600 rounded hover:bg-teal-50 transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  )
}
