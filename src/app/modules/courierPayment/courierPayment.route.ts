import express from 'express';
import { CourierPaymentControllers } from './courierPayment.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createCourierPaymentValidationSchema, updateCourierPaymentValidationSchema } from './courierPayment.validation';

const router = express.Router();

router.post(
  '/create-courierPayment',
  validateRequest(createCourierPaymentValidationSchema),
  CourierPaymentControllers.createCourierPayment,
);


router.get(
  '/weekly',
  CourierPaymentControllers.getAllCourierPaymentsWeekly,
);

router.get(
  '/all-jobs',
  CourierPaymentControllers.getAllCourierPaymentsAllJobs,
);






router.get(
  '/all-jobs/:id',
  CourierPaymentControllers.getSingleCourierPaymentsAllJobs,
);

router.get(
  '/weekly/:id',
  CourierPaymentControllers.getSingleCourierPaymentweekly,
);





router.get(
  '/:id',
  CourierPaymentControllers.getSingleCourierPayment,
);

router.patch(
  '/:id',
  validateRequest(updateCourierPaymentValidationSchema),
  CourierPaymentControllers.updateCourierPayment,
);

router.delete(
  '/:id',
  CourierPaymentControllers.deleteCourierPayment,
);


router.get(
  '/',
  CourierPaymentControllers.getAllCourierPayments,
);


export const CourierPaymentRoutes = router;
