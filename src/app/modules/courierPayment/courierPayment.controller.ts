import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourierPaymentServices } from './courierPayment.service';

const createCourierPayment = catchAsync(async (req, res) => {
  const { courierPayment: courierPaymentData } = req.body;
  const result = await CourierPaymentServices.createCourierPaymentIntoDB(courierPaymentData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'CourierPayment is created successfully',
    data: result,
  });
});

const getSingleCourierPayment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourierPaymentServices.getSingleCourierPaymentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'CourierPayment is retrieved successfully',
    data: result,
  });
});

const getAllCourierPayments = catchAsync(async (req, res) => {
  const result = await CourierPaymentServices.getAllCourierPaymentsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'CourierPayments are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getAllCourierPaymentsWeekly = catchAsync(async (req, res) => {
  const result = await CourierPaymentServices.getAllCourierPaymentsWeeklyFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'CourierPayments are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateCourierPayment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { courierPayment } = req.body;
  const result = await CourierPaymentServices.updateCourierPaymentIntoDB(id, courierPayment);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'CourierPayment is updated successfully',
    data: result,
  });
});

const deleteCourierPayment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourierPaymentServices.deleteCourierPaymentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'CourierPayment is deleted successfully',
    data: result,
  });
});

export const CourierPaymentControllers = {
  createCourierPayment,
  getSingleCourierPayment,
  getAllCourierPayments,
  updateCourierPayment,
  deleteCourierPayment,
  getAllCourierPaymentsWeekly
};
