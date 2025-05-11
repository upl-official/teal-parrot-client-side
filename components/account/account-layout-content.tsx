"use client"

import type React from "react"
import { memo } from "react"
import { AccountSidebar } from "@/components/account/account-sidebar"
import { AccountNavigationProvider } from "@/lib/account-navigation-context"
import { AccountContent } from "@/components/account/account-content"

const MemoizedAccountSidebar = memo(AccountSidebar)

export function AccountLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <AccountNavigationProvider>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4 md:sticky md:top-24 self-start">
            <MemoizedAccountSidebar />
          </div>
          <div className="w-full md:w-3/4">
            <AccountContent>{children}</AccountContent>
          </div>
        </div>
      </div>
    </AccountNavigationProvider>
  )
}
