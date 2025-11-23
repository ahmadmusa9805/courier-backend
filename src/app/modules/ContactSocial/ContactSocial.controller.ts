import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ContactSocialServices } from './ContactSocial.service';

const createContactSocial = catchAsync(async (req, res) => {
  const ContactSocialData = req.body;
  const result = await ContactSocialServices.createContactSocialIntoDB(ContactSocialData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'ContactSocial is created successfully',
    data: result,
  });
});

const getSingleContactSocial = catchAsync(async (req, res) => {
  // const { id } = req.params;
  const result = await ContactSocialServices.getSingleContactSocialFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'ContactSocial is retrieved successfully',
    data: result,
  });
});

const getAllContactSocials = catchAsync(async (req, res) => {
  const result = await ContactSocialServices.getAllContactSocialsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'ContactSocials are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateContactSocial = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { ContactSocial } = req.body;
  const result = await ContactSocialServices.updateContactSocialIntoDB(id, ContactSocial);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'ContactSocial is updated successfully',
    data: result,
  });
});

const deleteContactSocial = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ContactSocialServices.deleteContactSocialFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'ContactSocial is deleted successfully',
    data: result,
  });
});

export const ContactSocialControllers = {
  createContactSocial,
  getSingleContactSocial,
  getAllContactSocials,
  updateContactSocial,
  deleteContactSocial,
};
