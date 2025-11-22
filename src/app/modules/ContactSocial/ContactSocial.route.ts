import express from 'express';
import { ContactSocialControllers } from './ContactSocial.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createContactSocialValidationSchema, updateContactSocialValidationSchema } from './ContactSocial.validation';

const router = express.Router();

router.post(
  '/create-contact-social',
  validateRequest(createContactSocialValidationSchema),
  ContactSocialControllers.createContactSocial,
);

router.get(
  '/',
  ContactSocialControllers.getSingleContactSocial,
);

router.patch(
  '/:id',
  validateRequest(updateContactSocialValidationSchema),
  ContactSocialControllers.updateContactSocial,
);

router.delete(
  '/:id',
  ContactSocialControllers.deleteContactSocial,
);

router.get(
  '/',
  ContactSocialControllers.getAllContactSocials,
);

export const ContactSocialRoutes = router;
