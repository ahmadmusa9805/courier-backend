import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { OtpRoutes } from '../modules/Otp/otp.route';
import { AboutUsRoutes } from '../modules/AboutUs/AboutUs.route';
import { PrivacyRoutes } from '../modules/Privacy/Privacy.route';
import { TermRoutes } from '../modules/Term/Term.route';
import { ContactRoutes } from '../modules/Contact/Contact.route';
import { NotificationRoutes } from '../modules/Notification/Notification.route';
import { ItemRoutes } from '../modules/Item/Item.route';
import { TimeSlotRoutes } from '../modules/TimeSlot/TimeSlot.route';
import { BlogRoutes } from '../modules/Blog/Blog.route';
import { TestimonialRoutes } from '../modules/Testimonial/Testimonial.route';
import { RatingRoutes } from '../modules/Rating/Rating.route';
import { AnalyticRoutes } from '../modules/Analytic/Analytic.route';
import { FaqRoutes } from '../modules/Faq/Faq.route';
// import { Upload } from '../modules/Upload/Upload.model';
import { UploadRoutes } from '../modules/Upload/Upload.route';
import { JobRoutes } from '../modules/Job/Job.route';
import { ChatRoomRoutes } from '../modules/ChatRoom/ChatRoom.route';
import { ChatRoutes } from '../modules/Chat/Chat.route';

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
  {
    path: '/items',
    route: ItemRoutes,
  },
  {
    path: '/time-slots',
    route: TimeSlotRoutes,
  },
  {
    path: '/blogs',
    route: BlogRoutes,
  },
  {
    path: '/testimonials',
    route: TestimonialRoutes,
  },
  {
    path: '/faqs',
    route: FaqRoutes,
  },
  {
    path: '/ratings',
    route: RatingRoutes,
  },
  {
    path: '/analytics',
    route: AnalyticRoutes,
  },
  {
    path: '/upload',
    route: UploadRoutes,
  },
  {
    path: '/jobs',
    route: JobRoutes,
  },
  {
    path: '/chat-rooms',
    route: ChatRoomRoutes,
  },
  {
    path: '/chats',
    route: ChatRoutes,
  }

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
