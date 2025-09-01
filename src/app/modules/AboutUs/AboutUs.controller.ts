import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AboutUsServices } from './AboutUs.service';

const createAboutUs = catchAsync(async (req, res) => {
  const { about: AboutUsData } = req.body;
  const result = await AboutUsServices.createAboutUsIntoDB(AboutUsData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AboutUs is created successfully',
    data: result,
  });
});

const getSingleAboutUs = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AboutUsServices.getSingleAboutUsFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AboutUs is retrieved successfully',
    data: result,
  });
});

const getAllAboutUss = catchAsync(async (req, res) => {
  const result = await AboutUsServices.getAllAboutUssFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AboutUss are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateAboutUs = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { about: AboutUs } = req.body;
  const result = await AboutUsServices.updateAboutUsIntoDB(id, AboutUs);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AboutUs is updated successfully',
    data: result,
  });
});

const deleteAboutUs = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AboutUsServices.deleteAboutUsFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AboutUs is deleted successfully',
    data: result,
  });
});

export const AboutUsControllers = {
  createAboutUs,
  getSingleAboutUs,
  getAllAboutUss,
  updateAboutUs,
  deleteAboutUs,
};
