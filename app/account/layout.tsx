import type React from "react"
import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthGuard } from "@/lib/auth-utils"
import { AccountLayoutClient } from "@/components/account/account-layout-client"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <AuthGuard>
          <Suspense fallback={<div className="p-8 text-center">Loading account...</div>}>
            <AccountLayoutClient>{children}</AccountLayoutClient>
          </Suspense>
        </AuthGuard>
      </main>
      <Footer />
    </div>
  )
}
