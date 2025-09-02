import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { OtpRoutes } from '../modules/Otp/otp.route';
import { AboutUsRoutes } from '../modules/AboutUs/AboutUs.route';
import { PrivacyRoutes } from '../modules/Privacy/Privacy.route';
import { TermRoutes } from '../modules/Term/Term.route';
import { ContactRoutes } from '../modules/Contact/Contact.route';
import { NotificationRoutes } from '../modules/Notification/Notification.route';


const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/otps',
    route: OtpRoutes,
  },
  {
    path: '/abouts',
    route: AboutUsRoutes,
  },
  {
    path: '/privacies',
    route: PrivacyRoutes,
  },
  {
    path: '/terms',
    route: TermRoutes,
  },
  {
    path: '/contacts',
    route: ContactRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
