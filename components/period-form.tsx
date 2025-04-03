"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

import { Button } from "./ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { supabase } from "@/lib/supabase"
import { periodFormSchema } from "@/lib/schemas"
import { DatePicker } from "./date-picker"

type FormData = z.infer<typeof periodFormSchema>

export function PeriodForm({ onSuccess }: { onSuccess?: () => void }) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(periodFormSchema),
    defaultValues: {
      start_date: new Date(),
      end_date: undefined,
      flow_level: "medium",
    },
  })

  async function onSubmit(data: FormData) {
    if (!session?.user?.id) {
      toast.error("You need to be logged in to log a period")
      return
    }
    
    setIsLoading(true)
    try {
      const { error } = await supabase.from("periods").insert({
        user_id: session.user.id,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date ? data.end_date.toISOString() : null,
        flow_level: data.flow_level,
      })

      if (error) throw error

      toast.success("Period logged successfully")
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error("Error logging period:", error)
      toast.error("Failed to log period. Please try again.")
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
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    label="Select start date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date (Optional)</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value === null ? undefined : field.value}
                    setDate={field.onChange}
                    label="Select end date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="flow_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flow Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || "medium"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select flow level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="heavy">Heavy</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging..." : "Log Period"}
        </Button>
      </form>
    </Form>
  )
} 