import { z } from 'zod';

export const createUserValidationSchema = z.object({
  body: z.object({
  name: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
  }),
  email: z.string().email('Invalid email address'),
  phoneNo: z.string().min(10, 'Phone number must be at least 10 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  address: z.string().optional(),
  role: z.enum(['superAdmin', 'admin', 'courier', 'user', 'company']),
  userType: z.enum(['individual', 'company']).optional(),
  companyName: z.string().optional(),
  companyLocation: z.string().optional(),
  approvalStatus: z.boolean().optional(),
  communicationMode: z.enum(['whatsapp', 'text message']).optional(),
  howKnow: z.enum(['google', 'social media', 'website']).optional(),
  courierExperience: z.string().optional(),
  profileVerified: z.enum(['verified', 'unverified']).optional(),
  document: z.string().optional(),
  legalForm: z.string().optional(),

  }),
});
export const updateUserValidationSchema = z.object({
  body: z.object({
 name: z.object({
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
  }).optional(),
  email: z.string().email('Invalid email address').optional(),
  phoneNo: z.string().min(10, 'Phone number must be at least 10 characters').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  address: z.string().optional(),
  otpVerified: z.boolean().optional(),
  passwordChangedAt: z.date().optional(),
  profileImg: z.string().optional(),
  role: z.enum(['superAdmin', 'admin', 'courier', 'user', 'company']).optional(),
  status: z.enum(['active', 'blocked']).optional(),
  emailStatus: z.enum(['verified', 'unverified']).optional(),
  jobPosted: z.boolean().optional(),
  userType: z.enum(['individual', 'company']).optional(),
  companyName: z.string().optional(),
  companyLocation: z.string().optional(),
  approvalStatus: z.boolean().optional(),
  communicationMode: z.enum(['whatsapp', 'text message']).optional(),
  howKnow: z.enum(['google', 'social media', 'website']).optional(),
  courierExperience: z.string().optional(),
  profileVerified: z.enum(['verified', 'unverified']).optional(),
  document: z.string().optional(),
  legalForm: z.string().optional(),
  isDeleted: z.boolean().optional(),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
};



