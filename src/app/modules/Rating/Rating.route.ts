import express from 'express';
import { RatingControllers } from './Rating.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createRatingValidationSchema, updateRatingValidationSchema } from './Rating.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-rating',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.company, USER_ROLE.courier, USER_ROLE.user),
  // validateRequest(createRatingValidationSchema),
  RatingControllers.createRating,
);

router.get(
  '/average-elements',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.company, USER_ROLE.courier, USER_ROLE.user),
  RatingControllers.getAllAverageElementsRatings,
);

router.get(
  '/:id',
  RatingControllers.getSingleRating,
);

router.patch(
  '/:id',
  validateRequest(updateRatingValidationSchema),
  RatingControllers.updateRating,
);

router.delete(
  '/:id',
  RatingControllers.deleteRating,
);

router.get(
  '/',
  RatingControllers.getAllRatings,
);


export const RatingRoutes = router;
