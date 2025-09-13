import { z } from 'zod';

export const createRatingValidationSchema = z.object({
  body: z.object({
  userId: z.string(),
  courierId: z.string().optional(),
  professionalism: z.number().optional(),
  communication: z.number().optional(),
  friendliness: z.number().optional(),
  jobId: z.string(),
  comment: z.string(),
  status: z.enum(['active', 'blocked']).default('active'),
  isDeleted: z.boolean().default(false),
  }),
});

export const updateRatingValidationSchema = z.object({
  body: z.object({
  userId: z.string().optional(),
  courierId: z.string().optional(),
  professionalism: z.number().optional(),
  communication: z.number().optional(),
  friendliness: z.number().optional(),
  jobId: z.string().optional(),
  comment: z.string().optional(),
  averageRatings: z.number().optional(),
  status: z.enum(['active', 'blocked']).default('active').optional(),
  isDeleted: z.boolean().default(false).optional(),
  }),
});
