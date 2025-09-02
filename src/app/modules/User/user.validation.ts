import { z } from 'zod';

// Define the Zod schema for the 'name' object
const nameSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
}).optional();

// Define other field schemas
const emailStatusSchema = z.enum(['verified', 'notVerified']).optional();
const profileStatusSchema = z.enum(['verified', 'notVerified']).optional();
const communicationModeSchema = z.enum(['whatsApp', 'textMessage']).optional();
const howKnowSchema = z.enum(['google', 'website', 'socialMedia']).optional();
const userRoleSchema = z.enum(['client', 'superAdmin', 'admin', 'business']).optional();
const userStatusSchema = z.enum(['active', 'blocked']).optional();


export const createUserValidationSchema = z.object({
  body: z.object({
  name: nameSchema,
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  // emailStatus: emailStatusSchema,
  phoneNo: z.string().min(1, 'Phone number is required'),
  password: z.string().min(6, 'Password should be at least 6 characters'),
  // otpVerified: z.boolean().default(false),
  // passwordChangedAt: z.date().optional(),
  // profileImg: z.string().default(''),
  address: z.string().optional(),
  legalForm: z.string().optional(),
  document: z.string().optional(),
  // profileVerified: profileStatusSchema.optional(),
  courierExperience: z.string().optional(),
  companyLocation: z.string().optional(),
  companyName: z.string().optional(),
  communicationMode: communicationModeSchema.optional(),
  approvalStatus: z.string().optional(),
  // jobPosted: z.string().optional(),
  howKnow: howKnowSchema.optional(),
  role: userRoleSchema,
  status: userStatusSchema.optional(),
  // isDeleted: z.boolean().default(false),
  }),
});
export const updateUserValidationSchema = z.object({
  body: z.object({
 name: nameSchema.optional(),
  email: z.string().email('Invalid email address').min(1, 'Email is required').optional(),
  emailStatus: emailStatusSchema,
  phoneNo: z.string().min(1, 'Phone number is required').optional(),
  password: z.string().min(6, 'Password should be at least 6 characters').optional(),
  otpVerified: z.boolean().default(false).optional(),
  passwordChangedAt: z.date().optional(),
  profileImg: z.string().default(''),
  address: z.string().optional(),
  postCode: z.string().optional(),
  legalForm: z.string().optional(),
  document: z.string().optional(),
  profileVerified: profileStatusSchema.optional(),
  courierExperience: z.string().optional(),
  companyLocation: z.string().optional(),
  companyName: z.string().optional(),
  communicationMode: communicationModeSchema.optional(),
  approvalStatus: z.string().optional(),
  jobPosted: z.string().optional(),
  howKnow: howKnowSchema.optional(),
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
  isDeleted: z.boolean().default(false),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
};



