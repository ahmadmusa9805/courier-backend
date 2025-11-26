import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DailyRouteServices } from './dailyRoute.service';

const createDailyRoute = catchAsync(async (req, res) => {
  const dailyRouteData = req.body;
  const result = await DailyRouteServices.createDailyRouteIntoDB(dailyRouteData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DailyRoute is created successfully',
    data: result,
  });
});

const getSingleDailyRoute = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DailyRouteServices.getSingleDailyRouteFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DailyRoute is retrieved successfully',
    data: result,
  });
});

const getAllDailyRoutes = catchAsync(async (req, res) => {
  const result = await DailyRouteServices.getAllDailyRoutesFromDB(req.query, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DailyRoutes are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateDailyRoute = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { dailyRoute } = req.body;
  const result = await DailyRouteServices.updateDailyRouteIntoDB(id, dailyRoute);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DailyRoute is updated successfully',
    data: result,
  });
});

const deleteDailyRoute = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DailyRouteServices.deleteDailyRouteFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DailyRoute is deleted successfully',
    data: result,
  });
});

export const DailyRouteControllers = {
  createDailyRoute,
  getSingleDailyRoute,
  getAllDailyRoutes,
  updateDailyRoute,
  deleteDailyRoute,
};
