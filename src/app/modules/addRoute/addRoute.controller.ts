import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AddRouteServices } from './addRoute.service';

const createAddRoute = catchAsync(async (req, res) => {
  const dailyRouteData = req.body;
  const result = await AddRouteServices.createAddRouteIntoDB(dailyRouteData, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
  message: 'AddRoute is created successfully',
    data: result,
  });

});

const getSingleAddRoute = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AddRouteServices.getSingleAddRouteFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AddRoute is retrieved successfully',
    data: result,
  });
});

const getAllAddRoutes = catchAsync(async (req, res) => {
  const result = await AddRouteServices.getAllAddRoutesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AddRoutes are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateAddRoute = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { addRoute } = req.body;
  const result = await AddRouteServices.updateAddRouteIntoDB(id, addRoute);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AddRoute is updated successfully',
    data: result,
  });
});

const deleteAddRoute = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AddRouteServices.deleteAddRouteFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AddRoute is deleted successfully',
    data: result,
  });
});

export const AddRouteControllers = {
  createAddRoute,
  getSingleAddRoute,
  getAllAddRoutes,
  updateAddRoute,
  deleteAddRoute,
};
