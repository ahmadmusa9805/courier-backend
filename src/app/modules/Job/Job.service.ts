/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { JobSearchableFields } from './Job.constant';
import mongoose from 'mongoose';
import { TJob } from './Job.interface';
import { Job } from './Job.model';

const createJobIntoDB = async (
  payload: TJob,
) => {
  const result = await Job.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Job');
  }

  return result;
};

const getAllJobsFromDB = async (query: Record<string, unknown>) => {
  const JobQuery = new QueryBuilder(
    Job.find(),
    query,
  )
    .search(JobSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await JobQuery.modelQuery;
  const meta = await JobQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleJobFromDB = async (id: string) => {
  const result = await Job.findById(id);

  return result;
};

const updateJobIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('jobs')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService?.name) {
    throw new Error('Job not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted Job');
  }

  const updatedData = await Job.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('Job not found after update');
  }

  return updatedData;
};

const deleteJobFromDB = async (id: string) => {
  const deletedService = await Job.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Job');
  }

  return deletedService;
};

export const JobServices = {
  createJobIntoDB,
  getAllJobsFromDB,
  getSingleJobFromDB,
  updateJobIntoDB,
  deleteJobFromDB,
};
