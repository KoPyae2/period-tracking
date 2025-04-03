"use client"

import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DashboardNav() {
  const pathname = usePathname()

  // Determine the active tab based on the pathname
  const getActiveTab = () => {
    if (pathname === "/app-dashboard") return "periods"
    if (pathname.includes("/app-dashboard/symptoms")) return "symptoms"
    if (pathname.includes("/app-dashboard/pregnancy")) return "pregnancy"
    if (pathname.includes("/app-dashboard/insights")) return "insights"
    return "periods"
  }

  return (
    <div className="mt-6 mb-8">
      <h1 className="text-3xl font-bold mb-6">Period Tracker</h1>
      <Tabs defaultValue={getActiveTab()} className="w-full" onValueChange={(value) => {
        // Navigate based on tab value
        const baseUrl = "/app-dashboard"
        let path = baseUrl
        if (value !== "periods") {
          path = `${baseUrl}/${value}`
        }
        window.location.href = path
      }}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="periods">Period & Fertility</TabsTrigger>
          <TabsTrigger value="symptoms">Symptom Tracking</TabsTrigger>
          <TabsTrigger value="pregnancy">Pregnancy Mode</TabsTrigger>
          <TabsTrigger value="insights">Health Insights</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
} 