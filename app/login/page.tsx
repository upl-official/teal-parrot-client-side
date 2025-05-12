import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | Teal Parrot",
  description: "Sign in to your Teal Parrot account to access your orders, wishlist, and more.",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Get the redirect URL from query parameters - properly awaited
  const redirect = searchParams.redirect
  const redirectUrl = redirect ? String(redirect) : "/account"

  return <LoginForm redirectUrl={redirectUrl} />
}
