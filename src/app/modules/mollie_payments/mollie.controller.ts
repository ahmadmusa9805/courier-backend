import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createPaymentWithMollie } from "./mollie.service";
import AppError from "../../errors/AppError";

export const createPaymentIntent = catchAsync(async (req, res) => {
//   const { userEmail } = req.user;
const body = req.body

// console.log(body)
const {jobId,url} =body
if(!jobId && !url){
  throw new AppError(400, `Job id and url not correctly provided`)
}
  const result = await createPaymentWithMollie({currency:'EUR',jobId,url})

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment Intent created successfully',
    data: result,
  });
});