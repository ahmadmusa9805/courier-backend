import express from 'express';
import { ContactControllers } from './Contact.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createContactValidationSchema, updateContactValidationSchema } from './Contact.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-contact',
  auth(USER_ROLE.superAdmin, USER_ROLE.company, USER_ROLE.user, USER_ROLE.admin, USER_ROLE.courier ),
  validateRequest(createContactValidationSchema),
  ContactControllers.createContact,
);

router.get(
  '/:id',
  ContactControllers.getSingleContact,
);

router.patch(
  '/:id',
  validateRequest(updateContactValidationSchema),
  ContactControllers.updateContact,
);

router.delete(
  '/:id',
  ContactControllers.deleteContact,
);

router.get(
  '/',
  ContactControllers.getAllContacts,
);

export const ContactRoutes = router;
