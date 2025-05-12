import type React from "react"
export default function ErrorPagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>{children}</main>
    </div>
  )
}

export function generateMetadata() {
  return {
    title: "Error | Teal Parrot",
  }
}
