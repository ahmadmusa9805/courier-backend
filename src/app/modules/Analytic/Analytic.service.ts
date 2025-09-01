/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
// import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
// import { ANALYTIC_SEARCHABLE_FIELDS } from './Analytic.constant';
import mongoose from 'mongoose';
import { TAnalytic } from './Analytic.interface';
import { Analytic } from './Analytic.model';

const createAnalyticIntoDB = async (
  payload: TAnalytic,
) => {
  const result = await Analytic.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Analytic');
  }

  return result;
};

const getAllAnalyticsCombinedFromDB = async () => {

  
 
};


// const getAllAnalyticsCombinedFromDB = async (query: Record<string, unknown>) => {
//   const AnalyticQuery = new QueryBuilder(
//     Analytic.find(),
//     query,
//   )
//     .search(AnalyticSearchableFields)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await AnalyticQuery.modelQuery;
//   const meta = await AnalyticQuery.countTotal();
//   return {
//     result,
//     meta,
//   };
// };

const getSingleAnalyticFromDB = async (id: string) => {
  const result = await Analytic.findById(id);

  return result;
};

const updateAnalyticIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('analytics')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService?.name) {
    throw new Error('Analytic not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted Analytic');
  }

  const updatedData = await Analytic.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('Analytic not found after update');
  }

  return updatedData;
};

const deleteAnalyticFromDB = async (id: string) => {
  const deletedService = await Analytic.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Analytic');
  }

  return deletedService;
};

export const AnalyticServices = {
  createAnalyticIntoDB,
  getAllAnalyticsCombinedFromDB,
  getSingleAnalyticFromDB,
  updateAnalyticIntoDB,
  deleteAnalyticFromDB,
};
