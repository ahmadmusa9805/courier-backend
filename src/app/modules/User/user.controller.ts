/* eslint-disable no-undef */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';
// import sendImageToCloudinary from '../../utils/cloudinary';

const createUser = catchAsync(async (req, res) => {

  const files = req.files as {
  [fieldname: string]: Express.MulterS3.File[];
};
  const userData= req.body;
  const result = await UserServices.createUserIntoDB(userData, files);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is created succesfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { userEmail } = req.user;
  const result = await UserServices.getMe(userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved succesfully',
    data: result,
  });
});
const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.getSingleUserIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved succesfully',
    data: result,
  });
});

// const getAllUsersForSubscriber = catchAsync(async (req, res) => {
//   const result = await UserServices.getAllUsersForSubscriberFromDB(req.query, req.user);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Users are retrieved succesfully',
//     meta: result.meta,
//     data: result.result,
//   });
// });
const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users are retrieved succesfully',
    meta: result?.meta,
    data: result?.result,
  });
});

// const getUsersMonthly = catchAsync(async (req, res) => {
//   const result = await UserServices.getUsersMonthlyFromDB(req.user);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Users are retrieved succesfully',
//     data: result,
//   });
// });

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserServices.changeStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status is updated succesfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
    const files = req.files as {
  [fieldname: string]: Express.MulterS3.File[];
};
  const { id } = req.params;
  const user = req.body;
  const result = await UserServices.updateUserIntoDB(id, user, files);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: req.file ? 'User data and profile image updated successfully' : 'User data updated successfully',
    data: result,
  });
});
const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.deleteUserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is deleted successfully',
    data: result,
  });
});

export const UserControllers = {
  getSingleUser,
  deleteUser,
  updateUser,
  createUser,
  getMe,
  changeStatus,
  getAllUsers
};
