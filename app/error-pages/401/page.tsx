export default function Custom401Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-orange-600 mb-4">401</h1>
        <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
        <p className="text-gray-600 mb-8">
          You need to be logged in to access this page. Please sign in with your account credentials.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/login" className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
            Sign In
          </a>
          <a href="/signup" className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            Create Account
          </a>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata() {
  return {
    title: "401 - Authentication Required | Teal Parrot",
    description: "You need to be logged in to access this page.",
  }
}
