import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat, Antic_Didone, Tenor_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TransitionProvider } from "@/lib/transition-context"
import { ScrollProvider } from "@/lib/scroll-context"
import { ScrollToTop } from "@/components/scroll-to-top"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })

const anticDidone = Tenor_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-antic-didone",
})

const tenorSans = Antic_Didone({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-tenor-sans",
})

{/*
const anticDidone = Antic_Didone({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-antic-didone",
})
*/}
{/*
const tenorSans = Tenor_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-tenor-sans",
})
*/}

export const metadata: Metadata = {
  title: "Teal Parrot | Silver Jewelry",
  description: "Discover exquisite silver jewelry at Teal Parrot",
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
    other: [
      {
        rel: "manifest",
        url: "/favicon/site.webmanifest",
      },
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} ${anticDidone.variable} ${tenorSans.variable}`}>
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
