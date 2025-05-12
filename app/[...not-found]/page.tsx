export default function NotFoundCatchAll() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          We couldn't find the page you're looking for. The page may have been moved, deleted, or never existed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
    </div>
  )
}

export function generateStaticParams() {
  return [{ "not-found": ["404"] }]
}

export function generateMetadata() {
  return {
    title: "404 - Page Not Found | Teal Parrot",
    description: "We couldn't find the page you're looking for.",
  }
}
