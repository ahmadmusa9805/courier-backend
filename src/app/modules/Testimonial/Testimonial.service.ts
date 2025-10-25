/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TESTIMONIAL_SEARCHABLE_FIELDS } from './Testimonial.constant';
import mongoose from 'mongoose';
import { TTestimonial } from './Testimonial.interface';
import { Testimonial } from './Testimonial.model';

const createTestimonialIntoDB = async (
  payload: TTestimonial,
) => {
  const result = await Testimonial.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Testimonial');
  }

  return result;
};

const getAllTestimonialsFromDB = async (query: Record<string, unknown>) => {
  const TestimonialQuery = new QueryBuilder(
    Testimonial.find(),
    query,
  )
    .search(TESTIMONIAL_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await TestimonialQuery.modelQuery;
  const meta = await TestimonialQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleTestimonialFromDB = async (id: string) => {
  const result = await Testimonial.findById(id);

  return result;
};

const updateTestimonialIntoDB = async (id: string, payload: any) => {

  const isDeletedService = await mongoose.connection
    .collection('testimonials')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
    );

  if (!isDeletedService) {
    throw new Error('Testimonial not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted Testimonial');
  }

  const updatedData = await Testimonial.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('Testimonial not found after update');
  }

  return updatedData;
};

const deleteTestimonialFromDB = async (id: string) => {
  const deletedService = await Testimonial.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Testimonial');
  }

  return deletedService;
};

export const TestimonialServices = {
  createTestimonialIntoDB,
  getAllTestimonialsFromDB,
  getSingleTestimonialFromDB,
  updateTestimonialIntoDB,
  deleteTestimonialFromDB,
};
