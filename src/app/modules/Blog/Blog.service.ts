/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { BLOG_SEARCHABLE_FIELDS } from './Blog.constant';
import mongoose from 'mongoose';
import { TBlog } from './Blog.interface';
import { Blog } from './Blog.model';

const createBlogIntoDB = async (
  payload: TBlog,
  file: any
) => {

  if (file) {
    payload.img = file.location;
  }

  const result = await Blog.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Blog');
  }

  return result;
};

const getAllBlogsFromDB = async (query: Record<string, unknown>) => {
  const BlogQuery = new QueryBuilder(
    Blog.find(),
    query,
  )
    .search(BLOG_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await BlogQuery.modelQuery;
  const meta = await BlogQuery.countTotal();


     const allPendingJobs = await Blog.countDocuments({});
     const allAcceptedJobs = await Blog.countDocuments({isBlocked: false});
     const allCompletedJobs = await Blog.countDocuments({isBlocked: true});

     const allBlogsWithStats = {
        allPendingJobs,
        allAcceptedJobs,
        allCompletedJobs,
      }

  return {
    result,
    meta,
    allBlogsWithStats
  };
};

const getSingleBlogFromDB = async (id: string) => {
  const result = await Blog.findById(id);

  return result;
};

const updateBlogIntoDB = async (id: string, payload: any, file: any) => {

  if (file) {
    payload.img = file.location;
  }

  const isDeletedService = await mongoose.connection
    .collection('blogs')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
    );

  if (!isDeletedService) {
    throw new Error('Blog not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted Blog');
  }

  const updatedData = await Blog.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('Blog not found after update');
  }

  return updatedData;
};

const deleteBlogFromDB = async (id: string) => {
  const deletedService = await Blog.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Blog');
  }

  return deletedService;
};

export const BlogServices = {
  createBlogIntoDB,
  getAllBlogsFromDB,
  getSingleBlogFromDB,
  updateBlogIntoDB,
  deleteBlogFromDB,
};
