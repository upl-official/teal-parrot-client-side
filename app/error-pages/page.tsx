import Link from "next/link"

export default function ErrorPagesIndex() {
  const errorPages = [
    { code: "400", name: "Bad Request", path: "/error-pages/400" },
    { code: "401", name: "Unauthorized", path: "/error-pages/401" },
    { code: "403", name: "Forbidden", path: "/error-pages/403" },
    { code: "404", name: "Not Found", path: "/[...not-found]" },
    { code: "500", name: "Server Error", path: "/error-pages/500" },
    { code: "504", name: "Gateway Timeout", path: "/error-pages/timeout" },
    { code: "Maintenance", name: "Scheduled Maintenance", path: "/error-pages/maintenance" },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Error Pages</h1>
        <p className="text-gray-600 mb-8">
          This is a collection of error pages for the Teal Parrot e-commerce site. These pages are designed to provide a
          better user experience when errors occur.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {errorPages.map((page) => (
            <Link
              href={page.path}
              key={page.code}
              className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="font-bold text-xl mb-2">{page.code}</div>
              <div className="text-gray-600">{page.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function generateMetadata() {
  return {
    title: "Error Pages | Teal Parrot",
    description: "A collection of error pages for the Teal Parrot e-commerce site.",
  }
}
