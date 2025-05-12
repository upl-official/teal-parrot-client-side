"use client"

import type React from "react"
import { AccountTransitionLayout } from "./account-transition-layout"

interface AccountContentProps {
  children: React.ReactNode
}

export function AccountContent({ children }: AccountContentProps) {
  return <AccountTransitionLayout>{children}</AccountTransitionLayout>
}
