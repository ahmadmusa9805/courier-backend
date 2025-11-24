import { z } from 'zod';

export const createDailyRouteValidationSchema = z.object({
  body: z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      pickupMinute: z.number().optional(),
      deliveryMinute: z.number().optional(),
      pickupExtraText: z.string().optional(),
      deliveryExtraText: z.string().optional(),
      pickupExtraAdress: z.string().optional(),
      deliveryExtraAdress: z.string().optional(),
    pickupDateInfo: z.object({
      date: z.string().optional(),
      timeSlot: z.string().optional(),
    }).optional(),
    deliveryDateInfo: z.object({
      date: z.string().optional(),
      timeSlot: z.string().min(1).optional(),
    }).optional(),

  }),
});

export const updateDailyRouteValidationSchema = z.object({
  body: z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      pickupMinute: z.number().optional(),
      deliveryMinute: z.number().optional(),
      pickupExtraText: z.string().optional(),
      deliveryExtraText: z.string().optional(),
      pickupExtraAdress: z.string().optional(),
      deliveryExtraAdress: z.string().optional(),
    pickupDateInfo: z.object({
      date: z.string().optional(),
      timeSlot: z.string().optional(),
    }).optional(),
    deliveryDateInfo: z.object({
      date: z.string().optional(),
      timeSlot: z.string().min(1).optional(),
    }).optional(),

  }),
});
