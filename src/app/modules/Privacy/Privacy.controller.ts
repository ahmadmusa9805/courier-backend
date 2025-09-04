import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PrivacyServices } from './Privacy.service';

const createPrivacy = catchAsync(async (req, res) => {
  const PrivacyData = req.body;
  const result = await PrivacyServices.createPrivacyIntoDB(PrivacyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Privacy is created successfully',
    data: result,
  });
});

const getSinglePrivacy = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PrivacyServices.getSinglePrivacyFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Privacy is retrieved successfully',
    data: result,
  });
});

const getAllPrivacys = catchAsync(async (req, res) => {
  const result = await PrivacyServices.getAllPrivacysFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Privacys are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updatePrivacy = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Privacy = req.body;
  const result = await PrivacyServices.updatePrivacyIntoDB(id, Privacy);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Privacy is updated successfully',
    data: result,
  });
});

const deletePrivacy = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PrivacyServices.deletePrivacyFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Privacy is deleted successfully',
    data: result,
  });
});

export const PrivacyControllers = {
  createPrivacy,
  getSinglePrivacy,
  getAllPrivacys,
  updatePrivacy,
  deletePrivacy,
};
