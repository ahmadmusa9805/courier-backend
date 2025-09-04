import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TestimonialServices } from './Testimonial.service';

const createTestimonial = catchAsync(async (req, res) => {
  const TestimonialData = req.body;
  const result = await TestimonialServices.createTestimonialIntoDB(TestimonialData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Testimonial is created successfully',
    data: result,
  });
});

const getSingleTestimonial = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TestimonialServices.getSingleTestimonialFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Testimonial is retrieved successfully',
    data: result,
  });
});

const getAllTestimonials = catchAsync(async (req, res) => {
  const result = await TestimonialServices.getAllTestimonialsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Testimonials are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateTestimonial = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { Testimonial } = req.body;
  const result = await TestimonialServices.updateTestimonialIntoDB(id, Testimonial);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Testimonial is updated successfully',
    data: result,
  });
});

const deleteTestimonial = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TestimonialServices.deleteTestimonialFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Testimonial is deleted successfully',
    data: result,
  });
});

export const TestimonialControllers = {
  createTestimonial,
  getSingleTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
};
