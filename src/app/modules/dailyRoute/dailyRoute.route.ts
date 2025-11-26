import express from 'express';
import { DailyRouteControllers } from './dailyRoute.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createDailyRouteValidationSchema, updateDailyRouteValidationSchema } from './dailyRoute.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

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
  auth(USER_ROLE.superAdmin, USER_ROLE.company, USER_ROLE.user, USER_ROLE.admin, USER_ROLE.courier ),
  DailyRouteControllers.getAllDailyRoutes,
);

export const DailyRouteRoutes = router;
