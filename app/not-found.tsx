export const dynamic = "force-static"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        We couldn't find the page you're looking for. The page may have been moved, deleted, or never existed.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a href="/" className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
          Return to Home
        </a>
        <a
          href="/collection"
          className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Browse Collection
        </a>
      </div>
    </div>
  )
}
