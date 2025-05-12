export default function Custom403Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-amber-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page. If you believe this is an error, please contact our support
          team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/" className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
            Return to Home
          </a>
          <a href="/login" className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            Sign In
          </a>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata() {
  return {
    title: "403 - Access Denied | Teal Parrot",
    description: "You don't have permission to access this page.",
  }
}
