import { z } from 'zod';

export const createTimeSlotValidationSchema = z.object({
  body: z.object({
  startTime: z.string().min(1, "Name is required"),
  endTime: z.string().min(1, "Name is required"),
  price: z.number(),
  type: z.enum(['pickup', 'delivery']).optional(),
  }),
});

export const updateTimeSlotValidationSchema = z.object({
  body: z.object({
  startTime: z.string().min(1, "Name is required").optional(),
  endTime: z.string().optional(),
  price: z.number().optional(),
  type: z.enum(['pickup', 'delivery']).optional(),
  }),
});
