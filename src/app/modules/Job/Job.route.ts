import express from 'express';
import { JobControllers } from './Job.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createJobValidationSchema, updateJobValidationSchema } from './Job.validation';

const router = express.Router();

router.post(
  '/create-Job',
  validateRequest(createJobValidationSchema),
  JobControllers.createJob,
);

router.get(
  '/:id',
  JobControllers.getSingleJob,
);

router.patch(
  '/:id',
  validateRequest(updateJobValidationSchema),
  JobControllers.updateJob,
);

router.delete(
  '/:id',
  JobControllers.deleteJob,
);

router.get(
  '/',
  JobControllers.getAllJobs,
);

export const JobRoutes = router;
