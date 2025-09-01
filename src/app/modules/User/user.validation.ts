import { z } from 'zod';

export const createUserValidationSchema = z.object({
  body: z.object({
  name: z.string().min(1, "Name is required"),
  contactNo: z.string().min(1, "Contact number is required"),
  email: z.string().email("Invalid email address"),
  project: z.string().optional(), // ObjectId as string (ref to 'Project')
  password: z.string().min(6, "Password must be at least 6 characters"),
  profileImg: z.string().optional(),
  role: z.enum(['client', 'superAdmin', 'basicAdmin', 'primeAdmin']).optional(),
  postCode: z.string().optional(),
  address: z.string().optional(),
  }),
});
export const updateUserValidationSchema = z.object({
  body: z.object({
  name: z.string().optional(),
  contactNo: z.string().optional(),
  email: z.string().email().optional(),
  project: z.string().optional(),
  password: z.string().min(6).optional(),
  profileImg: z.string().optional(),
  otpVerified: z.boolean().optional(),
  postCode: z.string().optional(),
  address: z.string().optional(),
  isDeleted: z.boolean().optional(),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
};



