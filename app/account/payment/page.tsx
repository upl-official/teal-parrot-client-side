"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AnimatedContainer } from "@/components/animated/animated-container"
import { CreditCard, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function PaymentPage() {
  return (
    <AnimatedContainer animation="fade" key="payment-page">
      <h1 className="text-2xl font-bold mb-6">Payment Methods</h1>

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          This feature is coming soon. You'll be able to save and manage your payment methods here.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Saved Payment Methods</CardTitle>
          <CardDescription>Securely save your payment information for faster checkout</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CreditCard className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">You don't have any saved payment methods yet</p>
          <Button disabled className="bg-teal-500 hover:bg-teal-600">
            Add Payment Method
          </Button>
        </CardContent>
      </Card>
    </AnimatedContainer>
  )
}
