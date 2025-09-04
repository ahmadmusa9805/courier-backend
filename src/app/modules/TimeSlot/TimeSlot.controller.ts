import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TimeSlotServices } from './TimeSlot.service';

const createTimeSlot = catchAsync(async (req, res) => {
  const TimeSlotData = req.body;
  const result = await TimeSlotServices.createTimeSlotIntoDB(TimeSlotData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TimeSlot is created successfully',
    data: result,
  });
});

const getSingleTimeSlot = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TimeSlotServices.getSingleTimeSlotFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TimeSlot is retrieved successfully',
    data: result,
  });
});

const getAllTimeSlots = catchAsync(async (req, res) => {
  const result = await TimeSlotServices.getAllTimeSlotsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TimeSlots are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateTimeSlot = catchAsync(async (req, res) => {
  const { id } = req.params;
  const TimeSlot = req.body;
  const result = await TimeSlotServices.updateTimeSlotIntoDB(id, TimeSlot);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TimeSlot is updated successfully',
    data: result,
  });
});

const deleteTimeSlot = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TimeSlotServices.deleteTimeSlotFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TimeSlot is deleted successfully',
    data: result,
  });
});

export const TimeSlotControllers = {
  createTimeSlot,
  getSingleTimeSlot,
  getAllTimeSlots,
  updateTimeSlot,
  deleteTimeSlot,
};
