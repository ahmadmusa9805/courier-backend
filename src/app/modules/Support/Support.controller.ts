import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SupportServices } from './Support.service';

const createSupport = catchAsync(async (req, res) => {
  const { Support: SupportData } = req.body;
  const result = await SupportServices.createSupportIntoDB(SupportData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Support is created successfully',
    data: result,
  });
});

const getSingleSupport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SupportServices.getSingleSupportFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Support is retrieved successfully',
    data: result,
  });
});

const getAllSupports = catchAsync(async (req, res) => {
  const result = await SupportServices.getAllSupportsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Supports are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateSupport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { Support } = req.body;
  const result = await SupportServices.updateSupportIntoDB(id, Support);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Support is updated successfully',
    data: result,
  });
});

const deleteSupport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SupportServices.deleteSupportFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Support is deleted successfully',
    data: result,
  });
});

export const SupportControllers = {
  createSupport,
  getSingleSupport,
  getAllSupports,
  updateSupport,
  deleteSupport,
};
