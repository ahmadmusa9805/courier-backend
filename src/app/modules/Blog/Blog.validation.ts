import { z } from 'zod';

export const createBlogValidationSchema = z.object({
  body: z.object({
title: z.string().min(1),
      description: z.string().optional(),
      status: z.enum(['active', 'inactive']).optional(),
      isDeleted: z.boolean().default(false).optional(),
  }),
});

export const updateBlogValidationSchema = z.object({
  body: z.object({
      title: z.string().min(1).optional(),
      img: z.string().min(1).optional(),
      description: z.string().optional(),
      status: z.enum(['active', 'inactive']).optional(),
      isDeleted: z.boolean().default(false).optional(),
  }),
});
