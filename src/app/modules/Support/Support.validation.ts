import { z } from 'zod';

export const createSupportValidationSchema = z.object({
  body: z.object({
    Support: z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      atcCodes: z.string().min(1),
      isDeleted: z.boolean().default(false),
    }),
  }),
});

export const updateSupportValidationSchema = z.object({
  body: z.object({
    Support: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      atcCodes: z.string().optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});
