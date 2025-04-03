"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

import { DatePicker } from "./date-picker"
import { Button } from "./ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "./ui/form"
import { Input } from "./ui/input"
import { supabase } from "@/lib/supabase"
import { userProfileSchema } from "@/lib/schemas"

type FormData = z.infer<typeof userProfileSchema>

export function ProfileForm() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      email: "",
      average_cycle_length: 28,
      last_period_start: undefined,
    },
  })

  // Fetch user profile data
  useEffect(() => {
    async function fetchUserProfile() {
      if (!session?.user?.id) {
        return;
      }
      
      try {
        // Fetch user data from users table
        const { data: userData, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()
        
        if (error) {
          console.error("Error fetching user data:", error)
          throw error
        }
        
        // If user exists, set form data
        if (userData) {
          form.reset({
            email: userData.email || "",
            average_cycle_length: userData.average_cycle_length || 28,
            last_period_start: userData.last_period_start ? new Date(userData.last_period_start) : undefined,
          })
        } else if (session.user.email) {
          // If no user found but we have session email
          form.setValue("email", session.user.email)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Failed to load profile data")
      }
    }
    
    fetchUserProfile()
  }, [form, session])

  async function onSubmit(data: FormData) {
    if (!session?.user?.id) {
      toast.error("You must be logged in to update your profile")
      return
    }
    
    setIsLoading(true)
    try {
      const userData = {
        average_cycle_length: data.average_cycle_length,
        last_period_start: data.last_period_start ? data.last_period_start.toISOString() : null,
      }
      
      // Update user in users table
      const { error } = await supabase
        .from("users")
        .update(userData)
        .eq("id", session.user.id)
      
      if (error) throw error
      
      toast.success("Profile updated successfully")
    } catch (error: unknown) {
      console.error("Error updating profile:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    disabled
                    placeholder="your.email@example.com"
                  />
                </FormControl>
                <FormDescription>
                  Your email address is managed through your account settings.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="average_cycle_length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average Cycle Length (days)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={21}
                    max={45}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 28)}
                    value={field.value || 28}
                  />
                </FormControl>
                <FormDescription>
                  The typical length of your menstrual cycle, from 21 to 45 days. The average is 28 days.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_period_start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Period Start Date</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value === null ? undefined : field.value}
                    setDate={field.onChange}
                    label="Select last period start date"
                  />
                </FormControl>
                <FormDescription>
                  The first day of your most recent period. This helps calculate predictions.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </Form>
  )
} 