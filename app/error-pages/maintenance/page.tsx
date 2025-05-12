export default function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-teal-600 mb-4">
          <span className="inline-block animate-spin">⚙️</span>
        </h1>
        <h2 className="text-2xl font-semibold mb-4">Scheduled Maintenance</h2>
        <p className="text-gray-600 mb-8">
          We're currently performing scheduled maintenance on our site. We'll be back shortly. Thank you for your
          patience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://twitter.com/tealparrot"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Status Updates
          </a>
          <a
            href="mailto:support@tealparrot.com"
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Email Support
          </a>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata() {
  return {
    title: "Scheduled Maintenance | Teal Parrot",
    description: "We're currently performing scheduled maintenance on our site.",
  }
}
