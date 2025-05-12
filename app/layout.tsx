import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat, Antic_Didone } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TransitionProvider } from "@/lib/transition-context"
import { ScrollProvider } from "@/lib/scroll-context"
import { ScrollToTop } from "@/components/scroll-to-top"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })
const anticDidone = Antic_Didone({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-antic-didone",
})

export const metadata: Metadata = {
  title: "Teal Parrot | Silver Jewelry",
  description: "Discover exquisite silver jewelry at Teal Parrot",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} ${anticDidone.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ScrollProvider>
            <TransitionProvider>
              {children}
              <ScrollToTop />
            </TransitionProvider>
          </ScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
