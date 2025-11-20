import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { JobServices } from './Job.service';

const createJob = catchAsync(async (req, res) => {
  const JobData = req.body;
  const result = await JobServices.createJobIntoDB(JobData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job is created successfully',
    data: result,
  });
});

const getSingleJob = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await JobServices.getSingleJobFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job is retrieved successfully',
    data: result,
  });
});

const getAllJobsForUser = catchAsync(async (req, res) => {
      console.log('ahmad text user/company00')
  const result = await JobServices.getAllJobsForUserFromDB(req.query, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jobs are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getAllJobs = catchAsync(async (req, res) => {
  const result = await JobServices.getAllJobsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jobs are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getDailyRouteJobs = catchAsync(async (req, res) => {

  const result = await JobServices.getDailyRouteJobsFromDB(req.query, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jobs are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateJob = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Job = req.body;
  const result = await JobServices.updateJobIntoDB(id, Job, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job is updated successfully',
    data: result,
  });
});

const deleteJob = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await JobServices.deleteJobFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job is deleted successfully',
    data: result,
  });
});

export const JobControllers = {
  createJob,
  getSingleJob,
  getAllJobs,
  updateJob,
  deleteJob,
  getAllJobsForUser,
  getDailyRouteJobs
};
