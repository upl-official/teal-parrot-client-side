import type { Metadata } from "next"
import { SignupForm } from "@/components/auth/signup-form"

export const metadata: Metadata = {
  title: "Sign Up | Teal Parrot",
  description: "Create a Teal Parrot account to start shopping our exclusive collection of handcrafted silver jewelry.",
}

export default function SignupPage() {
  return <SignupForm />
}
