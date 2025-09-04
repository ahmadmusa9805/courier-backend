import express from 'express';
import { TestimonialControllers } from './Testimonial.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createTestimonialValidationSchema, updateTestimonialValidationSchema } from './Testimonial.validation';

const router = express.Router();

router.post(
  '/create-testimonial',
  validateRequest(createTestimonialValidationSchema),
  TestimonialControllers.createTestimonial,
);

router.get(
  '/:id',
  TestimonialControllers.getSingleTestimonial,
);

router.patch(
  '/:id',
  validateRequest(updateTestimonialValidationSchema),
  TestimonialControllers.updateTestimonial,
);

router.delete(
  '/:id',
  TestimonialControllers.deleteTestimonial,
);

router.get(
  '/',
  TestimonialControllers.getAllTestimonials,
);

export const TestimonialRoutes = router;
