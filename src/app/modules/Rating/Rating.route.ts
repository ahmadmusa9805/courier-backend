import express from 'express';
import { RatingControllers } from './Rating.controller';
// import validateRequest from '../../middlewares/validateRequest';
// import { createRatingValidationSchema, updateRatingValidationSchema } from './Rating.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
// import validateRequest from '../../middlewares/validateRequest';
// import { createRatingValidationSchema } from './Rating.validation';

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
  '/courier-rating',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.company, USER_ROLE.courier, USER_ROLE.user),
  RatingControllers.getAllRatingsOnlySingleCourier,
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.company, USER_ROLE.courier, USER_ROLE.user),
  RatingControllers.getSingleRating,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.company, USER_ROLE.courier, USER_ROLE.user),
  // validateRequest(updateRatingValidationSchema),
  RatingControllers.updateRating,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.company, USER_ROLE.courier, USER_ROLE.user),
  RatingControllers.deleteRating,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.company, USER_ROLE.courier, USER_ROLE.user),
  RatingControllers.getAllRatings,
);


export const RatingRoutes = router;
