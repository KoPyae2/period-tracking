import * as z from 'zod';

export const periodFormSchema = z.object({
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date().optional().nullable(),
  flow_level: z.enum(['light', 'medium', 'heavy']).optional().nullable(),
  flow_intensity: z.string().optional(),
});

export const symptomFormSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  type: z.string({
    required_error: "Symptom type is required",
  }),
  severity: z.enum(['mild', 'moderate', 'severe'], {
    required_error: "Severity is required",
  }),
  notes: z.string().optional().nullable(),
});

export const userProfileSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  average_cycle_length: z.number().positive().optional().nullable(),
  last_period_start: z.date().optional().nullable(),
}); 