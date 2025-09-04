import express from 'express';
import { TimeSlotControllers } from './TimeSlot.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createTimeSlotValidationSchema, updateTimeSlotValidationSchema } from './TimeSlot.validation';

const router = express.Router();

router.post(
  '/create-time-slot',
  validateRequest(createTimeSlotValidationSchema),
  TimeSlotControllers.createTimeSlot,
);

router.get(
  '/:id',
  TimeSlotControllers.getSingleTimeSlot,
);

router.patch(
  '/:id',
  validateRequest(updateTimeSlotValidationSchema),
  TimeSlotControllers.updateTimeSlot,
);

router.delete(
  '/:id',
  TimeSlotControllers.deleteTimeSlot,
);

router.get(
  '/',
  TimeSlotControllers.getAllTimeSlots,
);

export const TimeSlotRoutes = router;
