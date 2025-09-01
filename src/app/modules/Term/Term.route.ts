import express from 'express';
import { TermControllers } from './Term.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createTermValidationSchema, updateTermValidationSchema } from './Term.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();
router.post(
  '/create-term',
    auth(USER_ROLE.superAdmin),
  validateRequest(createTermValidationSchema),
  TermControllers.createTerm,
);

router.get(
  '/:id',
  TermControllers.getSingleTerm,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin),
  validateRequest(updateTermValidationSchema),
  TermControllers.updateTerm,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin),
  TermControllers.deleteTerm,
);

router.get(
  '/',
  TermControllers.getAllTerms,
);

export const TermRoutes = router;
