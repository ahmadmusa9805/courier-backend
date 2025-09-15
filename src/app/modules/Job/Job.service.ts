/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { JOB_SEARCHABLE_FIELDS } from './Job.constant';
import mongoose from 'mongoose';
import { Job } from './Job.model';
import { User } from '../User/user.model';
import { flattenObject } from './job.utils';


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

const getAllJobsFromDB = async (query: Record<string, unknown>) => {
    console.log('query', query)
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

const getAllJobsForUserFromDB = async (query: Record<string, unknown>, user: any) => {


  const { userEmail } = user;
  const usr = await User.isUserExistsByCustomEmail(userEmail);

  if (!usr) {
    throw new Error('User not found');
  }


  // // Accept both 'user', 'company', and 'superAdmin' as valid roles for userId
  if (usr.role === 'user' || usr.role === 'company') {
    const JobQuery = new QueryBuilder(
      Job.find({userId:usr._id}),
      query,
    )
      .search(JOB_SEARCHABLE_FIELDS)
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await JobQuery.modelQuery;
    const meta = await JobQuery.countTotal();
      console.log('result', result)
    return {
      result,
      meta,
    };
  } else if (usr.role === 'courier') {
    const JobQuery = new QueryBuilder(
      Job.find({ courierId: usr._id }),
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
  } else {
    // For any other role, return all jobs
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
  }

};

const getSingleJobFromDB = async (id: string) => {
  const result = await Job.findById(id);

  return result;
};

const updateJobIntoDB = async (id: string, payload: any) => {
  const { items, extraService, ...other } = payload;
  const flattenedPayload = flattenObject(payload);  // Flatten the entire payload

  console.log("Flattened Payload:", flattenedPayload);

  const existingJob = await mongoose.connection
    .collection('jobs')
    .findOne({ _id: new mongoose.Types.ObjectId(id) });

  if (!existingJob) {
    throw new Error('Job not found');
  }

  if (existingJob.isDeleted) {
    throw new Error('Cannot update a deleted Job');
  }

  const updateQuery: any = { $set: {} };

  // Handle "add" and "remove" for items separately to avoid conflicts
  if (items) {
    if (items.add && items.add.length > 0) {
      // First update: Add new items
      await Job.updateOne(
        { _id: id },
        { $push: { items: { $each: items.add } } }
      );
    }

    if (items.remove && items.remove.length > 0) {
      // Second update: Remove items by ID
      await Job.updateOne(
        { _id: id },
        { $pull: { items: { _id: { $in: items.remove } } } }
      );
    }
  }

  // Add other fields from the flattened payload to the update query
  for (const key in flattenedPayload) {
    if (flattenedPayload[key] !== undefined) {
      updateQuery.$set[key] = flattenedPayload[key];
    }
  }

  // Perform the update for other fields
  const updatedJob = await Job.findByIdAndUpdate(
    { _id: id },
    updateQuery,
    { new: true, runValidators: true }
  );

  if (!updatedJob) {
    throw new Error('Job not found after update');
  }

  return updatedJob;
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
  getAllJobsForUserFromDB
};
