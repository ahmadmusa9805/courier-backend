import express from 'express';
// import { RatingControllers } from './Rating.controller';
import validateRequest from '../../middlewares/validateRequest';
// import { createRatingValidationSchema, updateRatingValidationSchema } from './Rating.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { createPaymentIntent } from './mollie.controller';

const router = express.Router();

router
.route('/')
.post(
    // auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.company, USER_ROLE.courier, USER_ROLE.user),
    createPaymentIntent
)
export const paymetRoute = router;
