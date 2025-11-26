/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { DAILYROUTE_SEARCHABLE_FIELDS } from './dailyRoute.constant';
import { TDailyRoute } from './dailyRoute.interface';
import { DailyRoute } from './dailyRoute.model';
import { User } from '../User/user.model';
import { Job } from '../Job/Job.model';

const createDailyRouteIntoDB = async (
  payload: TDailyRoute,
) => {
  const result = await DailyRoute.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create DailyRoute');
  }

  return result;
};

const getAllDailyRoutesFromDB = async (query: Record<string, unknown>, user:any) => {


    const { userEmail } = user;
  const usr = await User.isUserExistsByCustomEmail(userEmail);

  if (!usr) {
    throw new Error('User not found');
  }
  const DailyRouteQuery = new QueryBuilder(
    DailyRoute.find({ courierId: (usr as any)._id }),
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

const updateDailyRouteIntoDB = async (id: string, payload: any, user: any) => {
  const { userEmail } = user;
  const usr = await User.isUserExistsByCustomEmail(userEmail);
  const dailyRouteData = await DailyRoute.findById(id);

  if (!usr) {
    throw new Error('User not found');
  }
  if (!dailyRouteData) {
    throw new Error(' dailyRoute not found');
  }

  if((usr as any)._id.toString() !==  dailyRouteData?.courierId?.toString()){
    throw new Error('You are not authorized to update this dailyRoute');
  }

const { data,  routeContainer} = payload;
const { timeSlot,  address,  deliveryMode, jobId} = data;

  const updatedData = await DailyRoute.findByIdAndUpdate(
    { _id: id },
      {
      $set: {
        routeContainer: routeContainer,  // Updating routeContainer directly
      }
    },
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('DailyRoute not found after update');
  }

   const jobData = await Job.findById(jobId);
  if(deliveryMode === 'delivery' && jobData){
    jobData.to = address;
    jobData.deliveryDateInfo.timeSlot = timeSlot;
    await jobData.save();
  }
  if(deliveryMode === 'pickup' && jobData){
    jobData.from = address;
    jobData.pickupDateInfo.timeSlot = timeSlot;
    await jobData.save();
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
