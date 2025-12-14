import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RatingServices } from './Rating.service';

const createRating = catchAsync(async (req, res) => {
  const RatingData = req.body;

  const result = await RatingServices.createRatingIntoDB(RatingData, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rating is created successfully',
    data: result,
  });
});

const getSingleRating = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RatingServices.getSingleRatingFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rating is retrieved successfully',
    data: result,
  });
});

const getAllRatings = catchAsync(async (req, res) => {
  const result = await RatingServices.getAllRatingsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ratings are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getAllAverageElementsRatings = catchAsync(async (req, res) => {

  const result = await RatingServices.getAllAverageElementsRatingsFromDB(req.query, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ratings are retrieved successfully',
    // meta: result.meta,
    data: result,
  });
});
const getAllRatingsOnlySingleCourier = catchAsync(async (req, res) => {

  const result = await RatingServices.getAllRatingsOnlySingleCourierFromDB(req.query, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ratings are retrieved successfully',
    // meta: result.meta,
    data: result,
  });
});

const updateRating = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Rating = req.body;
  const result = await RatingServices.updateRatingIntoDB(id, Rating);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rating is updated successfully',
    data: result,
  });
});

const deleteRating = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RatingServices.deleteRatingFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rating is deleted successfully',
    data: result,
  });
});

export const RatingControllers = {
  createRating,
  getSingleRating,
  getAllRatings,
  updateRating,
  deleteRating,
  getAllAverageElementsRatings,
  getAllRatingsOnlySingleCourier
};
