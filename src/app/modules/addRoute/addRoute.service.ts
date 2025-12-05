/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { ADDROUTE_SEARCHABLE_FIELDS } from './addRoute.constant';
import mongoose from 'mongoose';
import { TAddRoute } from './addRoute.interface';
import { AddRoute } from './addRoute.model';
import { DailyRoute } from '../dailyRoute/dailyRoute.model';
import { User } from '../User/user.model';

const createAddRouteIntoDB = async (payload: TAddRoute, user:any) => {
  const { userEmail } = user;
  const usr = await User.isUserExistsByCustomEmail(userEmail);

  if (!usr) {
    throw new Error('User not found');
  }

   payload.courierId = (usr as any)._id;
  const AddRouteData = await AddRoute.create(payload);


  if (!AddRouteData) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create AddRoute');
  }

  const pickupData: any = {};
  const deliveryData: any = {};

  if (AddRouteData.from) {
    pickupData['from'] = payload.from;
  }
  if (AddRouteData.pickupMinute) {
    pickupData['pickupMinute'] = payload.pickupMinute;
  }
  if (AddRouteData.pickupExtraText) {
    pickupData['pickupExtraText'] = payload.pickupExtraText;
  }
  if (AddRouteData.pickupDateInfo) {
    pickupData['pickupDateInfo'] = payload.pickupDateInfo;
  }
  if (AddRouteData.pickupExtraAdress) {
    pickupData['pickupExtraAdress'] = payload.pickupExtraAdress;
  }

  if (AddRouteData.to) {
    deliveryData['to'] = payload.to;
  }
  if (AddRouteData.deliveryMinute) {
    deliveryData['deliveryMinute'] = payload.deliveryMinute;
  }
  if (AddRouteData.deliveryExtraText) {
    deliveryData['deliveryExtraText'] = payload.deliveryExtraText;
  }
  if (AddRouteData.deliveryDateInfo) {
    deliveryData['deliveryDateInfo'] = payload.deliveryDateInfo;
  }
  if (AddRouteData.deliveryExtraAdress) {
    deliveryData['deliveryExtraAdress'] = payload.deliveryExtraAdress;
  }

  const dailyRouteDataPickup: any = {};
  const dailyRouteDataDelivery: any = {};
  const routeContainerPickup: any[] = [];
  const routeContainerDelivery: any[] = [];
  const item: any = {};

  if (pickupData.from) {
  // if (Object.keys(pickupData).length > 0 ) {
    item['addRouteId'] = AddRouteData._id;
    item['address'] = pickupData.from || '';
    item['dateTimeSlot'] = pickupData.pickupDateInfo
      ? {
          date: new Date(pickupData.pickupDateInfo.date), // Ensure this is a Date object
          timeSlot: pickupData.pickupDateInfo.timeSlot || '',
        }
      : { date: new Date(), timeSlot: '' };

    item['deliveryMode'] = 'pickup';
    item['dataSource'] = 'addroute';
    routeContainerPickup.push(item);
    dailyRouteDataPickup.routeContainer = routeContainerPickup;

    dailyRouteDataPickup.date = pickupData.pickupDateInfo?.date
      ? new Date(pickupData.pickupDateInfo.date)
      : new Date();


    dailyRouteDataPickup.courierId = AddRouteData.courierId;  

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
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create DailyRoute');
    }
  }
  }

  if (deliveryData.to) {
  // if (Object.keys(deliveryData).length > 0 ) {
    item['addRouteId'] = AddRouteData._id;
    item['address'] = deliveryData.to || '';
    item['dateTimeSlot'] = deliveryData.deliveryDateInfo
      ? {
          date: new Date(deliveryData.deliveryDateInfo.date), // Ensure this is a Date object
          timeSlot: deliveryData.deliveryDateInfo.timeSlot || '',
        }
      : { date: new Date(), timeSlot: '' };

    item['deliveryMode'] = 'delivery';
    item['dataSource'] = 'addroute';
    routeContainerDelivery.push(item);
    dailyRouteDataDelivery.routeContainer = routeContainerDelivery;
    dailyRouteDataDelivery.date = deliveryData.deliveryDateInfo?.date
      ? new Date(deliveryData.deliveryDateInfo.date)
      : new Date();
    
       dailyRouteDataDelivery.courierId = AddRouteData.courierId;   
       
       
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
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create DailyRoute');
    }
  }
  }

  return AddRouteData;
};

const getAllAddRoutesFromDB = async (query: Record<string, unknown>) => {
  const AddRouteQuery = new QueryBuilder(AddRoute.find(), query)
    .search(ADDROUTE_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await AddRouteQuery.modelQuery;
  const meta = await AddRouteQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleAddRouteFromDB = async (id: string) => {
  const result = await AddRoute.findById(id);

  return result;
};

const updateAddRouteIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('addroutes')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService?.name) {
    throw new Error('AddRoute not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted addRoute');
  }

  const updatedData = await AddRoute.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedData) {
    throw new Error('AddRoute not found after update');
  }

  return updatedData;
};

const deleteAddRouteFromDB = async (id: string) => {
  const deletedService = await AddRoute.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete AddRoute');
  }

  return deletedService;
};

export const AddRouteServices = {
  createAddRouteIntoDB,
  getAllAddRoutesFromDB,
  getSingleAddRouteFromDB,
  updateAddRouteIntoDB,
  deleteAddRouteFromDB,
};
