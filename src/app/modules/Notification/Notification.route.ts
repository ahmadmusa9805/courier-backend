import express from 'express';
import { NotificationControllers } from './Notification.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();
router.post(
  '/create-Notification',
  NotificationControllers.createNotification,
);

router.patch(
  '/mark-all-as-read',
  auth(USER_ROLE.superAdmin, USER_ROLE.company, USER_ROLE.user, USER_ROLE.admin, USER_ROLE.courier ),
  NotificationControllers.markNotificationsAsRead,
);

router.get(
  '/unread',
  auth(USER_ROLE.superAdmin, USER_ROLE.company, USER_ROLE.user, USER_ROLE.admin, USER_ROLE.courier ),
  NotificationControllers.getAllUnreadNotifications,
);

router.patch(
  '/:id/read',
  auth(USER_ROLE.superAdmin, USER_ROLE.company, USER_ROLE.user, USER_ROLE.admin, USER_ROLE.courier ),
  NotificationControllers.markNotificationAsRead,
);




export const NotificationRoutes = router;
