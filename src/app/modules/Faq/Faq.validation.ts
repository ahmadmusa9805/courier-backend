import { z } from 'zod';

export const createFaqValidationSchema = z.object({
  body: z.object({
   
      question: z.string().min(1),
      answer: z.string().min(1),
      isDeleted: z.boolean().default(false),

  }),
});

export const updateFaqValidationSchema = z.object({
  body: z.object({
      question: z.string().min(1).optional(),
      answer: z.string().min(1).optional(),
      isDeleted: z.boolean().optional(),
  }),
});
