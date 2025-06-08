import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Redirects the user to the login page with a redirect URL
 * @param currentPath The current path to redirect back to after login
 */
export function redirectToLogin(currentPath: string): void {
  if (typeof window !== "undefined") {
    // Client-side redirect
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price according to the following rules:
 * - If decimal places are zero or first two decimal places are zero, round to nearest whole number
 * - Otherwise, display with exactly two decimal places
 */
export const formatPrice = (amount: number) => {
  if (!amount && amount !== 0) return "₹0"

  // Check if the decimal part is zero or if the first two decimal places are zero
  const decimalPart = amount - Math.floor(amount)
  const firstTwoDecimals = Math.round(decimalPart * 100) / 100

  if (decimalPart === 0 || firstTwoDecimals === 0) {
    // Round to nearest whole number
    return `₹${Math.round(amount).toLocaleString("en-IN")}`
  } else {
    // Display with exactly two decimal places
    return `₹${amount.toFixed(2).toLocaleString("en-IN")}`
  }
}
