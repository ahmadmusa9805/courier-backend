import express from 'express';
import { SupportControllers } from './Support.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createSupportValidationSchema, updateSupportValidationSchema } from './Support.validation';

const router = express.Router();

router.post(
  '/create-Support',
  validateRequest(createSupportValidationSchema),
  SupportControllers.createSupport,
);

router.get(
  '/:id',
  SupportControllers.getSingleSupport,
);

router.patch(
  '/:id',
  validateRequest(updateSupportValidationSchema),
  SupportControllers.updateSupport,
);

router.delete(
  '/:id',
  SupportControllers.deleteSupport,
);

router.get(
  '/',
  SupportControllers.getAllSupports,
);

export const SupportRoutes = router;
