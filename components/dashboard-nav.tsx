"use client"

import { usePathname, useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Determine the active tab based on the pathname
  const getActiveTab = () => {
    if (pathname === "/app-dashboard") return "periods"
    if (pathname.includes("/app-dashboard/symptoms")) return "symptoms"
    if (pathname.includes("/app-dashboard/pregnancy")) return "pregnancy"
    if (pathname.includes("/app-dashboard/insights")) return "insights"
    return "periods"
  }

  const handleTabChange = (value: string) => {
    // Navigate based on tab value
    const baseUrl = "/app-dashboard"
    let path = baseUrl
    if (value !== "periods") {
      path = `${baseUrl}/${value}`
    }
    router.push(path)
  }

  if (!isMounted) return null

  const currentTab = getActiveTab()

  return (
    <div className="mt-6 mb-8">
      <h1 className="text-3xl font-bold mb-6 px-4 md:px-0">Period Tracker</h1>
      
      {/* Desktop tabs */}
      <div className={cn("hidden md:block")}>
        <Tabs
          defaultValue={currentTab}
          value={currentTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="periods">Period & Fertility</TabsTrigger>
            <TabsTrigger value="symptoms">Symptom Tracking</TabsTrigger>
            <TabsTrigger value="pregnancy">Pregnancy Mode</TabsTrigger>
            <TabsTrigger value="insights">Health Insights</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Mobile select dropdown */}
      <div className={cn("md:hidden px-4")}>
        <Select defaultValue={currentTab} onValueChange={handleTabChange}>
          <SelectTrigger className="w-full bg-muted/40">
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="periods">Period & Fertility</SelectItem>
            <SelectItem value="symptoms">Symptom Tracking</SelectItem>
            <SelectItem value="pregnancy">Pregnancy Mode</SelectItem>
            <SelectItem value="insights">Health Insights</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 