"use client"

import type React from "react"

import { AccountSidebar } from "@/components/account/account-sidebar"
import { AccountNavigationProvider } from "@/lib/account-navigation-context"

export function AccountLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <AccountNavigationProvider>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <AccountSidebar />
          </div>
          <div className="w-full md:w-3/4">{children}</div>
        </div>
      </div>
    </AccountNavigationProvider>
  )
}
