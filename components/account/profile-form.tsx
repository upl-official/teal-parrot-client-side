"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, Loader2, LogOut } from "lucide-react"
import { useAuthStore, updateUserProfile } from "@/lib/auth"
import { AnimatedContainer } from "@/components/animated/animated-container"

// Update the profileSchema to make email read-only
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showReloginDialog, setShowReloginDialog] = useState(false)
  const { user, updateUser, getToken, logout } = useAuthStore()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone?.toString() || "",
    },
  })

  // Handle logout and redirect
  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Update the onSubmit function to show the re-login dialog on success
  async function onSubmit(data: ProfileFormValues) {
    if (!user) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const token = getToken()
      if (!token) {
        throw new Error("Authentication token is missing. Please login again.")
      }

      // Only send name and phone for update
      const updatedUser = await updateUserProfile(
        user._id,
        {
          name: data.name,
          phone: data.phone,
        },
        token,
      )

      updateUser(updatedUser)
      setSuccess("Profile updated successfully")

      // Show the re-login dialog
      setShowReloginDialog(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <AnimatedContainer className="space-y-6">
      {/* Re-login Dialog */}
      <Dialog open={showReloginDialog} onOpenChange={setShowReloginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Updated Successfully</DialogTitle>
            <DialogDescription>
              Your profile has been updated. Please log in again to see the changes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button onClick={handleLogout} className="bg-teal-500 hover:bg-teal-600 transition-all">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {success && !showReloginDialog && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <Form {...form}>
        <motion.form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={formItemVariants}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Update the email field to be disabled with a note */}
          <motion.div variants={formItemVariants}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Cannot be changed)</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} disabled />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    Email address is permanent and cannot be changed.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={formItemVariants}>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={formItemVariants}>
            <Button type="submit" className="bg-teal-500 hover:bg-teal-600 transition-all" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </motion.div>
        </motion.form>
      </Form>
    </AnimatedContainer>
  )
}
