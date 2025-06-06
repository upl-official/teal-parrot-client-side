"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Form } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { loginUser, useAuthStore } from "@/lib/auth"
import { AuthLayout } from "./auth-layout"
import { AnimatedFormField } from "./animated-form-field"
import { TRANSITION_NORMAL } from "@/lib/animation-config"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm({ redirectUrl = "/account" }: { redirectUrl?: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })
  const [resendTimer, setResendTimer] = useState(0)
  const [hasSuccessfulSend, setHasSuccessfulSend] = useState(false)
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Timer effect for resend functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      // Updated to handle both user and token
      const { user, token } = await loginUser(data.email, data.password)
      login(user, token)

      // Redirect to the specified URL or default to account page
      if (redirectUrl) {
        router.push(redirectUrl)
      } else {
        router.push("/account")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  async function sendForgotPasswordRequest(email: string) {
    try {
      const response = await fetch("https://backend-project-r734.onrender.com/api/v1/users/password/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const responseData = await response.json()

      if (response.ok && responseData.success) {
        setForgotPasswordStatus({
          type: "success",
          message:
            "We've sent a password reset link to your email. If you don't see it in your inbox, please check your spam or junk folder.",
        })
        setHasSuccessfulSend(true)
        // Start the 30-second timer
        setResendTimer(30)
      } else {
        // Handle error cases
        let errorMessage = "Failed to send reset link. Please try again."

        if (responseData.errors && responseData.errors.length > 0) {
          const errorMsg = responseData.errors[0].message
          if (errorMsg.toLowerCase().includes("user not found") || errorMsg.toLowerCase().includes("not found")) {
            errorMessage = "No account is associated with this email. Please try again with a different email address."
          } else {
            errorMessage = errorMsg
          }
        } else if (responseData.message) {
          errorMessage = responseData.message
        }

        setForgotPasswordStatus({
          type: "error",
          message: errorMessage,
        })
        setHasSuccessfulSend(false)
      }
    } catch (err) {
      console.error("Forgot password error:", err)
      setForgotPasswordStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      })
      setHasSuccessfulSend(false)
    }
  }

  async function onForgotPasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setForgotPasswordStatus({ type: null, message: "" })

    await sendForgotPasswordRequest(forgotPasswordEmail)
    setIsLoading(false)
  }

  function resetForgotPasswordState() {
    setIsForgotPasswordMode(false)
    setForgotPasswordStatus({ type: null, message: "" })
    setForgotPasswordEmail("")
    setResendTimer(0)
    setHasSuccessfulSend(false)
  }

  // Dynamic button text and state logic
  const getButtonText = () => {
    if (isLoading) {
      return hasSuccessfulSend ? "Resending..." : "Sending..."
    }

    if (!hasSuccessfulSend) {
      return "Send Reset Link"
    }

    if (resendTimer > 0) {
      return `Resend Email (${resendTimer})`
    }

    return "Resend Email"
  }

  const isButtonDisabled = () => {
    return isLoading || !forgotPasswordEmail.trim() || resendTimer > 0
  }

  return (
    <AuthLayout
      title={isForgotPasswordMode ? "Reset Password" : "Welcome Back"}
      subtitle={
        isForgotPasswordMode
          ? "Enter your email address and we'll send you a reset link"
          : "Enter your credentials to access your account"
      }
      isLoginPage={true}
    >
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

      {!isForgotPasswordMode ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <AnimatedFormField
              form={form}
              name="email"
              label="Email"
              placeholder="your.email@example.com"
              index={0}
              required
            />

            <AnimatedFormField
              form={form}
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
              index={1}
              required
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, ...TRANSITION_NORMAL }}
              className="flex justify-end"
            >
              <button
                type="button"
                onClick={() => setIsForgotPasswordMode(true)}
                className="text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
              >
                Forgot password?
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, ...TRANSITION_NORMAL }}
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
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </motion.div>
          </form>
        </Form>
      ) : (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={TRANSITION_NORMAL}>
          {forgotPasswordStatus.type && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={TRANSITION_NORMAL}
              className="mb-6"
            >
              <Alert variant={forgotPasswordStatus.type === "error" ? "destructive" : "default"}>
                {forgotPasswordStatus.type === "success" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{forgotPasswordStatus.message}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <form onSubmit={onForgotPasswordSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ...TRANSITION_NORMAL }}
            >
              <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="forgot-email"
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ...TRANSITION_NORMAL }}
              className="flex gap-3"
            >
              <motion.button
                type="button"
                onClick={resetForgotPasswordState}
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 py-2.5 px-4 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Back to Login
              </motion.button>

              <motion.button
                type="submit"
                className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isButtonDisabled()
                    ? "bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    : "bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-500"
                }`}
                disabled={isButtonDisabled()}
                whileHover={!isButtonDisabled() ? { scale: 1.01 } : {}}
                whileTap={!isButtonDisabled() ? { scale: 0.99 } : {}}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                    {getButtonText()}
                  </span>
                ) : (
                  getButtonText()
                )}
              </motion.button>
            </motion.div>

            {/* Additional help text for resend functionality */}
            {hasSuccessfulSend && resendTimer === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, ...TRANSITION_NORMAL }}
                className="text-center"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Didn't receive the email? Check your spam folder or click resend.
                </p>
              </motion.div>
            )}
          </form>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, ...TRANSITION_NORMAL }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  )
}
