import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createPaymentWithMollie } from "./mollie.service";

export const createPaymentIntent = catchAsync(async (req, res) => {
//   const { userEmail } = req.user;
const body = req.body

// console.log(body)
const {description , metadata ,amount} =body
  const result = await createPaymentWithMollie({currency:'EUR',description,metadata,amount})

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment Intent created successfully',
    data: result,
  });
});