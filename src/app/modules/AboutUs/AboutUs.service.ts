/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { ABOUTUS_SEARCHABLE_FIELDS } from './AboutUs.constant';
import mongoose from 'mongoose';
import { AboutUs } from './AboutUs.model';

const createAboutUsIntoDB = async (
  payload: any,
) => {
  // eslint-disable-next-line no-console
  const result = await AboutUs.create(payload);
  // console.log(result, "test2");
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create AboutUs');
  }

  return result;
};

const getAllAboutUssFromDB = async (query: Record<string, unknown>) => {
  const AboutUsQuery = new QueryBuilder(
    AboutUs.find({isDeleted: false}),
    query,
  )
    .search(ABOUTUS_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await AboutUsQuery.modelQuery;
  const meta = await AboutUsQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleAboutUsFromDB = async (id: string) => {
  const result = await AboutUs.findOne({ _id: id, isDeleted: false });

  return result;
};

const updateAboutUsIntoDB = async (id: string, payload: any) => {

  const isDeletedService = await mongoose.connection
    .collection('aboutus')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { projection: { isDeleted: 1, description: 1 } },
    );


  if (!isDeletedService?.description) {
    throw new Error('AboutUs not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted AboutUs');
  }

  const updatedData = await AboutUs.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('AboutUs not found after update');
  }

  return updatedData;
};

const deleteAboutUsFromDB = async (id: string) => {
  const deletedService = await AboutUs.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete AboutUs');
  }

  return deletedService;
};

export const AboutUsServices = {
  createAboutUsIntoDB,
  getAllAboutUssFromDB,
  getSingleAboutUsFromDB,
  updateAboutUsIntoDB,
  deleteAboutUsFromDB,
};
