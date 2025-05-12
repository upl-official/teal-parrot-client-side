"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"

export default function GlobalNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-teal-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        We couldn't find the page you were looking for. It might have been moved or doesn't exist.
      </p>
      <Suspense fallback={<div className="px-4 py-2 bg-teal-600 text-white rounded">Loading...</div>}>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </Suspense>
    </div>
  )
}
