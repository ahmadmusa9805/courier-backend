import express from 'express';
import { DistancePriceControllers } from './DistancePrice.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createDistancePriceValidationSchema, updateDistancePriceValidationSchema } from './DistancePrice.validation';

const router = express.Router();

router.post(
  '/create-distance-price',
  validateRequest(createDistancePriceValidationSchema),
  DistancePriceControllers.createDistancePrice,
);

router.get(
  '/:id',
  DistancePriceControllers.getSingleDistancePrice,
);

router.patch(
  '/:id',
  validateRequest(updateDistancePriceValidationSchema),
  DistancePriceControllers.updateDistancePrice,
);

router.delete(
  '/:id',
  DistancePriceControllers.deleteDistancePrice,
);

router.get(
  '/',
  DistancePriceControllers.getAllDistancePrices,
);

export const DistancePriceRoutes = router;
