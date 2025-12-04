/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { JOB_SEARCHABLE_FIELDS } from './Job.constant';
import mongoose from 'mongoose';
import { Job } from './Job.model';
import { User } from '../User/user.model';
import { flattenObject } from './job.utils';
import { ChatRoom } from '../ChatRoom/ChatRoom.model';
import { DailyRoute } from '../dailyRoute/dailyRoute.model';
import { Notification } from '../Notification/Notification.model';
// Arrow function to generate the next jobId
const generateJobId = async (): Promise<string> => {
  // Find the latest job in the collection
  const lastJob = await Job.findOne().sort({ _id: -1 });
  // If no jobs exist, return the first jobId 'JOB-0001'
  if (!lastJob) {
    return 'JOB-0001';
  }

  // Extract the numeric part from the last jobId (e.g., 'JOB-0009' -> 9)
  const lastJobId = lastJob.jobId;
  const match = lastJobId.match(/^JOB-(\d+)$/);

  if (match && match[1]) {
    // Convert the extracted number to a number type, increment by 1
    const lastJobNumber = parseInt(match[1], 10);
    const nextJobNumber = lastJobNumber + 1;

    // Format the next job number to have leading zeros (e.g., 10 -> 0010)
    return `JOB-${nextJobNumber.toString().padStart(4, '0')}`;
  } else {
    throw new Error('Invalid jobId format.');
  }
};

const createJobIntoDB = async (payload: any) => {
  // try {
  const { contact } = payload;
  const userdata = {
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    password: contact.password || '12345',
    role: contact.userType,
    userType: contact.userType,
  };

  const existingUser = await User.isUserExistsByCustomEmail(contact.email);
    console.log('existingUser password', existingUser?.password);


  if (!existingUser) {
    // Create User
    console.log('Creating new user password', userdata.password);
    const createdUser = await User.create(userdata);
    // console.log("createdUser.....", createdUser);

    if (!createdUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User');
    }
    //  console.log('createdUser', createdUser);
    // Add createdUser's _id to the payload for Job creation
    payload.userId = createdUser._id;
  }

  if (existingUser) {
    payload.userId = (existingUser as any)._id;
  }




  // console.log('existingUser', existingUser);
  const newJobId = await generateJobId();
  payload.jobId = newJobId;

  // console.log('newJobId', newJobId);
  //  console.log('Payload in createJobIntoDB:', payload);
  // Create Job

  payload.courierPrice = payload.totalPrice ? payload.totalPrice : 0;

  const createdJob = await Job.create(payload);
  // console.log("createdJob.....", createdJob);

    if (!createdJob) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Job');
    }else{
     await Notification.create({
      type: 'jobCreated',
      userId: createdJob.userId,
      message: `A new job with ID ${createdJob.jobId} has been created.`,
      readBy: [],
      // subscriberId: payload.userId,
    });
  }
 
  if (!createdJob) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Job');
  }
  // Populate userId field to get the full user data
  const jobWithUser = await Job.findById(createdJob._id).populate('userId');

  if(jobWithUser?.userId._id){
     
    const user = await User.findById(jobWithUser?.userId._id);
    if(user && user?.jobPosted !== undefined){
      user.jobPosted = user?.jobPosted+1
    }

    await user?.save();

  }


  // Return the job along with the populated user data
  return jobWithUser;

  // } catch (error) {
  // console.error("Error during job creation:", error);
  // throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
};

