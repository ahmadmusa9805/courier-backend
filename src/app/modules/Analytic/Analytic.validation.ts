import { z } from 'zod';

export const createAnalyticValidationSchema = z.object({
  body: z.object({
    Analytic: z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      atcCodes: z.string().min(1),
      isDeleted: z.boolean().default(false),
    }),
  }),
});

export const updateAnalyticValidationSchema = z.object({
  body: z.object({
    Analytic: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      atcCodes: z.string().optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});
