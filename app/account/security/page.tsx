"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AnimatedContainer } from "@/components/animated/animated-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { AlertCircle, Shield, Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateUserPassword } from "@/lib/api"
import { useAuthStore } from "@/lib/auth"

// Password validation schema with robust requirements
const passwordRequirements = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecial: /[!@#$%^&*]/,
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
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
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type PasswordFormValues = z.infer<typeof passwordSchema>

export default function SecurityPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
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

  const { user } = useAuthStore()

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  // Watch the new password field to provide real-time feedback
  const newPassword = form.watch("newPassword")

  // Update password strength indicators in real-time
  useEffect(() => {
    if (newPassword) {
      setPasswordStrength({
        minLength: newPassword.length >= passwordRequirements.minLength,
        hasUppercase: passwordRequirements.hasUppercase.test(newPassword),
        hasLowercase: passwordRequirements.hasLowercase.test(newPassword),
        hasNumber: passwordRequirements.hasNumber.test(newPassword),
        hasSpecial: passwordRequirements.hasSpecial.test(newPassword),
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
  }, [newPassword])

  async function onSubmit(data: PasswordFormValues) {
    if (!user?._id) {
      setSubmitError("User not found. Please log in again.")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      await updateUserPassword(user._id, data.currentPassword, data.newPassword)
      setSubmitSuccess(true)
      form.reset()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to update password. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render a requirement indicator
  const RequirementIndicator = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-gray-400" />}
      <span className={met ? "text-green-700" : "text-gray-600"}>{text}</span>
    </div>
  )

  return (
    <AnimatedContainer animation="fade" animationKey="security-page">
      <h1 className="text-2xl font-bold mb-6">Security Settings</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-teal-500" />
            Change Password
          </CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          {submitError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {submitSuccess && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">Password updated successfully!</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                layout
              >
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter your current password"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                layout
              >
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />

                      {/* Password requirements feedback */}
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium text-gray-700 mb-2">Password requirements:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <RequirementIndicator
                            met={passwordStrength.minLength}
                            text={`At least ${passwordRequirements.minLength} characters`}
                          />
                          <RequirementIndicator
                            met={passwordStrength.hasUppercase}
                            text="At least one uppercase letter"
                          />
                          <RequirementIndicator
                            met={passwordStrength.hasLowercase}
                            text="At least one lowercase letter"
                          />
                          <RequirementIndicator met={passwordStrength.hasNumber} text="At least one number" />
                          <RequirementIndicator
                            met={passwordStrength.hasSpecial}
                            text="At least one special character (!@#$%^&*)"
                          />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                layout
              >
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your new password"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <div className="pt-2">
                <Button type="submit" className="bg-teal-500 hover:bg-teal-600" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-teal-500" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <Shield className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Two-factor authentication is not enabled yet</p>
            <Button disabled className="bg-teal-500 hover:bg-teal-600">
              Enable 2FA
            </Button>
          </div>
        </CardContent>
      </Card>
    </AnimatedContainer>
  )
}
