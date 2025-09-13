/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { SupportSearchableFields } from './Support.constant';
import mongoose from 'mongoose';
import { TSupport } from './Support.interface';
import { Support } from './Support.model';

const createSupportIntoDB = async (
  payload: TSupport,
) => {
  const result = await Support.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Support');
  }

  return result;
};

const getAllSupportsFromDB = async (query: Record<string, unknown>) => {
  const SupportQuery = new QueryBuilder(
    Support.find(),
    query,
  )
    .search(SupportSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await SupportQuery.modelQuery;
  const meta = await SupportQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleSupportFromDB = async (id: string) => {
  const result = await Support.findById(id);

  return result;
};

const updateSupportIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('supports')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService?.name) {
    throw new Error('Support not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted Support');
  }

  const updatedData = await Support.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('Support not found after update');
  }

  return updatedData;
};

const deleteSupportFromDB = async (id: string) => {
  const deletedService = await Support.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Support');
  }

  return deletedService;
};

export const SupportServices = {
  createSupportIntoDB,
  getAllSupportsFromDB,
  getSingleSupportFromDB,
  updateSupportIntoDB,
  deleteSupportFromDB,
};
