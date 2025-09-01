import express from 'express';
import { AboutUsControllers } from './AboutUs.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createAboutUsValidationSchema, updateAboutUsValidationSchema } from './AboutUs.validation';

const router = express.Router();

router.post(
  '/create-about',
  validateRequest(createAboutUsValidationSchema),
  AboutUsControllers.createAboutUs,
);

router.get(
  '/:id',
  AboutUsControllers.getSingleAboutUs,
);

router.patch(
  '/:id',
  validateRequest(updateAboutUsValidationSchema),
  AboutUsControllers.updateAboutUs,
);

router.delete(
  '/:id',
  AboutUsControllers.deleteAboutUs,
);

router.get(
  '/',
  AboutUsControllers.getAllAboutUss,
);

export const AboutUsRoutes = router;
