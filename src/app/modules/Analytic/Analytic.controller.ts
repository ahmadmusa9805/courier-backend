import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AnalyticServices } from './Analytic.service';

const createAnalytic = catchAsync(async (req, res) => {
  const { Analytic: AnalyticData } = req.body;
  const result = await AnalyticServices.createAnalyticIntoDB(AnalyticData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analytic is created successfully',
    data: result,
  });
});

const getSingleAnalytic = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AnalyticServices.getSingleAnalyticFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analytic is retrieved successfully',
    data: result,
  });
});

const getAllAnalyticsCombined = catchAsync(async (req, res) => {
  const result = await AnalyticServices.getAllAnalyticsCombinedFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analytics are retrieved successfully',
    // meta: result.meta,
    data: result,
  });
});

const updateAnalytic = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { Analytic } = req.body;
  const result = await AnalyticServices.updateAnalyticIntoDB(id, Analytic);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analytic is updated successfully',
    data: result,
  });
});

const deleteAnalytic = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AnalyticServices.deleteAnalyticFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analytic is deleted successfully',
    data: result,
  });
});

export const AnalyticControllers = {
  createAnalytic,
  getSingleAnalytic,
  getAllAnalyticsCombined,
  updateAnalytic,
  deleteAnalytic,
};
