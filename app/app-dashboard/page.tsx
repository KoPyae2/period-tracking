"use client"

import { useState, useEffect } from "react"
import { format, parseISO, addDays } from "date-fns"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedCalendar } from "@/components/enhanced-calendar"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Clock, Check } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  calculateAverageCycleLength,
  calculateFertilityWindow,
  predictNextPeriod,
} from "@/lib/cycle-utils"
import { Period } from "@/lib/supabase"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [periods, setPeriods] = useState<Period[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Period form state
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 5))
  const [flowIntensity, setFlowIntensity] = useState<string>("Medium")
  
  const [insights, setInsights] = useState({
    averageCycleLength: 28,
    nextPeriodDate: null as Date | null,
    fertilityWindow: {
      start: null as Date | null,
      end: null as Date | null,
      ovulation: null as Date | null,
    },
  })


  // Fetch user's period data
  useEffect(() => {
    async function fetchData() {
      try {
        if (!session?.user?.id) {
          if (status !== "loading") {
            toast.error("You need to be logged in")
            setLoading(false)
          }
          return
        }

        // Get user data for cycle length and preferences
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("average_cycle_length, last_period_start")
          .eq("id", session.user.id)
          .single()

        if (userError) {
          console.error("Error fetching user:", userError)
        }

        // Fetch periods
        const { data: periodsData, error: periodsError } = await supabase
          .from("periods")
          .select("*")
          .eq("user_id", session.user.id)
          .order("start_date", { ascending: true })

        if (periodsError) {
          console.error("Error fetching periods:", periodsError)
          throw periodsError
        }
        
        if (!periodsData || periodsData.length === 0) {
          setPeriods([])
          
          // If no periods but user has last_period_start in profile, use that
          if (userData?.last_period_start) {
            const lastPeriodStart = new Date(userData.last_period_start)
            const avgCycleLength = userData.average_cycle_length || 28
            
            const nextPeriodDate = predictNextPeriod(lastPeriodStart, avgCycleLength)
            const fertilityWindow = calculateFertilityWindow(
              lastPeriodStart,
              avgCycleLength
            )

            setInsights({
              averageCycleLength: avgCycleLength,
              nextPeriodDate,
              fertilityWindow: {
                start: fertilityWindow.fertilityStart,
                end: fertilityWindow.fertilityEnd,
                ovulation: fertilityWindow.ovulationDate,
              },
            })
          }
          
          setLoading(false)
          return
        }

        setPeriods(periodsData)

        // Calculate insights using periods data
        const avgCycleLength = userData?.average_cycle_length || 
                            calculateAverageCycleLength(periodsData)
                            
        const lastPeriodStart = parseISO(
          periodsData[periodsData.length - 1].start_date
        )
        const nextPeriodDate = predictNextPeriod(lastPeriodStart, avgCycleLength)
        const fertilityWindow = calculateFertilityWindow(
          lastPeriodStart,
          avgCycleLength
        )

        setInsights({
          averageCycleLength: avgCycleLength,
          nextPeriodDate,
          fertilityWindow: {
            start: fertilityWindow.fertilityStart,
            end: fertilityWindow.fertilityEnd,
            ovulation: fertilityWindow.ovulationDate,
          },
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load your data")
      } finally {
        setLoading(false)
      }
    }

    if (status !== "loading") {
      fetchData()
    }
  }, [session, status])

  // Refresh data after new entries
  const refreshData = async () => {
    if (!session?.user?.id) return

    setLoading(true)
    
    const { data: periodsData } = await supabase
      .from("periods")
      .select("*")
      .eq("user_id", session.user.id)
      .order("start_date", { ascending: true })

    setPeriods(periodsData || [])
    setLoading(false)
  }

  // Handle period form submission
  const handleSubmitPeriod = async () => {
    if (!session?.user?.id || !startDate) {
      toast.error("Please select a start date")
      return
    }

    try {
      setSubmitting(true)

      // Set end date to start date if not selected
      const periodEndDate = endDate || startDate

      const newPeriod = {
        user_id: session.user.id,
        start_date: startDate.toISOString().split('T')[0],
        end_date: periodEndDate.toISOString().split('T')[0],
        flow_intensity: flowIntensity,
      }

      const { error } = await supabase.from("periods").insert(newPeriod)

      if (error) {
        console.error("Error saving period:", error)
        toast.error("Failed to save period data")
        return
      }

      // Also update the user's last_period_start
      await supabase
        .from("users")
        .update({ last_period_start: newPeriod.start_date })
        .eq("id", session.user.id)

      toast.success("Period data saved successfully")
      
      // Reset form
      setStartDate(new Date())
      setEndDate(addDays(new Date(), 5))
      setFlowIntensity("Medium")
      
      // Refresh data
      await refreshData()
    } catch (error) {
      console.error("Error:", error)
      toast.error("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  if (status === "loading" || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="mb-4">Please sign in to access the dashboard.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-6">Period & Fertility Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>Cycle Length</CardTitle>
            <CardDescription>Your average menstrual cycle</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{insights.averageCycleLength} days</p>
            <p className="text-sm text-muted-foreground mt-2">
              Based on your {periods.length} recorded period(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Period</CardTitle>
            <CardDescription>Expected start date</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {insights.nextPeriodDate
                ? format(insights.nextPeriodDate, "MMM d")
                : "N/A"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {insights.nextPeriodDate
                ? `In ${Math.max(
                    0,
                    Math.ceil(
                      (insights.nextPeriodDate.getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  )} days`
                : "Log your period to get predictions"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fertility Window</CardTitle>
            <CardDescription>Your most fertile days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {insights.fertilityWindow.start && insights.fertilityWindow.end
                ? `${format(insights.fertilityWindow.start, "MMM d")} - ${format(
                    insights.fertilityWindow.end,
                    "MMM d"
                  )}`
                : "N/A"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {insights.fertilityWindow.ovulation
                ? `Ovulation: ${format(insights.fertilityWindow.ovulation, "MMM d")}`
                : "Log your period to get fertility predictions"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cycle Visualization */}
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Cycle Visualization</CardTitle>
          <CardDescription>Your period and fertility pattern</CardDescription>
        </CardHeader>
        <CardContent>
          <EnhancedCalendar 
            periods={periods} 
            averageCycleLength={insights.averageCycleLength} 
          />
        </CardContent>
      </Card>

      {/* Enhanced Period Tracking Interface */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Log Your Period</CardTitle>
          <CardDescription>
            Track your menstrual cycle to get accurate predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">New Period Entry</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "PPP")
                        ) : (
                          <span>Select your period start date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "PPP")
                        ) : (
                          <span>Select your period end date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => 
                          (startDate ? date < startDate : false) || 
                          date > addDays(startDate || new Date(), 14) // Max 14 days period
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Flow Intensity</label>
                  <div className="grid grid-cols-5 gap-2">
                    {["Light", "Medium", "Heavy", "Very Heavy", "Spotting"].map((flow) => (
                      <Button 
                        key={flow} 
                        variant={flowIntensity === flow ? "default" : "outline"} 
                        className={cn(
                          "text-xs py-1 px-2",
                          flowIntensity === flow && "bg-primary text-primary-foreground"
                        )}
                        onClick={() => setFlowIntensity(flow)}
                      >
                        {flow}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleSubmitPeriod}
                  disabled={submitting || !startDate}
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save Period
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Recent Periods</h3>
              {periods && periods.length > 0 ? (
                <div className="space-y-3">
                  {periods.slice(-3).reverse().map((period, index) => (
                    <div key={index} className="flex items-center p-3 border rounded-lg">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {format(new Date(period.start_date), "MMM d")} - {format(new Date(period.end_date || period.start_date), "MMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {Math.ceil((new Date(period.end_date || period.start_date).getTime() - new Date(period.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                          {period.flow_intensity && ` • ${period.flow_intensity} flow`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">No period data recorded yet</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      
    </div>
  )
} 