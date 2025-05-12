"use client"

import type React from "react"
import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/animated/page-transition"

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div className="h-[64px] bg-white border-b"></div>}>
        <Header />
      </Suspense>
      <PageTransition>
        <main className="flex-grow">
          <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </PageTransition>
      <Footer />
    </div>
  )
}
