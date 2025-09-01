/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TERM_SEARCHABLE_FIELDS } from './Term.constant';
import mongoose from 'mongoose';
import { TTerm } from './Term.interface';
import { Term } from './Term.model';

const createTermIntoDB = async (
  payload: TTerm,
) => {
  const term = await Term.find({ isDeleted: false });
  
  if(term.length > 0){
    throw new AppError(httpStatus.CONFLICT, 'Term already exists');
  }
  const result = await Term.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Term');
  }

  return result;
};

const getAllTermsFromDB = async (query: Record<string, unknown>) => {
  const TermQuery = new QueryBuilder(
    Term.find({isDeleted: false}),
    query,
  )
    .search(TERM_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await TermQuery.modelQuery;
  const meta = await TermQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleTermFromDB = async (id: string) => {
  const result = await Term.findOne({ _id: id, isDeleted: false });

  return result;
};

const updateTermIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('terms')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { projection: { isDeleted: 1, description: 1 } },
    );

  if (!isDeletedService?.description) {
    throw new Error('Term not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted Term');
  }

  const updatedData = await Term.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('Term not found after update');
  }

  return updatedData;
};

const deleteTermFromDB = async (id: string) => {
  const deletedService = await Term.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Term');
  }

  return deletedService;
};

export const TermServices = {
  createTermIntoDB,
  getAllTermsFromDB,
  getSingleTermFromDB,
  updateTermIntoDB,
  deleteTermFromDB,
};
