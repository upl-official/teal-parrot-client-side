"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Check, X, Loader2, CheckCircle } from "lucide-react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { TRANSITION_NORMAL, fadeIn } from "@/lib/animation-config"

export default function ResetPasswordPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  // Password validation
  const validatePassword = (pwd: string) => {
    return {
      minLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*]/.test(pwd),
    }
  }

  const passwordCriteria = validatePassword(password)
  const isPasswordValid = Object.values(passwordCriteria).every(Boolean)
  const doPasswordsMatch = password === confirmPassword && confirmPassword !== ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isPasswordValid) {
      setMessage("Please ensure your password meets all requirements.")
      setMessageType("error")
      return
    }

    if (!doPasswordsMatch) {
      setMessage("Passwords do not match.")
      setMessageType("error")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch(
        `https://backend-project-r734.onrender.com/api/v1/users/password/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: password,
          }),
        },
      )

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage("Password reset successful! Redirecting to login...")
        setMessageType("success")

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        // Handle API errors
        if (data.errors && data.errors.length > 0) {
          setMessage(data.errors[0].message || "Failed to reset password. Please try again.")
        } else if (data.message) {
          setMessage(data.message)
        } else {
          setMessage("Failed to reset password. The reset link may be invalid or expired.")
        }
        setMessageType("error")
      }
    } catch (error) {
      console.error("Reset password error:", error)
      setMessage("Network error. Please check your connection and try again.")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  // Password Strength Indicator Component
  const PasswordStrengthIndicator = () => {
    const requirements = [
      { key: "minLength", label: "At least 8 characters", met: passwordCriteria.minLength },
      { key: "hasUppercase", label: "One uppercase letter (A-Z)", met: passwordCriteria.hasUppercase },
      { key: "hasLowercase", label: "One lowercase letter (a-z)", met: passwordCriteria.hasLowercase },
      { key: "hasNumber", label: "One number (0-9)", met: passwordCriteria.hasNumber },
      { key: "hasSpecialChar", label: "One special character (!@#$%^&*)", met: passwordCriteria.hasSpecialChar },
    ]

    const metCount = Object.values(passwordCriteria).filter(Boolean).length
    const strengthLevel = metCount === 5 ? "Strong" : metCount >= 3 ? "Medium" : "Weak"
    const strengthColor = metCount === 5 ? "text-green-600" : metCount >= 3 ? "text-yellow-600" : "text-red-600"

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={TRANSITION_NORMAL}
        className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Password Strength:</span>
          <span className={`text-sm font-medium ${strengthColor}`}>{strengthLevel}</span>
        </div>

        <div className="space-y-2">
          {requirements.map((req) => (
            <motion.div
              key={req.key}
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, ...TRANSITION_NORMAL }}
            >
              {req.met ? (
                <Check size={16} className="text-green-500 flex-shrink-0" />
              ) : (
                <X size={16} className="text-red-500 flex-shrink-0" />
              )}
              <span
                className={`text-sm ${req.met ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
              >
                {req.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  if (!token) {
    return (
      <AuthLayout title="Invalid Reset Link" subtitle="The password reset link is invalid or missing.">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={TRANSITION_NORMAL}
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-600 dark:text-gray-400">
            Please check your email for a valid reset link or request a new one.
          </p>
          <Button onClick={() => router.push("/login")} variant="outline" className="mt-4">
            Back to Login
          </Button>
        </motion.div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Reset Your Password" subtitle="Enter your new password to secure your account">
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {/* New Password Field */}
        <motion.div className="space-y-2" variants={fadeIn}>
          <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
            New Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              className="pr-12 h-12 text-base border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </motion.div>

        {/* Password Strength Indicator */}
        {password && (
          <motion.div variants={fadeIn}>
            <PasswordStrengthIndicator />
          </motion.div>
        )}

        {/* Confirm Password Field */}
        <motion.div className="space-y-2" variants={fadeIn}>
          <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
            Confirm New Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className="pr-12 h-12 text-base border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Password Match Indicator */}
          {confirmPassword && (
            <motion.div
              className="flex items-center space-x-2 text-sm"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={TRANSITION_NORMAL}
            >
              {doPasswordsMatch ? (
                <>
                  <Check size={16} className="text-green-500" />
                  <span className="text-green-600 dark:text-green-400">Passwords match</span>
                </>
              ) : (
                <>
                  <X size={16} className="text-red-500" />
                  <span className="text-red-600 dark:text-red-400">Passwords do not match</span>
                </>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={fadeIn}>
          <Button
            type="submit"
            className="w-full h-12 text-base bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 transition-all duration-200"
            disabled={isLoading || !isPasswordValid || !doPasswordsMatch}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </motion.div>

        {/* Message Display */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={TRANSITION_NORMAL}
            variants={fadeIn}
          >
            <Alert
              className={
                messageType === "error"
                  ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                  : "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
              }
            >
              {messageType === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
              <AlertDescription
                className={
                  messageType === "error" ? "text-red-800 dark:text-red-200" : "text-green-800 dark:text-green-200"
                }
              >
                {message}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Back to Login Link */}
        <motion.div className="text-center" variants={fadeIn}>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
          >
            Back to Login
          </button>
        </motion.div>
      </motion.form>
    </AuthLayout>
  )
}
