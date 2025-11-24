import express from 'express';
import { DailyRouteControllers } from './dailyRoute.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createDailyRouteValidationSchema, updateDailyRouteValidationSchema } from './dailyRoute.validation';

const router = express.Router();

router.post(
  '/create-route',
  validateRequest(createDailyRouteValidationSchema),
  DailyRouteControllers.createDailyRoute,
);

router.get(
  '/:id',
  DailyRouteControllers.getSingleDailyRoute,
);

router.patch(
  '/:id',
  validateRequest(updateDailyRouteValidationSchema),
  DailyRouteControllers.updateDailyRoute,
);

router.delete(
  '/:id',
  DailyRouteControllers.deleteDailyRoute,
);

router.get(
  '/',
  DailyRouteControllers.getAllDailyRoutes,
);

export const DailyRouteRoutes = router;
