import express from 'express';
import { AnalyticControllers } from './Analytic.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createAnalyticValidationSchema, updateAnalyticValidationSchema } from './Analytic.validation';

const router = express.Router();

router.post(
  '/create-Analytic',
  validateRequest(createAnalyticValidationSchema),
  AnalyticControllers.createAnalytic,
);

router.get(
  '/:id',
  AnalyticControllers.getSingleAnalytic,
);

router.patch(
  '/:id',
  validateRequest(updateAnalyticValidationSchema),
  AnalyticControllers.updateAnalytic,
);

router.delete(
  '/:id',
  AnalyticControllers.deleteAnalytic,
);

router.get(
  '/',
  AnalyticControllers.getAllAnalyticsCombined,
);

export const AnalyticRoutes = router;
