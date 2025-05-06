"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, User, Mail, MessageSquare, Send } from "lucide-react"
import { submitContactForm } from "@/lib/api"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactSchema>

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [characterCount, setCharacterCount] = useState(0)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    mode: "onChange", // Enable real-time validation
  })

  // Update character count when message changes
  useEffect(() => {
    const message = form.watch("message")
    setCharacterCount(message?.length || 0)
  }, [form.watch("message")])

  async function onSubmit(data: ContactFormValues) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await submitContactForm(data)
      setSuccess("Your message has been sent successfully. We'll get back to you soon!")
      form.reset()
      setCharacterCount(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.")
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="space-y-6">
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Alert variant="destructive" className="border-red-300 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Alert className="border-green-300 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <Form {...form}>
        <motion.form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base">
                    <User className="h-4 w-4 text-teal-500" />
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Full Name"
                        {...field}
                        className={`pl-10 transition-all ${
                          form.formState.errors.name
                            ? "border-red-300 focus-visible:ring-red-200"
                            : form.formState.dirtyFields.name
                              ? "border-green-300 focus-visible:ring-green-200"
                              : ""
                        }`}
                      />
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base">
                    <Mail className="h-4 w-4 text-teal-500" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="your.email@email.com"
                        type="email"
                        {...field}
                        className={`pl-10 transition-all ${
                          form.formState.errors.email
                            ? "border-red-300 focus-visible:ring-red-200"
                            : form.formState.dirtyFields.email
                              ? "border-green-300 focus-visible:ring-green-200"
                              : ""
                        }`}
                      />
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base">
                    <MessageSquare className="h-4 w-4 text-teal-500" />
                    Subject
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Inquiry about your products"
                        {...field}
                        className={`pl-10 transition-all ${
                          form.formState.errors.subject
                            ? "border-red-300 focus-visible:ring-red-200"
                            : form.formState.dirtyFields.subject
                              ? "border-green-300 focus-visible:ring-green-200"
                              : ""
                        }`}
                      />
                      <MessageSquare className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base">
                    <MessageSquare className="h-4 w-4 text-teal-500" />
                    Your Message
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Please provide details about your inquiry..."
                        className={`min-h-[180px] resize-none pl-10 transition-all ${
                          form.formState.errors.message
                            ? "border-red-300 focus-visible:ring-red-200"
                            : form.formState.dirtyFields.message
                              ? "border-green-300 focus-visible:ring-green-200"
                              : ""
                        }`}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          setCharacterCount(e.target.value.length)
                        }}
                      />
                      <MessageSquare className="absolute left-3 top-6 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <div className="flex justify-between text-xs text-gray-500">
                    <FormMessage />
                    <span className={characterCount < 10 ? "text-red-500" : "text-gray-500"}>
                      {characterCount} characters (minimum 10)
                    </span>
                  </div>
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="pt-2">
            <Button
              type="submit"
              className="group relative w-full overflow-hidden bg-teal-500 px-8 py-6 text-base font-medium hover:bg-teal-600"
              disabled={isLoading}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
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
                    Sending Message...
                  </>
                ) : (
                  <>
                    Send Message <Send className="h-4 w-4" />
                  </>
                )}
              </span>
              <span className="absolute left-0 top-0 h-full w-0 bg-teal-600 transition-all duration-300 ease-out group-hover:w-full"></span>
            </Button>
          </motion.div>
        </motion.form>
      </Form>
    </div>
  )
}
