/* eslint-disable @typescript-eslint/no-explicit-any */

import express, { NextFunction, Response, Request } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';
// import validateRequest from '../../middlewares/validateRequest';
// import { UserValidation } from './user.validation';
import { uploadFileS3 } from '../../utils/UploaderS3';

const router = express.Router();
router.post(
  '/create-user',
  // auth(USER_ROLE.superAdmin),
  // uploadFileS3(true).single('file'),
       uploadFileS3(true).fields([
  { name: 'img', maxCount: 5 },
  { name: 'document', maxCount: 5 },
]),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (error) {
        next(error);
      }
    }
    next();
  },
  // validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createUser,
);

router.get(
  '/me',
  auth(USER_ROLE.superAdmin,  USER_ROLE.admin, USER_ROLE.company, USER_ROLE.courier, USER_ROLE.user),
  UserControllers.getMe,
);

// router.get(
//   '/for-subscriber',
//   auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.subscriber),
//   UserControllers.getAllUsersForSubscriber,
// );

// router.get(
//   '/users-monthly',
//   auth(USER_ROLE.superAdmin, USER_ROLE.admin),
//   UserControllers.getUsersMonthly,
// );
// router.get(
//   '/users-monthly-subscriber',
//   auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.subscriber),
//   UserControllers.getUsersMonthlyForSubscriber,
// );

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin),
  UserControllers.getSingleUser,
);

router.post(
  '/change-status/:id',
  auth(USER_ROLE.superAdmin),
//   validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin),
  UserControllers.getAllUsers,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin),
  UserControllers.deleteUser,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.company, USER_ROLE.courier, USER_ROLE.user),
  // uploadFileS3(true).single('file'),
         uploadFileS3(true).fields([
  { name: 'img', maxCount: 5 },
  { name: 'document', maxCount: 5 },
]),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (error) {
        next(error);
      }
    }
    next();
  },
  // validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.updateUser,
);

export const UserRoutes = router;
