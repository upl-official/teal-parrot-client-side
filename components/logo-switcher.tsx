"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface LogoSwitcherProps {
  darkLogo: string
  lightLogo: string
  alt: string
  width: number
  height: number
  className?: string
}

export function LogoSwitcher({ darkLogo, lightLogo, alt, width, height, className = "" }: LogoSwitcherProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check if the user has a dark mode preference
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setIsDarkMode(darkModeMediaQuery.matches)

    // Listen for changes in the color scheme preference
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    darkModeMediaQuery.addEventListener("change", handleChange)
    return () => darkModeMediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Also check for .dark class on html element (for theme toggle)
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark")
      setIsDarkMode(isDark)
    }

    // Initial check
    checkTheme()

    // Set up a MutationObserver to watch for class changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkTheme()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  return (
    <Image
      src={isDarkMode ? lightLogo : darkLogo}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
    />
  )
}
