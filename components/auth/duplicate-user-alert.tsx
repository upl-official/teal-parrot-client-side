"use client"

import { motion } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { UserX, LogIn, Mail } from "lucide-react"
import Link from "next/link"
import { TRANSITION_NORMAL } from "@/lib/animation-config"

interface DuplicateUserAlertProps {
  email: string
  onTryDifferentEmail: () => void
}

export function DuplicateUserAlert({ email, onTryDifferentEmail }: DuplicateUserAlertProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={TRANSITION_NORMAL}
      className="mb-6"
    >
      <Alert className="bg-amber-50 border-amber-200 text-amber-800 shadow-lg">
        <UserX className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-base mb-2">Account Already Exists</p>
              <p className="text-sm leading-relaxed">
                An account with the email address{" "}
                <span className="font-medium bg-amber-100 px-2 py-1 rounded">{email}</span> already exists in our
                system.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href={`/login?email=${encodeURIComponent(email)}`} className="flex-1">
                <Button variant="default" className="w-full bg-teal-600 hover:bg-teal-700 text-white" size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In Instead
                </Button>
              </Link>

              <Button
                variant="outline"
                onClick={onTryDifferentEmail}
                className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-100"
                size="sm"
              >
                <Mail className="mr-2 h-4 w-4" />
                Use Different Email
              </Button>
            </div>

            <div className="text-xs text-amber-700 bg-amber-100 p-3 rounded-md">
              <p className="font-medium mb-1">💡 What you can do:</p>
              <ul className="space-y-1 ml-4">
                <li>• Click "Sign In Instead" to log in with your existing account</li>
                <li>• Click "Use Different Email" to register with a new email address</li>
                <li>• If you forgot your password, you can reset it on the login page</li>
              </ul>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </motion.div>
  )
}
