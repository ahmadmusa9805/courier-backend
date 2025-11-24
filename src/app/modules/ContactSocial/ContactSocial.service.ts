/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { CONTACTSOCIAL_SEARCHABLE_FIELDS } from './ContactSocial.constant';
import mongoose from 'mongoose';
import { TContactSocial } from './ContactSocial.interface';
import { ContactSocial } from './ContactSocial.model';

const createContactSocialIntoDB = async (
  payload: TContactSocial,
) => {
 const term = await ContactSocial.find({ isDeleted: false });
  
  if(term.length > 0){
    const updatedData = await ContactSocial.findByIdAndUpdate(
    { _id: term[0]._id },
    payload,
    { new: true, runValidators: true },
  );

  return updatedData;
    // throw new AppError(httpStatus.CONFLICT, 'Term already exists');
  }
  const result = await ContactSocial.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create ContactSocial');
  }

  return result;

};

const getAllContactSocialsFromDB = async (query: Record<string, unknown>) => {
  const ContactSocialQuery = new QueryBuilder(
    ContactSocial.find(),
    query,
  )
    .search(CONTACTSOCIAL_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await ContactSocialQuery.modelQuery;
  const meta = await ContactSocialQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleContactSocialFromDB = async () => {
  const result = await ContactSocial.find();
  
  return result[0];
};

const updateContactSocialIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('contactsocials')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService?.name) {
    throw new Error('ContactSocial not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted ContactSocial');
  }

  const updatedData = await ContactSocial.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('ContactSocial not found after update');
  }

  return updatedData;
};

const deleteContactSocialFromDB = async (id: string) => {
  const deletedService = await ContactSocial.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete ContactSocial');
  }

  return deletedService;
};

export const ContactSocialServices = {
  createContactSocialIntoDB,
  getAllContactSocialsFromDB,
  getSingleContactSocialFromDB,
  updateContactSocialIntoDB,
  deleteContactSocialFromDB,
};
