import express from 'express';
import { AddRouteControllers } from './addRoute.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createAddRouteValidationSchema, updateAddRouteValidationSchema } from './addRoute.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-add-route',
    auth(USER_ROLE.superAdmin, USER_ROLE.company, USER_ROLE.user, USER_ROLE.admin, USER_ROLE.courier ),
  validateRequest(createAddRouteValidationSchema),
  AddRouteControllers.createAddRoute,
);

router.get(
  '/:id',
  AddRouteControllers.getSingleAddRoute,
);

router.patch(
  '/:id',
  validateRequest(updateAddRouteValidationSchema),
  AddRouteControllers.updateAddRoute,
);

router.delete(
  '/:id',
  AddRouteControllers.deleteAddRoute,
);

router.get(
  '/',
  AddRouteControllers.getAllAddRoutes,
);

export const AddRouteRoutes = router;
