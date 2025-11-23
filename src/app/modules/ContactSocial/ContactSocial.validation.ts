import { z } from 'zod';

export const createContactSocialValidationSchema = z.object({
  body: z.object({
      phone: z.string().optional(),
      whatsapp: z.string().optional(),
      officeAdress: z.string().optional(),
      emailAdress: z.string().optional(),
      fax: z.string().optional(),
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      linkedIn: z.string().optional(),
      isDeleted: z.boolean().default(false),
  }),
});

export const updateContactSocialValidationSchema = z.object({
  body: z.object({
    ContactSocial: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      atcCodes: z.string().optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});
