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

export const formatPrice = (amount: number) => {
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  })
}
