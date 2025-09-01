import { z } from 'zod';

export const createAboutUsValidationSchema = z.object({
  body: z.object({
    about: z.object({
      description: z.string(),
      isDeleted: z.boolean().default(false),
    }),
  }),
});

export const updateAboutUsValidationSchema = z.object({
  body: z.object({
    about: z.object({
      description: z.string().optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});
