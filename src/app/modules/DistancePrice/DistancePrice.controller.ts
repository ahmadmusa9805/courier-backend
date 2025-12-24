import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DistancePriceServices } from './DistancePrice.service';

const createDistancePrice = catchAsync(async (req, res) => {
  const DistancePriceData = req.body;
  const result = await DistancePriceServices.createDistancePriceIntoDB(DistancePriceData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DistancePrice is created successfully',
    data: result,
  });
});

const getSingleDistancePrice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DistancePriceServices.getSingleDistancePriceFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DistancePrice is retrieved successfully',
    data: result,
  });
});

const getAllDistancePrices = catchAsync(async (req, res) => {
  const result = await DistancePriceServices.getAllDistancePricesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DistancePrices are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateDistancePrice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { DistancePrice } = req.body;
  const result = await DistancePriceServices.updateDistancePriceIntoDB(id, DistancePrice);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DistancePrice is updated successfully',
    data: result,
  });
});

const deleteDistancePrice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DistancePriceServices.deleteDistancePriceFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DistancePrice is deleted successfully',
    data: result,
  });
});

export const DistancePriceControllers = {
  createDistancePrice,
  getSingleDistancePrice,
  getAllDistancePrices,
  updateDistancePrice,
  deleteDistancePrice,
};
