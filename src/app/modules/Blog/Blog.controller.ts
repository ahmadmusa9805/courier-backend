/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BlogServices } from './Blog.service';

const createBlog = catchAsync(async (req, res) => {
  const BlogData = req.body;
  const result = await BlogServices.createBlogIntoDB(BlogData, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog is created successfully',
    data: result,
  });
});

const getSingleBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogServices.getSingleBlogFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog is retrieved successfully',
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req, res) => {
  const result = await BlogServices.getAllBlogsFromDB(req.query);

  // sendResponse(res, {
  //   statusCode: httpStatus.OK,
  //   success: true,
  //   message: 'Blogs are retrieved successfully',
  //   meta: result.meta,
  //   data: result.result,
  // });

    res.status(200).json({
    success: true,
    message: 'test',
    meta: result.meta,
    allItemsWithStats: result.allBlogsWithStats,
    data: result.result,
  } as any);

});

const updateBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Blog = req.body;
  const result = await BlogServices.updateBlogIntoDB(id, Blog, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog is updated successfully',
    data: result,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogServices.deleteBlogFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog is deleted successfully',
    data: result,
  });
});

export const BlogControllers = {
  createBlog,
  getSingleBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
};
