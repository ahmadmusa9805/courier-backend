/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { CONTACT_SEARCHABLE_FIELDS } from './Contact.constant';
import mongoose from 'mongoose';
import { TContact } from './Contact.interface';
import { Contact } from './Contact.model';

const createContactIntoDB = async (
  payload: TContact,
) => {
  const result = await Contact.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Contact');
  }

  return result;
};

const getAllContactsFromDB = async (query: Record<string, unknown>) => {
  const ContactQuery = new QueryBuilder(
    Contact.find({isDeleted: false}),
    query,
  )
    .search(CONTACT_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await ContactQuery.modelQuery;
  const meta = await ContactQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleContactFromDB = async (id: string) => {
  const result = await Contact.findOne({ _id: id, isDeleted: false });

  return result;
};

const updateContactIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('contacts')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { projection: { isDeleted: 1, phone: 1 } },
    );

  if (!isDeletedService?.phone) {
    throw new Error('Contact not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted Contact');
  }

  const updatedData = await Contact.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('Contact not found after update');
  }

  return updatedData;
};

const deleteContactFromDB = async (id: string) => {
  const deletedService = await Contact.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Contact');
  }

  return deletedService;
};

export const ContactServices = {
  createContactIntoDB,
  getAllContactsFromDB,
  getSingleContactFromDB,
  updateContactIntoDB,
  deleteContactFromDB,
};
