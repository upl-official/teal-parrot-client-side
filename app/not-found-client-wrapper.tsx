"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Fallback UI that closely matches the final UI to prevent layout shifts
function NotFoundFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-teal-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        We couldn't find the page you were looking for. It might have been moved or doesn't exist.
      </p>
      <div className="h-10 w-32 bg-teal-600 rounded-md animate-pulse"></div>
    </div>
  )
}

// Import the client component with dynamic import to ensure proper client-side loading
const NotFoundClient = dynamic(() => import("@/components/not-found-client"), {
  ssr: false, // Disable SSR for this component to avoid hydration issues
  loading: () => <NotFoundFallback />,
})

export default function NotFoundClientWrapper() {
  return (
    <Suspense fallback={<NotFoundFallback />}>
      <NotFoundClient />
    </Suspense>
  )
}