const getAllJobsFromDB = async (query: Record<string, unknown>) => {

  console.log('query in service:', query);

  const JobQuery = new QueryBuilder(Job.find(), query)
    .search(JOB_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  console.log('query in service:2222 ', query);
  const result = await JobQuery.modelQuery;
  const meta = await JobQuery.countTotal();
  
  console.log('query in service:333333 ', result);
  console.log('query in service:333333 ', meta);
  return {
    result,
    meta,
  };
};

const getAllJobsForUserFromDB = async (
  query: Record<string, unknown>,
  user: any,
) => {
  const { userEmail } = user;
  const usr = await User.isUserExistsByCustomEmail(userEmail);
  if (!usr) {
    throw new Error('User not found');
  }

  let sortOption = {};
  // Check if a 'sort' parameter exists in the query for 'courierPrice'
  if (query.sortBy === 'courierPrice') {
    const order = query.order === 'desc' ? -1 : 1; // Default to ascending (1), descending (-1)
    sortOption = { courierPrice: order }; // Sort by 'courierPrice' field
  }

  let baseQuery;

  // // Accept both 'user', 'company', and 'superAdmin' as valid roles for userId
  if (usr.role === 'user' || usr.role === 'company') {
    console.log('ahmad text user/company');
    baseQuery = Job.find({ userId: (usr as any)._id });
  } else if (usr.role === 'courier') {
    baseQuery = Job.find({ courierId: (usr as any)._id });
  } else {
    // } else if (usr.role === 'superAdmin' || usr.role === 'admin') {
    baseQuery = Job.find();
  }

  // Create the query builder instance
  const JobQuery = new QueryBuilder(baseQuery, query)
    .search(JOB_SEARCHABLE_FIELDS) // Search functionality
    .filter() // Apply filters
    .sort() // Apply sorting (this will use dynamic sort if provided in the query)
    .paginate() // Apply pagination
    .fields(); // Apply field selection

  // If 'sortBy' is provided in the query, adjust sorting dynamically
  if (Object.keys(sortOption).length > 0) {
    JobQuery.modelQuery = JobQuery.modelQuery.sort(sortOption);
  }

  // Execute the query and return results
  const result = await JobQuery.modelQuery;
  const meta = await JobQuery.countTotal();

  return {
    result,
    meta,
  };
};
const getAllJobsWithAllStatusFromDB = async () => {
  const allJobs = await Job.countDocuments({});
  const allPendingJobs = await Job.countDocuments({ status: 'pending' });
  const allAcceptedJobs = await Job.countDocuments({ status: 'accepted' });
  const allCompletedJobs = await Job.countDocuments({ status: 'completed' });
  const allCancelledJobs = await Job.countDocuments({ status: 'cancelled' });

  return {
    allJobs,
    allPendingJobs,
    allAcceptedJobs,
    allCompletedJobs,
    allCancelledJobs,
  };
};

const getDailyRouteJobsFromDB = async (
  query: Record<string, unknown>,
  user: any,
) => {
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
    const startOfDay = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0,
        0,
        0,
      ),
    );
    const endOfDay = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate() + 1,
        0,
        0,
        0,
      ),
    );

    // dateFilter = {
    //   'pickupDateInfo.date': { $gte: startOfDay, $lt: endOfDay },
    // };

    dateFilter = {
      $or: [
        { 'pickupDateInfo.date': { $gte: startOfDay, $lt: endOfDay } },
        { 'deliveryDateInfo.date': { $gte: startOfDay, $lt: endOfDay } },
      ],
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
  const result = await Job.findById(id)
    .populate('userId')
    .populate('courierId');

  return result;
};

