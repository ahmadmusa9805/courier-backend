import { z } from 'zod';

export const createJobValidationSchema = z.object({
  body: z.object({
    from: z.string().min(1),
    to: z.string().min(1),
    transportationType: z.object({
      name: z.string().min(1),
      options: z.string().min(1),
    }),
    items: z.array(
      z.object({
        name: z.string().min(1),
        img: z.string().min(1),
        quantity: z.number(),
        dimensions: z.string().min(1),
        materialContent: z.enum([
          'glass',
          'wood',
          'metal',
          'food',
          'plants',
          'animals',
          'others',
        ]),
        price: z.number(),
        length: z.string().min(1),
        width: z.string().min(1),
        height: z.string().min(1),
      }),
    ),
    pickupDateInfo: z.object({
      date: z.date(),
      timeSlot: z.string().min(1),
    }),
    deliveryDateInfo: z.object({
      date: z.date(),
      timeSlot: z.string().min(1),
    }),
    extraService: z.object({
      service: z.object({
        carWithLift: z.number(),
        noNeed: z.number(),
        extraHelp: z.number(),
      }),
      floor: z.object({
        groundFloor: z.boolean(),
        elevator: z.boolean(),
        level: z.number(),
        price: z.number(),
      }),
    }),
    pickupAddress: z.object({
      streetAddress: z.string().min(1),
      cityOrState: z.string().min(1),
      zipCode: z.string().min(1),
      country: z.string().min(1),
      description: z.string().min(1),
    }),
    deliveryAddress: z.object({
      streetAddress: z.string().min(1),
      cityOrState: z.string().min(1),
      zipCode: z.string().min(1),
      country: z.string().min(1),
      description: z.string().min(1),
    }),
    contact: z.object({
      phone: z.string().min(1),
      email: z.string().min(1),
      name: z.object({
        firstName: z.string().min(1),
        instagram: z.string().min(1),
      }),
      userType: z.enum(['individual', 'company']),
    }),
    status: z.enum(['active', 'inactive']),
    totalDistance: z.string().min(1),
    totalPrice: z.number(),
    isDeleted: z.boolean().default(false),
  }),
});

export const updateJobValidationSchema = z.object({
  body: z.object({
    Job: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      atcCodes: z.string().optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});
