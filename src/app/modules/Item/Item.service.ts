/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { ITEM_SEARCHABLE_FIELDS } from './Item.constant';
import mongoose from 'mongoose';
import { TItem } from './Item.interface';
import { Item } from './Item.model';

const createItemIntoDB = async (
  payload: TItem,
  file:any
) => {



  if(file){
    payload.img = file.location
  }

  const result = await Item.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Item');
  }

  return result;
};

const getAllItemsFromDB = async (query: Record<string, unknown>) => {
  const ItemQuery = new QueryBuilder(
    Item.find(),
    query,
  )
    .search(ITEM_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await ItemQuery.modelQuery;
  const meta = await ItemQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleItemFromDB = async (id: string) => {
  const result = await Item.findById(id);

  return result;
};

const updateItemIntoDB = async (id: string, payload: any, file:any) => {

  if(file){
    payload.img = file.path
  }

  const isDeletedService = await mongoose.connection
    .collection('items')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) }
    );

  if (!isDeletedService) {
    throw new Error('Item not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted Item');
  }

  console.log('Payload: musa', payload); // Debugging line to check payload content

  const updatedData = await Item.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('Item not found after update');
  }

  return updatedData;
};

const deleteItemFromDB = async (id: string) => {
  const deletedService = await Item.findByIdAndDelete(
    id,
    { isDeleted: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Item');
  }

  return deletedService;
};

export const ItemServices = {
  createItemIntoDB,
  getAllItemsFromDB,
  getSingleItemFromDB,
  updateItemIntoDB,
  deleteItemFromDB,
};
