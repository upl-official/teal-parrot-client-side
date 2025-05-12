export default function CatchAllNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-teal-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        We couldn't find the page you were looking for. It might have been moved or doesn't exist.
      </p>
      <a href="/" className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors">
        Return to Home
      </a>
    </div>
  )
}

export function generateStaticParams() {
  return [{ "not-found": ["404"] }]
}
