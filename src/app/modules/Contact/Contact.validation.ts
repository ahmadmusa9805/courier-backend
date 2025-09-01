import { z } from 'zod';

export const createContactValidationSchema = z.object({
  body: z.object({
    contact: z.object({
      phone: z.string().min(1),
      email: z.string().min(1),
      facebook: z.string().min(1),
      instagram: z.string().min(1),
      twitter: z.string().min(1),
      isDeleted: z.boolean().default(false),
    }),
  }),
});

export const updateContactValidationSchema = z.object({
  body: z.object({
    contact: z.object({
      phone: z.string().optional(),
      email: z.string().optional(),
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});
