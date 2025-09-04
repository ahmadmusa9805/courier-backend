import { z } from 'zod';

export const createTestimonialValidationSchema = z.object({
  body: z.object({
    
      name: z.string().min(1),
      subTitle: z.string().min(1),
      description: z.string().optional(),
      createdDate: z.string().optional(),
      status: z.enum(['active', 'inactive']).optional(),
      rating: z.number().min(1),
      isDeleted: z.boolean().default(false),
  
  }),
});

export const updateTestimonialValidationSchema = z.object({
  body: z.object({
      name: z.string().min(1).optional(),
      subTitle: z.string().min(1).optional(),
      description: z.string().optional(),
      createdDate: z.string().optional(),
      status: z.enum(['active', 'inactive']).optional(),
      rating: z.number().min(1).optional(),
      isDeleted: z.boolean().default(false).optional(),
  }),
});
