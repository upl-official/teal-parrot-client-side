export default function TimeoutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-purple-600 mb-4">504</h1>
        <h2 className="text-2xl font-semibold mb-4">Request Timeout</h2>
        <p className="text-gray-600 mb-8">
          The server took too long to respond to your request. This could be due to high traffic or connectivity issues.
          Please try again later.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="javascript:window.location.reload()"
            className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Try Again
          </a>
          <a href="/" className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata() {
  return {
    title: "504 - Request Timeout | Teal Parrot",
    description: "The server took too long to respond to your request.",
  }
}
