"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AnimatedContainer } from "@/components/animated/animated-container"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AlertCircle, Bell, Mail, ShoppingBag, Tag, Gift } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"

export default function NotificationsPage() {
  const [orderUpdates, setOrderUpdates] = useState(true)
  const [promotions, setPromotions] = useState(false)
  const [productAlerts, setProductAlerts] = useState(true)
  const [newsletter, setNewsletter] = useState(false)
  const [accountAlerts, setAccountAlerts] = useState(true)

  return (
    <AnimatedContainer animation="fade" key="notifications-page">
      <h1 className="text-2xl font-bold mb-6">Notification Preferences</h1>

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          This feature is coming soon. Your preferences will be saved when the feature is fully implemented.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Manage the emails you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <Label htmlFor="order-updates" className="font-medium">
                  Order Updates
                </Label>
                <p className="text-sm text-gray-500">Receive notifications about your orders</p>
              </div>
            </div>
            <Switch id="order-updates" checked={orderUpdates} onCheckedChange={setOrderUpdates} />
          </motion.div>

          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Tag className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <Label htmlFor="promotions" className="font-medium">
                  Promotions & Discounts
                </Label>
                <p className="text-sm text-gray-500">Receive special offers and discounts</p>
              </div>
            </div>
            <Switch id="promotions" checked={promotions} onCheckedChange={setPromotions} />
          </motion.div>

          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-full">
                <Bell className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <Label htmlFor="product-alerts" className="font-medium">
                  Product Alerts
                </Label>
                <p className="text-sm text-gray-500">Get notified when items in your wishlist are back in stock</p>
              </div>
            </div>
            <Switch id="product-alerts" checked={productAlerts} onCheckedChange={setProductAlerts} />
          </motion.div>

          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-full">
                <Mail className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <Label htmlFor="newsletter" className="font-medium">
                  Newsletter
                </Label>
                <p className="text-sm text-gray-500">Receive our monthly newsletter</p>
              </div>
            </div>
            <Switch id="newsletter" checked={newsletter} onCheckedChange={setNewsletter} />
          </motion.div>

          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-amber-100 rounded-full">
                <Gift className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <Label htmlFor="account-alerts" className="font-medium">
                  Account Alerts
                </Label>
                <p className="text-sm text-gray-500">Important notifications about your account</p>
              </div>
            </div>
            <Switch id="account-alerts" checked={accountAlerts} onCheckedChange={setAccountAlerts} />
          </motion.div>

          <div className="pt-4 flex justify-end">
            <Button disabled className="bg-teal-500 hover:bg-teal-600">
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </AnimatedContainer>
  )
}
