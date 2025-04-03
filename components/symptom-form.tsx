
import { useState } from "react"
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
} from "./ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Textarea } from "./ui/textarea"
import { supabase } from "@/lib/supabase"
import { symptomFormSchema } from "@/lib/schemas"

type FormData = z.infer<typeof symptomFormSchema>

// Common symptom types
const SYMPTOM_TYPES = [
  "Cramps",
  "Headache",
  "Bloating",
  "Fatigue",
  "Mood Swings",
  "Breast Tenderness",
  "Back Pain",
  "Acne",
  "Nausea",
  "Other"
]

export function SymptomForm({ onSuccess }: { onSuccess?: () => void }) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(symptomFormSchema),
    defaultValues: {
      date: new Date(),
      type: "",
      severity: "moderate",
      notes: "",
    },
  })

  async function onSubmit(data: FormData) {
    if (!session?.user?.id) {
      toast.error("You need to be logged in to log a symptom")
      return
    }
    
    setIsLoading(true)
    try {
      const { error } = await supabase.from("symptoms").insert({
        user_id: session.user.id,
        date: data.date.toISOString(),
        type: data.type,
        severity: data.severity,
        notes: data.notes,
      })

      if (error) throw error

      toast.success("Symptom logged successfully")
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error("Error logging symptom:", error)
      toast.error("Failed to log symptom. Please try again.")
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
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    label="Select date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Symptom Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select symptom type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SYMPTOM_TYPES.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Severity</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any additional notes here..."
                    className="min-h-[80px]"
                    value={field.value || ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging..." : "Log Symptom"}
        </Button>
      </form>
    </Form>
  )
} 