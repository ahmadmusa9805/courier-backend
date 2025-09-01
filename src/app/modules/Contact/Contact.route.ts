import express from 'express';
import { ContactControllers } from './Contact.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createContactValidationSchema, updateContactValidationSchema } from './Contact.validation';

const router = express.Router();

router.post(
  '/create-contact',
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
