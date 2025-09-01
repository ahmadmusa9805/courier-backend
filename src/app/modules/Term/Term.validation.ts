import { z } from 'zod';

export const createTermValidationSchema = z.object({
  body: z.object({
    term: z.object({
      description: z.string().optional(),
      isDeleted: z.boolean().default(false),
    }),
  }),
});

export const updateTermValidationSchema = z.object({
  body: z.object({
    term: z.object({
      description: z.string().optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});
