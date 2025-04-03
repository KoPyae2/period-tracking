import { addDays, subDays, differenceInDays, parseISO, format } from 'date-fns';
import { Period } from './supabase';

// Calculate average cycle length from history
export function calculateAverageCycleLength(periods: Period[]): number {
  if (periods.length < 2) return 28; // Default to 28 days if not enough data
  
  const sortedPeriods = [...periods].sort((a, b) => 
    new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );
  
  let totalDays = 0;
  let cyclesToCount = 0;
  
  for (let i = 1; i < sortedPeriods.length; i++) {
    const currentStart = parseISO(sortedPeriods[i].start_date);
    const prevStart = parseISO(sortedPeriods[i-1].start_date);
    const cycleDays = differenceInDays(currentStart, prevStart);
    
    // Only count reasonable cycle lengths (21-45 days)
    if (cycleDays >= 21 && cycleDays <= 45) {
      totalDays += cycleDays;
      cyclesToCount++;
    }
  }
  
  return cyclesToCount > 0 ? Math.round(totalDays / cyclesToCount) : 28;
}

// Calculate fertility window based on last period and average cycle length
export function calculateFertilityWindow(lastPeriodStart: Date, averageCycleLength: number) {
  // Ovulation typically occurs 14 days before the next period
  const daysToOvulation = averageCycleLength - 14;
  const ovulationDate = addDays(lastPeriodStart, daysToOvulation);
  
  // Fertility window is typically 5 days before ovulation and the day of ovulation
  const fertilityStart = subDays(ovulationDate, 5);
  const fertilityEnd = ovulationDate;
  
  return {
    fertilityStart,
    ovulationDate,
    fertilityEnd
  };
}

// Predict next period start date
export function predictNextPeriod(lastPeriodStart: Date, averageCycleLength: number) {
  return addDays(lastPeriodStart, averageCycleLength);
}

// Format dates for display
export function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

// Check if a date is within a given range
export function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  return date >= startDate && date <= endDate;
}

// Calculate period status for a given date
export function calculatePeriodStatus(date: Date, periods: Period[]) {
  for (const period of periods) {
    const start = parseISO(period.start_date);
    const end = period.end_date ? parseISO(period.end_date) : addDays(start, 5); // Default to 5 days if no end date
    
    if (isDateInRange(date, start, end)) {
      return {
        isOnPeriod: true,
        flowLevel: period.flow_level || 'medium'
      };
    }
  }
  
  return {
    isOnPeriod: false,
    flowLevel: null
  };
} 