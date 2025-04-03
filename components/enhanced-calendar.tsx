"use client"

import { useState, useEffect } from "react"
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, differenceInDays } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Droplets, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Period } from "@/lib/supabase"
import { calculateFertilityWindow, predictNextPeriod } from "@/lib/cycle-utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

interface EnhancedCalendarProps {
  periods: Period[]
  averageCycleLength: number
}

export function EnhancedCalendar({ periods, averageCycleLength }: EnhancedCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [cycleData, setCycleData] = useState<{
    periodDays: Date[]
    fertileDays: Date[]
    ovulationDay: Date | null
    nextPeriodDate: Date | null
    currentPhase: string
    phaseDescription: string
    phaseIcon: React.ReactNode
    phaseColor: string
    daysUntilNextPeriod: number | null
    cycleProgress: number
  }>({
    periodDays: [],
    fertileDays: [],
    ovulationDay: null,
    nextPeriodDate: null,
    currentPhase: "",
    phaseDescription: "",
    phaseIcon: <Moon className="h-5 w-5" />,
    phaseColor: "yellow",
    daysUntilNextPeriod: null,
    cycleProgress: 0
  })

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }

  // Calculate cycle data based on periods and average cycle length
  useEffect(() => {
    if (!periods.length) return

    // Sort periods by start date
    const sortedPeriods = [...periods].sort(
      (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    )

    // Get the most recent period
    const lastPeriod = sortedPeriods[sortedPeriods.length - 1]
    const lastPeriodDate = parseISO(lastPeriod.start_date)
    
    // Calculate fertility window
    const { fertilityStart, ovulationDate, fertilityEnd } = 
      calculateFertilityWindow(lastPeriodDate, averageCycleLength)
    
    // Calculate next period date
    const nextPeriodDate = predictNextPeriod(lastPeriodDate, averageCycleLength)

    // Calculate days until next period
    const today = new Date()
    const daysUntilNextPeriod = Math.max(
      0,
      Math.ceil(
        (nextPeriodDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
      )
    )
    
    // Calculate cycle progress
    const totalCycleDays = averageCycleLength
    const daysSinceLastPeriod = differenceInDays(today, lastPeriodDate)
    const cycleProgress = Math.min(100, Math.round((daysSinceLastPeriod / totalCycleDays) * 100))
    
    // Determine current phase
    let currentPhase = ""
    let phaseDescription = ""
    let phaseIcon = <Moon className="h-5 w-5" />
    let phaseColor = "yellow"
    
    if (today >= fertilityStart && today <= fertilityEnd) {
      currentPhase = "Fertile Phase"
      phaseDescription = "Higher chance of getting pregnant. Fertility peaks around ovulation."
      phaseIcon = <Droplets className="h-5 w-5" />
      phaseColor = "teal"
    } else if (today >= lastPeriodDate && today <= addDays(lastPeriodDate, 5)) {
      currentPhase = "Menstrual Phase"
      phaseDescription = "Your period. Shedding of uterine lining."
      phaseIcon = <Moon className="h-5 w-5" />
      phaseColor = "rose"
    } else if (today > addDays(lastPeriodDate, 5) && today < fertilityStart) {
      currentPhase = "Follicular Phase"
      phaseDescription = "Follicles in ovaries develop. Estrogen levels rise."
      phaseIcon = <CalendarIcon className="h-5 w-5" />
      phaseColor = "amber"
    } else {
      currentPhase = "Luteal Phase"
      phaseDescription = "Progesterone rises to prepare for possible pregnancy. If no pregnancy occurs, hormones drop."
      phaseIcon = <Moon className="h-5 w-5 rotate-180" />
      phaseColor = "indigo"
    }
    
    // Get all period days from periods data
    const periodDays: Date[] = []
    for (const period of sortedPeriods) {
      const startDate = parseISO(period.start_date)
      const endDate = period.end_date 
        ? parseISO(period.end_date) 
        : addDays(startDate, 5) // Default period length of 5 days
      
      const daysInPeriod = eachDayOfInterval({ start: startDate, end: endDate })
      periodDays.push(...daysInPeriod)
    }
    
    // Get all fertile days
    const fertileDays = eachDayOfInterval({ 
      start: fertilityStart, 
      end: fertilityEnd 
    })
    
    setCycleData({
      periodDays,
      fertileDays,
      ovulationDay: ovulationDate,
      nextPeriodDate,
      currentPhase,
      phaseDescription,
      phaseIcon,
      phaseColor,
      daysUntilNextPeriod,
      cycleProgress
    })
  }, [periods, averageCycleLength])

  // Generate calendar days
  const calendarDays = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    
    // Get all days in the month
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    
    // Start from Sunday of the first week (may include days from previous month)
    const startDay = startOfMonth(currentDate).getDay()
    const previousMonthDays = Array.from({ length: startDay }, (_, i) => 
      subDays(monthStart, startDay - i)
    )
    
    // End on Saturday of the last week (may include days from next month)
    const endDay = 6 - endOfMonth(currentDate).getDay()
    const nextMonthDays = Array.from({ length: endDay }, (_, i) => 
      addDays(monthEnd, i + 1)
    )
    
    return [...previousMonthDays, ...days, ...nextMonthDays]
  }

  // Check if a day has a period
  const hasPeriod = (day: Date) => {
    return cycleData.periodDays.some(periodDay => isSameDay(periodDay, day))
  }
  
  // Check if a day is fertile
  const isFertile = (day: Date) => {
    return cycleData.fertileDays.some(fertileDay => isSameDay(fertileDay, day))
  }
  
  // Check if a day is ovulation day
  const isOvulation = (day: Date) => {
    return cycleData.ovulationDay ? isSameDay(cycleData.ovulationDay, day) : false
  }
  
  // Check if a day is the next predicted period start
  const isNextPeriodStart = (day: Date) => {
    return cycleData.nextPeriodDate ? isSameDay(cycleData.nextPeriodDate, day) : false
  }

  // Get color for day
  const getDayColor = (day: Date) => {
    if (hasPeriod(day)) return "bg-rose-400 hover:bg-rose-500"
    if (isOvulation(day)) return "bg-emerald-600 hover:bg-emerald-700"
    if (isFertile(day)) return "bg-teal-400 hover:bg-teal-500"
    if (isNextPeriodStart(day)) return "border-2 border-rose-400 text-rose-400 hover:bg-rose-50"
    return ""
  }

  // Get background color class based on phase
  const getPhaseColorClasses = () => {
    switch (cycleData.phaseColor) {
      case 'rose': return {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        icon: 'bg-rose-100 text-rose-600'
      }
      case 'teal': return {
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        icon: 'bg-teal-100 text-teal-600'
      }
      case 'amber': return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: 'bg-amber-100 text-amber-600'
      }
      case 'indigo': return {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        icon: 'bg-indigo-100 text-indigo-600'
      }
      default: return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: 'bg-yellow-100 text-yellow-600'
      }
    }
  }

  // Get color classes
  const colorClasses = getPhaseColorClasses()

  // Get tooltip text for day
  const getDayTooltip = (day: Date) => {
    if (hasPeriod(day)) return "Period day"
    if (isOvulation(day)) return "Ovulation day"
    if (isFertile(day)) return "Fertile day"
    if (isNextPeriodStart(day)) return "Predicted next period"
    return format(day, "EEEE, MMMM d, yyyy")
  }

  return (
    <div className="w-full space-y-6">
      {/* Enhanced Phase Information */}
      <div className={cn("p-6 rounded-lg border shadow-sm", colorClasses.bg, colorClasses.border)}>
        <div className="md:flex items-start justify-between">
          {/* Phase details */}
          <div className="flex items-start mb-4 md:mb-0">
            <div className={cn("rounded-full p-3 mr-4", colorClasses.icon)}>
              {cycleData.phaseIcon}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{cycleData.currentPhase}</h3>
              <p className="text-sm text-gray-600 mt-1">{cycleData.phaseDescription}</p>
            </div>
          </div>

          {/* Cycle progress */}
          <div className="md:w-1/3">
            <div className="flex justify-between text-sm mb-1">
              <span>Cycle progress</span>
              <span>{cycleData.cycleProgress}%</span>
            </div>
            <Progress value={cycleData.cycleProgress} className="h-2" />
            {cycleData.daysUntilNextPeriod !== null && (
              <p className="text-sm mt-2 text-center">
                <span className="font-medium text-rose-500">
                  {cycleData.daysUntilNextPeriod}
                </span> 
                <span className="text-gray-500"> days until next period</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={previousMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
        <div className="grid grid-cols-7">
          {/* Weekday Headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium py-3 border-b"
            >
              {day}
            </div>
          ))}
        </div>
          
        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          <TooltipProvider>
            {calendarDays().map((day, i) => {
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isToday = isSameDay(day, new Date())
              const dayColor = getDayColor(day)
              const tooltipText = getDayTooltip(day)
              
              return (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <div 
                      className={cn(
                        "h-16 border border-border/50 relative flex items-center justify-center",
                        !isCurrentMonth && "bg-muted/30"
                      )}
                    >
                      <div className="absolute top-1 left-1">
                        <span 
                          className={cn(
                            "text-sm",
                            !isCurrentMonth && "text-muted-foreground",
                            isToday && "font-bold"
                          )}
                        >
                          {format(day, "d")}
                        </span>
                      </div>
                      
                      {/* Day indicators */}
                      <div className="flex flex-col items-center justify-center">
                        {(hasPeriod(day) || isFertile(day) || isOvulation(day) || isNextPeriodStart(day)) && (
                          <div 
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center text-white",
                              dayColor,
                              isNextPeriodStart(day) && "bg-transparent"
                            )}
                          >
                            {isOvulation(day) && <span className="text-[10px] uppercase font-bold">Ov</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tooltipText}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-rose-400 mr-2"></div>
          <span>Period</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-teal-400 mr-2"></div>
          <span>Fertile</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-emerald-600 mr-2"></div>
          <span>Ovulation</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full border-2 border-rose-400 mr-2"></div>
          <span>Next Period</span>
        </div>
      </div>
    </div>
  )
} 