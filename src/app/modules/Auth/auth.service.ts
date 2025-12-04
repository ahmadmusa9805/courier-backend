/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
// import { sendEmail } from '../../utils/sendEmail';
import { User } from '../User/user.model';
import { TLoginUser } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';
// import { SendEmail } from '../../utils/sendEmail';
import { OtpServices } from '../Otp/otp.service';

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  console.log('payload', payload.email);
  console.log('payload?.password', payload?.password);
  const user = await User.isUserExistsByCustomEmail(payload.email);
  console.log('user', user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }


  // checking if the user is already deleted

  const isDeleted = user.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked

  // const userStatus = user?.status;

  // if (userStatus === 'blocked') {
  //   throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  // }

  //checking if the password is correct


 console.log(payload?.password, 'payload?.password');
 console.log(user?.password, 'user?.password');

 if(payload?.password !== user?.password){
throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
 }
  // if (!(await User.isPasswordMatched(payload?.password, user?.password))) 
  //   throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');


  //create token and sent to the  client
  const jwtPayload:any = {
    userEmail: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    // needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomEmail(userData.userEmail);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      email: userData.userEmail,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userEmail, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByCustomEmail(userEmail);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // // checking if the user is blocked
  // const userStatus = user?.status;

  // if (userStatus === 'blocked') {
  //   throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  // }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    userEmail: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (userEmail: string) => {

  console.log('userEmail', userEmail);

  // checking if the user is exist
  const user = await User.isUserExistsByCustomEmail(userEmail);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }
  
  // const jwtPayload = {
  //   userEmail: user.email,
  //   role: user.role,
  // };

  // const resetToken = createToken(
  //   jwtPayload,
  //   config.jwt_access_secret as string,
  //   '10m',
  // );

  // const resetUILink = `${config.reset_pass_ui_link}?email=${user.email}&token=${resetToken} `;
  // // console.log(resetUILink, 'resetUILink');

  // SendEmail.sendResetLinkToEmail(user.email, resetUILink);
          // console.log(newCustomer, 'newCustomer');
  // if(user.role === 'admin' || user.role === 'superAdmin'){
  //   const otp = await OtpServices.generateAndSendOTP(user.email);
  //     if (!otp) {
  //         throw new AppError(httpStatus.FORBIDDEN, 'Otp not created ! !');
  //       }
  //   return {otp, resetToken};
  //  }

  // return {resetToken};



    const otp = await OtpServices.generateAndSendOTP(user.email);
      if (!otp) {
          throw new AppError(httpStatus.FORBIDDEN, 'Otp not created ! !');
        }
    return "OTP sent to the email succesfully!";
   
   
};


const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomEmail(payload?.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if ( isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  // const userStatus = user?.status;

  // if (userStatus === 'blocked') {
  //   throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  // }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  //localhost:3000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4

  if (payload.email !== decoded.userEmail) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      email: decoded.userEmail,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
