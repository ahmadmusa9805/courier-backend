import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ContactServices } from './Contact.service';

const createContact = catchAsync(async (req, res) => {
  const { contact: ContactData } = req.body;
  const result = await ContactServices.createContactIntoDB(ContactData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contact is created successfully',
    data: result,
  });
});

const getSingleContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ContactServices.getSingleContactFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contact is retrieved successfully',
    data: result,
  });
});

const getAllContacts = catchAsync(async (req, res) => {
  const result = await ContactServices.getAllContactsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contacts are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { contact } = req.body;
  const result = await ContactServices.updateContactIntoDB(id, contact);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contact is updated successfully',
    data: result,
  });
});

const deleteContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ContactServices.deleteContactFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contact is deleted successfully',
    data: result,
  });
});

export const ContactControllers = {
  createContact,
  getSingleContact,
  getAllContacts,
  updateContact,
  deleteContact,
};
