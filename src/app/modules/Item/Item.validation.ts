import { z } from 'zod';

export const createItemValidationSchema = z.object({
  body: z.object({
  name: z.string().min(1, "Name is required"),
  containMaterials: z.string().min(1, "Name is required").optional(),
  length: z.number().positive("Length must be a positive number"),
  quantity: z.number().positive("Length must be a positive number").optional(),
  width: z.number().positive("Width must be a positive number"),
  height: z.number().positive("Height must be a positive number"),
  price: z.number().positive("Price must be a positive number"),
  status: z.enum(['active', 'inactive']).optional(),
  description: z.string().min(1, "Description is required"),
  }),
});

export const updateItemValidationSchema = z.object({
  body: z.object({
      name: z.string().min(1, "Name is required").optional(),
  length: z.number().positive("Length must be a positive number").optional(),
    containMaterials: z.string().min(1, "Name is required").optional(),
    quantity: z.number().positive("Length must be a positive number").optional(),
  width: z.number().positive("Width must be a positive number").optional(),
  height: z.number().positive("Height must be a positive number").optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  status: z.enum(['active', 'inactive']).optional(), // Direct enum definition
  description: z.string().min(1, "Description is required").optional(),
  img: z.string().url("Image must be a valid URL").optional(), // Assuming it's a URL
  }),
});
