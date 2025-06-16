"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Form } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, XCircle, Info } from "lucide-react"
import { registerUser, useAuthStore } from "@/lib/auth"
import { AuthLayout } from "./auth-layout"
import { AnimatedFormField } from "./animated-form-field"
import { DuplicateUserAlert } from "./duplicate-user-alert"
import { TRANSITION_NORMAL } from "@/lib/animation-config"

// Password validation requirements
const passwordRequirements = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecial: /[!@#$%^&*]/,
}

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z
      .string()
      .min(passwordRequirements.minLength, `Password must be at least ${passwordRequirements.minLength} characters`)
      .refine((val) => passwordRequirements.hasUppercase.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => passwordRequirements.hasLowercase.test(val), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((val) => passwordRequirements.hasNumber.test(val), {
        message: "Password must contain at least one number",
      })
      .refine((val) => passwordRequirements.hasSpecial.test(val), {
        message: "Password must contain at least one special character (!@#$%^&*)",
      }),
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
  const [needsLogin, setNeedsLogin] = useState<boolean>(false)
  const [isDuplicateUser, setIsDuplicateUser] = useState<boolean>(false)
  const [duplicateEmail, setDuplicateEmail] = useState<string>("")
  const [passwordStrength, setPasswordStrength] = useState<{
    minLength: boolean
    hasUppercase: boolean
    hasLowercase: boolean
    hasNumber: boolean
    hasSpecial: boolean
  }>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  })

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
    mode: "onChange",
  })

  // Watch the password field to provide real-time feedback
  const password = form.watch("password")

  // Update password strength indicators in real-time
  useEffect(() => {
    if (password) {
      setPasswordStrength({
        minLength: password.length >= passwordRequirements.minLength,
        hasUppercase: passwordRequirements.hasUppercase.test(password),
        hasLowercase: passwordRequirements.hasLowercase.test(password),
        hasNumber: passwordRequirements.hasNumber.test(password),
        hasSpecial: passwordRequirements.hasSpecial.test(password),
      })
    } else {
      setPasswordStrength({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false,
      })
    }
  }, [password])

  // Clear duplicate user error when email changes
  useEffect(() => {
    if (isDuplicateUser) {
      setIsDuplicateUser(false)
      setDuplicateEmail("")
      setError(null)
    }
  }, [form.watch("email")])

  const handleTryDifferentEmail = () => {
    setIsDuplicateUser(false)
    setDuplicateEmail("")
    setError(null)
    // Focus on the email field
    const emailField = document.querySelector('input[name="email"]') as HTMLInputElement
    if (emailField) {
      emailField.focus()
      emailField.select()
    }
  }

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setNeedsLogin(false)
    setIsDuplicateUser(false)
    setDuplicateEmail("")

    try {
      console.log("Starting registration process...")

      // Register the user
      const result = await registerUser(data.name, data.email, data.password, data.phone)

      console.log("Registration result:", {
        hasUser: !!result.user,
        hasToken: !!result.token,
        userEmail: result.user?.email,
      })

      // Show success animation
      setSuccess(true)

      // If we have both user and token, log them in automatically
      if (result.user && result.token) {
        console.log("Auto-logging in user after registration...")
        login(result.user, result.token)

        setTimeout(() => {
          router.push("/account")
        }, 1500)
      } else if (result.user) {
        // If we only have user data but no token, show success but require manual login
        console.log("Registration successful but no token received, requiring manual login...")
        setNeedsLogin(true)

        setTimeout(() => {
          router.push("/login?message=Registration successful! Please log in with your credentials.")
        }, 3000)
      } else {
        throw new Error("Registration failed - no user data received")
      }
    } catch (err) {
      console.error("Registration error:", err)
      const errorMessage = err instanceof Error ? err.message : "Registration failed. Please try again."

      // Check if this is a duplicate user error
      if (errorMessage.includes("Duplicate User") || errorMessage.includes("already exists")) {
        setIsDuplicateUser(true)
        setDuplicateEmail(data.email)
      } else if (errorMessage.includes("Please log in") || errorMessage.includes("successful")) {
        // Check if this is a "please login" type message
        setNeedsLogin(true)
        setSuccess(true)
        setTimeout(() => {
          router.push("/login?message=" + encodeURIComponent(errorMessage))
        }, 3000)
      } else {
        setError(errorMessage)
      }

      setIsLoading(false)
    }
  }

  // Render a requirement indicator
  const RequirementIndicator = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-gray-400" />}
      <span className={met ? "text-green-700" : "text-gray-600"}>{text}</span>
    </div>
  )

  return (
    <AuthLayout title="Create an Account" subtitle="Join us to explore our exclusive collection" isLoginPage={false}>
      {/* Duplicate User Alert */}
      {isDuplicateUser && <DuplicateUserAlert email={duplicateEmail} onTryDifferentEmail={handleTryDifferentEmail} />}

      {/* General Error Alert */}
      {error && !isDuplicateUser && (
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

      {/* Success Alert - Auto Login */}
      {success && !needsLogin && !isDuplicateUser && (
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

      {/* Success Alert - Manual Login Required */}
      {success && needsLogin && !isDuplicateUser && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={TRANSITION_NORMAL}
          className="mb-6"
        >
          <Alert className="bg-blue-50 text-blue-800 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Account created successfully! Redirecting to login page...
            </AlertDescription>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, ...TRANSITION_NORMAL }}
          >
            <AnimatedFormField
              form={form}
              name="password"
              label="Password"
              placeholder="••••••••"
              type="password"
              index={3}
              required
            />

            {/* Password requirements feedback */}
            {form.getValues("password") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-2 p-3 bg-gray-50 rounded-md"
              >
                <p className="text-sm font-medium text-gray-700 mb-2">Password requirements:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <RequirementIndicator
                    met={passwordStrength.minLength}
                    text={`At least ${passwordRequirements.minLength} characters`}
                  />
                  <RequirementIndicator met={passwordStrength.hasUppercase} text="At least one uppercase letter" />
                  <RequirementIndicator met={passwordStrength.hasLowercase} text="At least one lowercase letter" />
                  <RequirementIndicator met={passwordStrength.hasNumber} text="At least one number" />
                  <RequirementIndicator
                    met={passwordStrength.hasSpecial}
                    text="At least one special character (!@#$%^&*)"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>

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
                      {needsLogin ? "Redirecting to login..." : "Success!"}
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
