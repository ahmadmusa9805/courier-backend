import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AnalyticServices } from './Analytic.service';



const getAllAnalyticsCombined = catchAsync(async (req, res) => {
  const result = await AnalyticServices.getAllAnalyticsCombinedFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analytics are retrieved successfully',
    // meta: result.meta,
    data: result,
  });
});


export const AnalyticControllers = {
  getAllAnalyticsCombined,
};
