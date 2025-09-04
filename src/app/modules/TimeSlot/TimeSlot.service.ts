/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TIMESLOT_SEARCHABLE_FIELDS } from './TimeSlot.constant';
import mongoose from 'mongoose';
import { TTimeSlot } from './TimeSlot.interface';
import { TimeSlot } from './TimeSlot.model';

const createTimeSlotIntoDB = async (
  payload: TTimeSlot,
) => {
  const result = await TimeSlot.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create TimeSlot');
  }

  return result;
};

const getAllTimeSlotsFromDB = async (query: Record<string, unknown>) => {
  const TimeSlotQuery = new QueryBuilder(
    TimeSlot.find(),
    query,
  )
    .search(TIMESLOT_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await TimeSlotQuery.modelQuery;
  const meta = await TimeSlotQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleTimeSlotFromDB = async (id: string) => {
  const result = await TimeSlot.findById(id);

  return result;
};

const updateTimeSlotIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('timeslots')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
    );

  if (!isDeletedService) {
    throw new Error('TimeSlot not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted TimeSlot');
  }

  const updatedData = await TimeSlot.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('TimeSlot not found after update');
  }

  return updatedData;
};

const deleteTimeSlotFromDB = async (id: string) => {
  const deletedService = await TimeSlot.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete TimeSlot');
  }

  return deletedService;
};

export const TimeSlotServices = {
  createTimeSlotIntoDB,
  getAllTimeSlotsFromDB,
  getSingleTimeSlotFromDB,
  updateTimeSlotIntoDB,
  deleteTimeSlotFromDB,
};
