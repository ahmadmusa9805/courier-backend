import { z } from 'zod';

export const createTimeSlotValidationSchema = z.object({
  body: z.object({
  startTime: z.string().min(1, "Name is required"),
  endTime: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be a positive number"),
  type: z.enum(['active', 'inactive']).optional(),
  }),
});

export const updateTimeSlotValidationSchema = z.object({
  body: z.object({
  startTime: z.string().min(1, "Name is required").optional(),
  endTime: z.number().positive("Length must be a positive number").optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  type: z.enum(['active', 'inactive']).optional(),
  }),
});
