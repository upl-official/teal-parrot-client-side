"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Form } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { registerUser, useAuthStore } from "@/lib/auth"
import { AuthLayout } from "./auth-layout"
import { AnimatedFormField } from "./animated-form-field"
import { TRANSITION_NORMAL } from "@/lib/animation-config"

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SignupFormValues = z.infer<typeof signupSchema>

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Show success animation briefly before redirecting
      setSuccess(true)

      // Updated to handle both user and token
      const { user, token } = await registerUser(data.name, data.email, data.password, data.phone)

      // Short delay to show success state
      setTimeout(() => {
        login(user, token)
        router.push("/account")
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
      setSuccess(false)
    } finally {
      if (!success) {
        setIsLoading(false)
      }
    }
  }

  return (
    <AuthLayout title="Create an Account" subtitle="Join us to explore our exclusive collection" isLoginPage={false}>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={TRANSITION_NORMAL}
          className="mb-6"
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={TRANSITION_NORMAL}
          className="mb-6"
        >
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Account created successfully! Redirecting...</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <AnimatedFormField form={form} name="name" label="Full Name" placeholder="John Doe" index={0} required />

          <AnimatedFormField
            form={form}
            name="email"
            label="Email"
            placeholder="your.email@example.com"
            index={1}
            required
          />

          <AnimatedFormField
            form={form}
            name="phone"
            label="Phone Number"
            placeholder="1234567890"
            index={2}
            required
          />

          <AnimatedFormField
            form={form}
            name="password"
            label="Password"
            placeholder="••••••••"
            type="password"
            index={3}
            required
          />

          <AnimatedFormField
            form={form}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="••••••••"
            type="password"
            index={4}
            required
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, ...TRANSITION_NORMAL }}
            className="pt-2"
          >
            <motion.button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2.5 px-4 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  {success ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Success!
                    </>
                  ) : (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </>
                  )}
                </span>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </motion.div>
        </form>
      </Form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, ...TRANSITION_NORMAL }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  )
}
