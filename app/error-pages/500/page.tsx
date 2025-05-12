export default function Custom500Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-red-600 mb-4">500</h1>
        <h2 className="text-2xl font-semibold mb-4">Server Error</h2>
        <p className="text-gray-600 mb-8">
          We're sorry, but something went wrong on our servers. Our team has been notified and is working to fix the
          issue.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/" className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
            Return to Home
          </a>
          <a href="/contact" className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata() {
  return {
    title: "500 - Server Error | Teal Parrot",
    description: "We're sorry, but something went wrong on our servers.",
  }
}