const updateJobIntoDB = async (id: string, payload: any, user: any) => {
  const { userEmail } = user;
  const usr = await User.isUserExistsByCustomEmail(userEmail);
  if (!usr) {
    throw new Error('User not found');
  }

  const { items } = payload;
  const flattenedPayload = flattenObject(payload);
  const existingJob = await mongoose.connection
    .collection('jobs')
    .findOne({ _id: new mongoose.Types.ObjectId(id) });

  if (!existingJob) {
    throw new Error('Job not found');
  }
  if (existingJob.isDeleted) {
    throw new Error('Cannot update a deleted Job');
  }

if (usr.role === 'user' || usr.role === 'company' ) {
    if(existingJob.adminApproved === true) {
      throw new Error('You are not authorized to update this Job after admin approval');
    }
    if(existingJob.status === 'accepted' || existingJob.status === 'in-progress' || existingJob.status === 'completed') {
      throw new Error('You are not authorized to update this Job after Courier approval');
    }
  }
if (usr.role === 'superAdmin' || usr.role === 'admin' ) {
    if(existingJob.status === 'accepted' || existingJob.status === 'in-progress' || existingJob.status === 'completed') {
      throw new Error('You are not authorized to update this Job after Courier acceptance');
    }
  }


  const updateQuery: any = { $set: {} };
  // Handle "add" and "remove" for items separately to avoid conflicts
  if (items) {
     console.log('items testing:', items);
    //  console.log('items.add', items.add); 
    //  console.log('items.add.length > 0', items.add.length > 0); 
    if (items.add && items.add.length > 0) {
      // First update: Add new items
      await Job.updateOne(
        { _id: id },
        { $push: { items: { $each: items.add } } },
      );
    }

    if (items.remove && items.remove.length > 0) {
      // Second update: Remove items by ID
      await Job.updateOne(
        { _id: id },
        { $pull: { items: { _id: { $in: items.remove } } } },
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
  // if (usr.role === 'courier' && payload.status === 'accepted' && existingJob.status === 'pending') {
  if (usr.role === 'courier' && payload.status === 'accepted') {
    updateQuery.courierId = (usr as any)._id;

   const jobData = await Job.findOne({ _id: id }).select('userId');
   console.log('jobData before accept:', jobData?.userId);
  //  if(courierId && (courierId as any).courierId){
  //   throw new Error('This job has already been accepted by another courier');
  //  }

    let room = await ChatRoom.findOne({
      participants: { $all: [(usr as any)._id, jobData?.userId] },
    });

    if (!room) {
      room = await ChatRoom.create({ participants: [(usr as any)._id, jobData?.userId] });
    }

    if (!room) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create ChatRoom');
    }
  }

  const updatedJob = await Job.findByIdAndUpdate({ _id: id }, updateQuery, {
    new: true,
    runValidators: true,
  });

  if (!updatedJob) {
    throw new Error('Job not found after update');
  }
  if( payload.status === 'completed' && updatedJob.status === 'completed' ){
   await Notification.create({
    type: 'JobCompleted',
    courierId: updatedJob.courierId,
    userId: updatedJob.userId,
    message: `The job with ID ${updatedJob.jobId} has been completed.`,
    readBy: [],
  });
  }
  if( payload.status === 'accepted' && updatedJob.status === 'accepted' ){
   await Notification.create({
    type: 'jobAccepted',
    courierId: updatedJob.courierId,
    userId: updatedJob.userId,
    message: `The job with ID ${updatedJob.jobId} has been jobAccepted.`,
    readBy: [],
  });
  }
  if( payload.adminApproved === true && updatedJob.adminApproved === true ){
   await Notification.create({
    type: 'adminApproved',
    courierId: updatedJob.courierId,
    userId: updatedJob.userId,
    message: `The job with ID ${updatedJob.jobId} has been adminApproved.`,
    readBy: [],
  });
  }


if(usr.role === 'courier' ) {
  const pickupData: any = {};
  const deliveryData: any = {};

  if (updatedJob.from) {
    pickupData['from'] = updatedJob.from;
  }

  if (updatedJob.pickupDateInfo) {
    pickupData['pickupDateInfo'] = updatedJob.pickupDateInfo;
  }

  if (updatedJob.to) {
    deliveryData['to'] = updatedJob.to;
  }

  if (updatedJob.deliveryDateInfo) {
    deliveryData['deliveryDateInfo'] = updatedJob.deliveryDateInfo;
  }
  const dailyRouteDataPickup: any = {};
  const dailyRouteDataDelivery: any = {};
  const routeContainerPickup: any[] = [];
  const routeContainerDelivery: any[] = [];
  const item: any = {};

  if (pickupData.from) {
    // if (Object.keys(pickupData).length > 0 ) {
    item['jobId'] = updatedJob._id;
    item['address'] = pickupData.from || '';
    item['dateTimeSlot'] = pickupData.pickupDateInfo
      ? {
          date: new Date(pickupData.pickupDateInfo.date), // Ensure this is a Date object
          timeSlot: pickupData.pickupDateInfo.timeSlot || '',
        }
      : { date: new Date(), timeSlot: '' };

    item['deliveryMode'] = 'pickup';
    item['dataSource'] = 'job';
    routeContainerPickup.push(item);
    dailyRouteDataPickup.routeContainer = routeContainerPickup;

    dailyRouteDataPickup.date = pickupData.pickupDateInfo?.date
      ? new Date(pickupData.pickupDateInfo.date)
      : new Date();
    dailyRouteDataPickup.userId = updatedJob.userId;
    dailyRouteDataPickup.courierId = updatedJob.courierId;

    const existingDailyRouteData = await DailyRoute.findOne({
      date: dailyRouteDataPickup.date,
      courierId: dailyRouteDataPickup.courierId,
    });

    if (existingDailyRouteData) {
      // Update existing DailyRoute by adding new route items
      existingDailyRouteData.routeContainer.push(...routeContainerPickup);
      await existingDailyRouteData.save();
    } else {
      const dailyRouteDataCreated = await DailyRoute.create(dailyRouteDataPickup);
      if (!dailyRouteDataCreated) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to create DailyRoute',
        );
      }
    }
  }

  if (updatedJob.to) {
    // if (Object.keys(deliveryData).length > 0 ) {
    item['jobId'] = updatedJob._id;
    item['address'] = deliveryData.to || '';
    item['dateTimeSlot'] = deliveryData.deliveryDateInfo
      ? {
          date: new Date(deliveryData.deliveryDateInfo.date), // Ensure this is a Date object
          timeSlot: deliveryData.deliveryDateInfo.timeSlot || '',
        }
      : { date: new Date(), timeSlot: '' };

    item['deliveryMode'] = 'delivery';
    item['dataSource'] = 'job';
    routeContainerDelivery.push(item);
    dailyRouteDataDelivery.routeContainer = routeContainerDelivery;
    dailyRouteDataDelivery.date = deliveryData.deliveryDateInfo?.date
      ? new Date(deliveryData.deliveryDateInfo.date)
      : new Date();
    dailyRouteDataDelivery.userId = updatedJob.userId;
    dailyRouteDataDelivery.courierId = updatedJob.courierId;

    const existingDailyRoute = await DailyRoute.findOne({
      date: dailyRouteDataDelivery.date,
      courierId: dailyRouteDataDelivery.courierId,
    });

    if (existingDailyRoute) {

      existingDailyRoute.routeContainer.push(...routeContainerDelivery);
      await existingDailyRoute.save();
    } else {
      const dailyRouteDataCreated = await DailyRoute.create(dailyRouteDataDelivery);
      if (!dailyRouteDataCreated) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to create DailyRoute',
        );
      }
    }
  }
}

  return updatedJob;

}


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
  getDailyRouteJobsFromDB,
  getAllJobsWithAllStatusFromDB,
};
