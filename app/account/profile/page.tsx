"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "@/components/account/profile-form"
import { AnimatedContainer } from "@/components/animated/animated-container"
import { useAccountNavigation } from "@/lib/account-navigation-context"

export default function ProfilePage() {
  const { isNavigating } = useAccountNavigation()

  return (
    <AnimatedContainer animation="fade" animationKey="profile-page" immediate={isNavigating}>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </AnimatedContainer>
  )
}
