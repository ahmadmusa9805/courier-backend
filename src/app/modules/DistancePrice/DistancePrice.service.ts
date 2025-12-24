/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { DISTANCEPRICE_SEARCHABLE_FIELDS } from './DistancePrice.constant';
import mongoose from 'mongoose';
import { TDistancePrice } from './DistancePrice.interface';
import { DistancePrice } from './DistancePrice.model';

const createDistancePriceIntoDB = async (
  payload: TDistancePrice,
) => {
  const distancePriceData = await DistancePrice.find({ });
  
  if(distancePriceData.length > 0){
    const updatedData = await DistancePrice.findByIdAndUpdate(
    { _id: distancePriceData[0]._id },
    payload,
    { new: true, runValidators: true },
  );

  return updatedData;
    // throw new AppError(httpStatus.CONFLICT, 'Term already exists');
  }

  const result = await DistancePrice.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create DistancePrice');
  }

  return result;

};

const getAllDistancePricesFromDB = async (query: Record<string, unknown>) => {
  const DistancePriceQuery = new QueryBuilder(
    DistancePrice.find(),
    query,
  )
    .search(DISTANCEPRICE_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await DistancePriceQuery.modelQuery;
  const meta = await DistancePriceQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleDistancePriceFromDB = async (id: string) => {
  const result = await DistancePrice.findById(id);

  return result;
};

const updateDistancePriceIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('distanceprices')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      // { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService) {
    throw new Error('DistancePrice not found');
  }

  // if (isDeletedService.isDeleted) {
  //   throw new Error('Cannot update a deleted DistancePrice');
  // }

  const updatedData = await DistancePrice.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('DistancePrice not found after update');
  }

  return updatedData;
};

const deleteDistancePriceFromDB = async (id: string) => {
  const deletedService = await DistancePrice.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete DistancePrice');
  }

  return deletedService;
};

export const DistancePriceServices = {
  createDistancePriceIntoDB,
  getAllDistancePricesFromDB,
  getSingleDistancePriceFromDB,
  updateDistancePriceIntoDB,
  deleteDistancePriceFromDB,
};
