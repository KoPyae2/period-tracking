"use client"

import { ProfileForm } from "@/components/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
export default function ProfilePage() {
  return (
    <div className=" mx-auto ">
      <SiteHeader />
      <h1 className="text-3xl font-bold m-6">Account Settings</h1>

      <Card className="m-6">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Manage your account information and cycle preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  )
} 