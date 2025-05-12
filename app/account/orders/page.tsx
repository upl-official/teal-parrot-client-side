"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderList } from "@/components/account/order-list"
import { AnimatedContainer } from "@/components/animated/animated-container"

export default function OrdersPage() {
  return (
    <AnimatedContainer animation="fade" key="orders-page">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderList />
        </CardContent>
      </Card>
    </AnimatedContainer>
  )
}
