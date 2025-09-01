import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OtpServices } from './otp.service';


const otpVeryfy = catchAsync(async (req, res) => {
  const { otp: otpData } = req.body;
  const result = await OtpServices.verifyOTP(req.user, otpData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP verified successfully.',
    data: result,
  });
});
const generateOtp = catchAsync(async (req, res) => {
  const { otp: otpData } = req.body;
  const result = await OtpServices.generateAndSendOTP( otpData);
  // const result = await OtpServices.generateAndSendOTP(req.user, otpData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Created OTP Successfully.',
    data: result,
  });
});

const otpVeryfyForgetPassword = catchAsync(async (req, res) => {
  const  otp  = req.body;
  const result = await OtpServices.otpVeryfyForgetPasswordIntoDB(otp);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP verified successfully.',
    data: result,
  });
});

export const OtpControllers = {
  otpVeryfy,
  generateOtp,
  otpVeryfyForgetPassword
};