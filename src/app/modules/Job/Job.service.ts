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
    const { contact } = payload;

   const userdata = {
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    password: contact.password || '12345',
    role: contact.userType,
    userType: contact.userType,
   }


    const existingUser = await User.isUserExistsByCustomEmail(contact.email);

    if (!existingUser) {

    // Create User
    const createdUser = await User.create(userdata);
    // console.log("createdUser.....", createdUser);  

    if (!createdUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User');
    }

    // Add createdUser's _id to the payload for Job creation
    payload.userId = createdUser._id;
  }

   if(existingUser) {
    payload.userId = (existingUser as any)._id;
   }



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
      Job.find({userId:(usr as any)._id}),
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
  } else if (usr.role === 'courier') {
    const JobQuery = new QueryBuilder(
      Job.find({ courierId: (usr as any)._id }),
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

const getDailyRouteJobsFromDB = async (query: Record<string, unknown>, user: any) => {

  const { userEmail } = user;
  const usr = await User.isUserExistsByCustomEmail(userEmail);

  if (!usr) {
    throw new Error('User not found');
  }

  // --- Handle pickupDate query ---
  let dateFilter = {};
  if (query.pickupDate) {
    const date = new Date(query.pickupDate as string);

    // Full UTC day range
    const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
    const endOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, 0, 0, 0));

    dateFilter = {
      'pickupDateInfo.date': { $gte: startOfDay, $lt: endOfDay },
    };

    // Prevent QueryBuilder.filter() from overriding our date filter
    delete query.pickupDate;
  }

  // --- Base query depending on role ---
  let baseQuery = {};
  if (usr.role === 'user' || usr.role === 'company') {
    baseQuery = { userId: (usr as any)._id, ...dateFilter };
  } else if (usr.role === 'courier') {
    baseQuery = { courierId: (usr as any)._id, ...dateFilter };
  } else {
    baseQuery = { ...dateFilter };
  }

  // --- Query Builder chain ---
  const JobQuery = new QueryBuilder(Job.find(baseQuery), query)
    .search(JOB_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await JobQuery.modelQuery;
  const meta = await JobQuery.countTotal();

  return { result, meta };
};

const getSingleJobFromDB = async (id: string) => {
  const result = await Job.findById(id).populate('userId').populate('courierId');

  return result;
};

const updateJobIntoDB = async (id: string, payload: any, user: any) => {

  const { userEmail } = user;
  const usr = await User.isUserExistsByCustomEmail(userEmail);

  if (!usr) {
    throw new Error('User not found');
  }



  const { items } = payload;
  // const { items, extraService, ...other } = payload;
  const flattenedPayload = flattenObject(payload);  // Flatten the entire payload

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

   // Accept both 'user', 'company', and 'superAdmin' as valid roles for userId
  if (usr.role === 'courier' || payload.status === 'accepted') {
    updateQuery.courierId = (usr as any)._id;
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
  getAllJobsForUserFromDB,
  getDailyRouteJobsFromDB
};
