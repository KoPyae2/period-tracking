"use client"

import { useState, useEffect } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { Period } from "@/lib/supabase"
import { calculateAverageCycleLength, calculateFertilityWindow } from "@/lib/cycle-utils"
import { addDays, format, parseISO, subDays } from "date-fns"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface CycleChartProps {
  periods: Period[]
  days?: number
}

export function CycleChart({ periods, days = 60 }: CycleChartProps) {
  const [chartData, setChartData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  })

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Cycle Visualization",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || ""
            const value = context.parsed.y
            return `${label}: ${value}`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 3,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            if (value === 0) return "Low"
            if (value === 1) return "Moderate"
            if (value === 2) return "High"
            return ""
          },
        },
      },
    },
  }

  useEffect(() => {
    if (!periods.length) return

    // Sort periods by start date
    const sortedPeriods = [...periods].sort(
      (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    )

    // Get the most recent period
    const lastPeriod = sortedPeriods[sortedPeriods.length - 1]
    const lastPeriodDate = parseISO(lastPeriod.start_date)
    
    // Calculate average cycle length
    const avgCycleLength = calculateAverageCycleLength(sortedPeriods)
    
    // Calculate fertility window
    const { fertilityStart, ovulationDate, fertilityEnd } = 
      calculateFertilityWindow(lastPeriodDate, avgCycleLength)
    
    // Generate dates for chart
    const startDate = subDays(lastPeriodDate, days / 2)
    const endDate = addDays(lastPeriodDate, days / 2)
    const dateLabels = []
    const periodData = []
    const fertilityData = []
    
    let currentDate = startDate
    while (currentDate <= endDate) {
      dateLabels.push(format(currentDate, "MMM d"))
      
      // Period data - check if this date is during a period
      let periodValue = 0
      for (const period of sortedPeriods) {
        const periodStart = parseISO(period.start_date)
        const periodEnd = period.end_date 
          ? parseISO(period.end_date) 
          : addDays(periodStart, 5) // Default period length of 5 days
        
        if (currentDate >= periodStart && currentDate <= periodEnd) {
          periodValue = 2 // High value for period days
          break
        }
      }
      periodData.push(periodValue)
      
      // Fertility data
      let fertilityValue = 0
      if (currentDate >= fertilityStart && currentDate <= fertilityEnd) {
        fertilityValue = 1.5 // Moderate-high value for fertility window
        if (currentDate.getTime() === ovulationDate.getTime()) {
          fertilityValue = 2 // High value for ovulation day
        }
      }
      fertilityData.push(fertilityValue)
      
      currentDate = addDays(currentDate, 1)
    }
    
    setChartData({
      labels: dateLabels,
      datasets: [
        {
          label: "Period",
          data: periodData,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          pointRadius: 3,
        },
        {
          label: "Fertility",
          data: fertilityData,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          pointRadius: 3,
        },
      ],
    })
  }, [periods, days])

  if (!periods.length) {
    return <div className="text-center p-4">No period data available</div>
  }

  return (
    <div className="h-[400px] w-full">
      <Line options={options} data={chartData} />
    </div>
  )
} 