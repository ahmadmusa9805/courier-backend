import express, { NextFunction, Request, Response } from 'express';
import { DailyRouteControllers } from './dailyRoute.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createDailyRouteValidationSchema, updateDailyRouteValidationSchema } from './dailyRoute.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadFileS3 } from '../../utils/UploaderS3';

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
  uploadFileS3(true).fields([
    { name: 'img', maxCount: 5 },
    { name: 'document', maxCount: 5 },
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (error) {
        next(error);
      }
    }
    next();
  },
  auth(USER_ROLE.superAdmin, USER_ROLE.company, USER_ROLE.user, USER_ROLE.admin, USER_ROLE.courier),
  validateRequest(updateDailyRouteValidationSchema),
  DailyRouteControllers.updateDailyRoute,
);

router.delete(
  '/:id',
  DailyRouteControllers.deleteDailyRoute,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.company, USER_ROLE.user, USER_ROLE.admin, USER_ROLE.courier),
  DailyRouteControllers.getAllDailyRoutes,
);

export const DailyRouteRoutes = router;
