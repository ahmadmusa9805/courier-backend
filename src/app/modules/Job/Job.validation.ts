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
      date: z.string(),
      timeSlot: z.string().min(1),
    }),
    deliveryDateInfo: z.object({
      date: z.string(),
      timeSlot: z.string().min(1),
    }),
    extraService: z.object({
      service: z.object({
        options: z.string(),
      }),
      floor: z.object({
        options: z.string().optional(),
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
      password: z.string().min(1).optional(),
      name: z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
      }),
      userType: z.enum(['user', 'company']),
    }),
    status: z.enum(['pending', 'accepted', 'completed']).optional(),
    totalDistance: z.string().min(1),
    totalPrice: z.number(),
    isDeleted: z.boolean().default(false),
  }),
});

export const updateJobValidationSchema = z.object({
  body: z.object({
     from: z.string().min(1).optional(),
    to: z.string().min(1).optional(),
    transportationType: z.object({
      name: z.string().min(1).optional(),
      options: z.string().min(1).optional(),
    }).optional(),
    items: 
    // z.object(
      z.object({
        name: z.string().min(1).optional(),
        img: z.string().min(1).optional(),
        quantity: z.number().optional(),
        dimensions: z.string().min(1).optional(),
        materialContent: z.enum([
          'glass',
          'wood',
          'metal',
          'food',
          'plants',
          'animals',
          'others',
        ]).optional(),
        price: z.number().optional(),
        length: z.string().min(1).optional(),
        width: z.string().min(1).optional(),
        height: z.string().min(1).optional(),
      }).optional(),
    // ).optional(),
    pickupDateInfo: z.object({
      date: z.string().optional(),
      timeSlot: z.string().min(1).optional(),
    }).optional(),
    deliveryDateInfo: z.object({
      date: z.string().optional(),
      timeSlot: z.string().min(1).optional(),
    }).optional(),
    extraService: z.object({
      service: z.object({
        carWithLift: z.number().optional(),
        noNeed: z.number().optional(),
        extraHelp: z.number().optional(),
      }).optional(),
      floor: z.object({
        groundFloor: z.boolean().optional(),
        elevator: z.boolean().optional(),
        level: z.number().optional(),
        price: z.number().optional(),
      }).optional(),
    }).optional(),
    pickupAddress: z.object({
      streetAddress: z.string().min(1).optional(),
      cityOrState: z.string().min(1).optional(),
      zipCode: z.string().min(1).optional(),
      country: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
    }).optional(),
    deliveryAddress: z.object({
      streetAddress: z.string().min(1).optional(),
      cityOrState: z.string().min(1).optional(),
      zipCode: z.string().min(1).optional(),
      country: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
    }).optional(),
    status: z.enum(['pending', 'accepted', 'completed']).optional(),
    totalDistance: z.string().min(1).optional(),
    totalPrice: z.number().optional(),
    isDeleted: z.boolean().default(false).optional(),
  }).optional(),
});
