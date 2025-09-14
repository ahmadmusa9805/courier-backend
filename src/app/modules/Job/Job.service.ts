/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { JOB_SEARCHABLE_FIELDS } from './Job.constant';
import mongoose from 'mongoose';
import { TJob } from './Job.interface';
import { Job } from './Job.model';
import { User } from '../User/user.model';

const createJobIntoDB = async (payload:any) => {
  // try {
    // console.log("testing.....", payload);  
    const { contact } = payload;
    // console.log("contact.....", contact);

    // Set additional fields for user creation
    contact.role = contact.userType;
    contact.password = '12345';  // Make sure to hash the password in production!

    // Create User
    const createdUser = await User.create(contact);
    // console.log("createdUser.....", createdUser);  

    if (!createdUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User');
    }

    // Add createdUser's _id to the payload for Job creation
    payload.userId = createdUser._id;

    // Create Job
    const createdJob = await Job.create(payload);
    // console.log("createdJob.....", createdJob);  

    if (!createdJob) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Job');
    }

    // Populate userId field to get the full user data
    const jobWithUser = await Job.findById(createdJob._id).populate('userId');  

    // Return the job along with the populated user data
    return jobWithUser;
    
  // } catch (error) {
    // console.error("Error during job creation:", error);
    // throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
  }
// };

const getAllJobsFromDB = async (query: Record<string, unknown>) => {
  const JobQuery = new QueryBuilder(
    Job.find(),
    query,
  )
    .search(JOB_SEARCHABLE_FIELDS)
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
    );

  if (!isDeletedService) {
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
  const deletedService = await Job.findByIdAndDelete(
    id,
    // { isDeleted: true },
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
