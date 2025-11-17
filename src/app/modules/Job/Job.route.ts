import express from 'express';
import { JobControllers } from './Job.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createJobValidationSchema } from './Job.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-job',
  validateRequest(createJobValidationSchema),
  JobControllers.createJob,
);

router.get(
  '/daily-route',
  auth(USER_ROLE.superAdmin, USER_ROLE.company, USER_ROLE.user, USER_ROLE.admin, USER_ROLE.courier ),
  JobControllers.getDailyRouteJobs,
);

router.get(
  '/user',
  auth(USER_ROLE.superAdmin, USER_ROLE.company, USER_ROLE.user, USER_ROLE.admin, USER_ROLE.courier ),
  JobControllers.getAllJobsForUser,
);

router.get(
  '/:id',
  JobControllers.getSingleJob,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.company, USER_ROLE.user, USER_ROLE.admin, USER_ROLE.courier ),
  // validateRequest(updateJobValidationSchema),
  JobControllers.updateJob,
);

router.delete(
  '/:id',
  JobControllers.deleteJob,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.company, USER_ROLE.user, USER_ROLE.admin, USER_ROLE.courier ),
  JobControllers.getAllJobs,
);



export const JobRoutes = router;
