import express from 'express';
import { AddRouteControllers } from './addRoute.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createAddRouteValidationSchema, updateAddRouteValidationSchema } from './addRoute.validation';

const router = express.Router();

router.post(
  '/create-add-route',
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
