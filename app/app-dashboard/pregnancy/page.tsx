"use client"

import { useState, useEffect } from "react"
import { format, addWeeks } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

export default function PregnancyPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [isPregnancyMode, setIsPregnancyMode] = useState(false)
  const [dueDate, setDueDate] = useState<Date>()
  const [currentWeek, setCurrentWeek] = useState(0)

  // Check if user has pregnancy mode enabled
  const checkPregnancyMode = async () => {
    if (!session?.user?.id) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("users")
        .select("pregnancy_mode, due_date")
        .eq("id", session.user.id)
        .single()

      if (error) throw error

      if (data?.pregnancy_mode) {
        setIsPregnancyMode(true)
        if (data.due_date) {
          const parsedDueDate = new Date(data.due_date)
          setDueDate(parsedDueDate)
          
          // Calculate current week of pregnancy
          const currentDate = new Date()
          const conceptionDate = addWeeks(parsedDueDate, -40) // 40 weeks pregnancy
          const diffTime = Math.abs(currentDate.getTime() - conceptionDate.getTime())
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          const weekNumber = Math.floor(diffDays / 7) + 1
          setCurrentWeek(Math.min(weekNumber, 40)) // Cap at 40 weeks
        }
      }
    } catch (error) {
      console.error("Error checking pregnancy mode:", error)
    } finally {
      setLoading(false)
    }
  }

  // Activate pregnancy mode
  const activatePregnancyMode = async () => {
    if (!session?.user?.id) {
      toast.error("You must be logged in")
      return
    }

    if (!dueDate) {
      toast.error("Please select your due date")
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase
        .from("users")
        .update({
          pregnancy_mode: true,
          due_date: dueDate.toISOString(),
        })
        .eq("id", session.user.id)

      if (error) throw error

      toast.success("Pregnancy mode activated!")
      setIsPregnancyMode(true)
      
      // Calculate current week
      const currentDate = new Date()
      const conceptionDate = addWeeks(dueDate, -40) // 40 weeks pregnancy
      const diffTime = Math.abs(currentDate.getTime() - conceptionDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const weekNumber = Math.floor(diffDays / 7) + 1
      setCurrentWeek(Math.min(weekNumber, 40)) // Cap at 40 weeks
    } catch (error) {
      console.error("Error activating pregnancy mode:", error)
      toast.error("Failed to activate pregnancy mode")
    } finally {
      setLoading(false)
    }
  }

  // Initialize pregnancy mode check
  useEffect(() => {
    checkPregnancyMode()
  }, [session])

  // Generate week milestones
  const getWeekMilestones = () => {
    const milestones = [
      { week: 4, title: "Implantation", description: "Your embryo has implanted in your uterus." },
      { week: 8, title: "Embryo Development", description: "All essential organs have begun to form." },
      { week: 12, title: "First Trimester Complete", description: "Risk of miscarriage decreases significantly." },
      { week: 16, title: "Gender Reveal", description: "You may be able to find out the sex of your baby." },
      { week: 20, title: "Halfway Point", description: "You're halfway through your pregnancy!" },
      { week: 24, title: "Viability", description: "Your baby has a chance of survival if born now." },
      { week: 28, title: "Third Trimester Begins", description: "Your baby's brain is developing rapidly." },
      { week: 32, title: "Lung Development", description: "Your baby's lungs are almost fully developed." },
      { week: 36, title: "Full Term Approaching", description: "Your baby is considered early term." },
      { week: 40, title: "Due Date", description: "Your baby is ready to be born!" }
    ]
    
    // Find the next milestone
    return milestones.find(m => m.week >= currentWeek) || milestones[milestones.length - 1]
  }

  const nextMilestone = getWeekMilestones()

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-6">Pregnancy Tracking</h2>
      
      {!isPregnancyMode ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pregnancy Mode</CardTitle>
            <CardDescription>Track your pregnancy journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 p-3 bg-primary/10 rounded-full">
                <CalendarIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Your Pregnancy</h3>
              <p className="text-muted-foreground mb-6">
                Record your due date and track your pregnancy week by week
              </p>
              
              <div className="w-full max-w-md mb-6">
                <label className="block text-sm font-medium mb-2">Select Your Due Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <Button 
                onClick={activatePregnancyMode} 
                disabled={!dueDate || loading}
                className="min-w-40"
              >
                {loading ? "Activating..." : "Activate Pregnancy Mode"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Pregnancy</CardTitle>
              <CardDescription>
                You are currently in week {currentWeek} of your pregnancy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative w-full bg-slate-200 h-6 rounded-full mb-3">
                  <div 
                    className="absolute left-0 top-0 bg-primary h-6 rounded-full"
                    style={{ width: `${Math.min((currentWeek / 40) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm">
                  {40 - currentWeek > 0 
                    ? `${40 - currentWeek} weeks until due date` 
                    : "Your baby is due any day now!"}
                </p>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Due Date</h3>
                  <p className="text-2xl font-bold">{dueDate ? format(dueDate, "MMMM d, yyyy") : "Not set"}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="h-8"
                  onClick={() => {
                    toast.info("You can update your due date in your profile settings.")
                  }}
                >
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pregnancy Timeline</CardTitle>
                <CardDescription>Track your journey by week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      {currentWeek}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium">Week {currentWeek}</h4>
                      <p className="text-sm text-muted-foreground">
                        {currentWeek <= 13 ? "First Trimester" : 
                         currentWeek <= 26 ? "Second Trimester" : "Third Trimester"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pl-5 border-l-2 border-dashed border-slate-300">
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-primary">Next Milestone</h4>
                      <p className="font-semibold">{nextMilestone?.title} (Week {nextMilestone?.week})</p>
                      <p className="text-sm text-muted-foreground">{nextMilestone?.description}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Development Milestones</CardTitle>
                <CardDescription>What&apos;s happening this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-semibold mb-2">Week {currentWeek}: Baby&apos;s Development</h3>
                  
                  {currentWeek <= 4 && (
                    <p>Your baby is the size of a poppy seed. The fertilized egg creates a blastocyst that will develop into the baby&apos;s organs and body parts.</p>
                  )}
                  
                  {currentWeek > 4 && currentWeek <= 8 && (
                    <p>Your baby is the size of a kidney bean. The heart is beating and the neural tube is forming, which will become the brain and spinal cord.</p>
                  )}
                  
                  {currentWeek > 8 && currentWeek <= 12 && (
                    <p>Your baby is the size of a lime. The baby&apos;s face is becoming more defined, with eyes, ears, and nose visible. Tiny limbs are forming.</p>
                  )}
                  
                  {currentWeek > 12 && currentWeek <= 16 && (
                    <p>Your baby is the size of an avocado. The baby can make facial expressions and may start sucking their thumb. You might feel movement soon.</p>
                  )}
                  
                  {currentWeek > 16 && currentWeek <= 20 && (
                    <p>Your baby is the size of a bell pepper. The baby can hear sounds and is developing hair, eyebrows, and eyelashes.</p>
                  )}
                  
                  {currentWeek > 20 && currentWeek <= 24 && (
                    <p>Your baby is the size of an ear of corn. The baby&apos;s movements are more defined, and they&apos;re developing a regular sleep pattern.</p>
                  )}
                  
                  {currentWeek > 24 && currentWeek <= 28 && (
                    <p>Your baby is the size of an eggplant. The baby&apos;s brain is developing rapidly, and they may respond to light and sound from the outside world.</p>
                  )}
                  
                  {currentWeek > 28 && currentWeek <= 32 && (
                    <p>Your baby is the size of a butternut squash. The baby&apos;s lungs are maturing, and they&apos;re putting on weight. Vision is developing.</p>
                  )}
                  
                  {currentWeek > 32 && currentWeek <= 36 && (
                    <p>Your baby is the size of a head of lettuce. The baby is gaining weight rapidly and preparing for birth by moving into position.</p>
                  )}
                  
                  {currentWeek > 36 && (
                    <p>Your baby is the size of a watermelon. The baby is considered full term and could arrive any day now!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
} 