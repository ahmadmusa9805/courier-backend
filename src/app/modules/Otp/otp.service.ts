/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Otp } from "./otp.model";
// import { User } from "../User/user.model";
import { SendEmail } from "../../utils/sendEmail";
import { User } from "../User/user.model";
import { createToken } from "../Auth/auth.utils";
import config from "../../config";



const generateAndSendOTP = async (email: any ) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP

    // Save OTP to database
    await Otp.create({email, otp });
    console.log(`Sending OTP ${otp} to user email ${email}`);

    // Simulate sending OTP (e.g., SMS or email)
    await SendEmail.sendOTPEmail(email, otp);
    console.log(`2..Sending OTP ${otp} to user email ${email}`);

    return otp;

};
const verifyOTP = async (user: any, payload : any) => {
    const { email, otp } = payload;
    const record = await Otp.findOne({ email, otp });

    if (!record) {
        throw new AppError(httpStatus.BAD_REQUEST,  "The OTP is incorrect. Please try again.");  // OTP not found
    }

    // Check expiration (5 minutes)
    const EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (Date.now() - new Date(record.createdAt).getTime() > EXPIRATION_TIME) {
      await Otp.deleteOne({ _id: record._id }); // Remove expired OTP
      const otp = await OtpServices.generateAndSendOTP(email);

      if (!otp) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `otp not created`
        );
      }

      return {
        success: false,
        message: "The OTP is expired. Please try again to continue. A new OTP is sent again.",	 
      };
    }


      // // OTP is valid
      await Otp.deleteOne({ _id: record._id }); // Remove used OTP


    //   const userData = await User.findOne({ email });
    //   if (userData) {
    //     userData.otpVerified = true; // Update the otpVerified field
    //     await userData.save(); // Save the updated user document
    //   } else {
    //     throw new AppError(httpStatus.BAD_REQUEST, "User not found.");
    // }

    // const result = await User.updateOne(
    //     { email }, // Filter by email
    //     { $set: { otpVerified: true } } // Update the otpVerified field
    //   );
      
    //   if (result.modifiedCount === 0) {
    //     throw new AppError(httpStatus.BAD_REQUEST, "User not found.");
    //   }

      return true;
};

const otpVeryfyForgetPasswordIntoDB = async ( payload : any) => {
    const { email, otp } = payload;
    const user = await User.findOne({ email });

    const record = await Otp.findOne({ email, otp });

    if (!record) {
        throw new AppError(httpStatus.BAD_REQUEST,  "The OTP is incorrect. Please try again.");  // OTP not found
    }

    // Check expiration (5 minutes)
    const EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (Date.now() - new Date(record.createdAt).getTime() > EXPIRATION_TIME) {
      await Otp.deleteOne({ _id: record._id }); // Remove expired OTP
      const otp = await OtpServices.generateAndSendOTP(email);

      if (!otp) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `otp not created`
        );
      }

      return {
        success: false,
        message: "The OTP is expired. Please try again to continue. A new OTP is sent again.",	 
      };
    }

  // // OTP is valid
  await Otp.deleteOne({ _id: record._id }); // Remove used OTP
 
  if(!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found.");
  }

  const jwtPayload:any = {
    userEmail: user.email,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );
    
  return {resetToken};
};

export const OtpServices = {
    generateAndSendOTP,
    verifyOTP,
    otpVeryfyForgetPasswordIntoDB
    
};
