/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { DAILYROUTE_SEARCHABLE_FIELDS } from './dailyRoute.constant';
import mongoose from 'mongoose';
import { TDailyRoute } from './dailyRoute.interface';
import { DailyRoute } from './dailyRoute.model';

const createDailyRouteIntoDB = async (
  payload: TDailyRoute,
) => {
  const result = await DailyRoute.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create DailyRoute');
  }

  return result;
};

const getAllDailyRoutesFromDB = async (query: Record<string, unknown>) => {
  const DailyRouteQuery = new QueryBuilder(
    DailyRoute.find(),
    query,
  )
    .search(DAILYROUTE_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await DailyRouteQuery.modelQuery;
  const meta = await DailyRouteQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleDailyRouteFromDB = async (id: string) => {
  const result = await DailyRoute.findById(id);

  return result;
};

const updateDailyRouteIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('dailyroutes')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService?.name) {
    throw new Error('DailyRoute not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted dailyRoute');
  }

  const updatedData = await DailyRoute.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('DailyRoute not found after update');
  }

  return updatedData;
};

const deleteDailyRouteFromDB = async (id: string) => {
  const deletedService = await DailyRoute.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete DailyRoute');
  }

  return deletedService;
};

export const DailyRouteServices = {
  createDailyRouteIntoDB,
  getAllDailyRoutesFromDB,
  getSingleDailyRouteFromDB,
  updateDailyRouteIntoDB,
  deleteDailyRouteFromDB,
};
