/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */


import { TUser } from './user.interface';
import { User } from './user.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { usersSearchableFields } from './user.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { Rating } from '../Rating/Rating.model';
import { Job } from '../Job/Job.model';

export const createUserIntoDB = async (payload: TUser,  files?:any) => {
  // Example: get overview files

  let document 
  let img
  if(files){

     document = files['document']?.map((f:any) => f.location) || [];
     img = files['img']?.map((f:any) => f.location) || [];
  }


if(document){ 
  if(document.length > 0){
      payload.document = document[0]; // Assuming file.location contains the S3 URL
    }
    if(img.length > 0){
      payload.profileImg = img[0]; // Assuming file.location contains the S3 URL
    }

}
  

  // if (file) {
  //   console.log('musa testing img',img);
  //   payload.profileImg = file.location as string;
  // }

  const newUser = await User.create(payload);
  if (!newUser) throw new Error('Failed to create user');

  return newUser;
};

const getMe = async (userEmail: string) => {
  const result = await User.findOne({ email: userEmail  });

  if(result?.status === 'blocked') throw new AppError(httpStatus.UNAUTHORIZED, 'User Is blocked!');
  // if(result?.isDeleted === true) throw new AppError(httpStatus.UNAUTHORIZED, 'User Is Deleted!');

  return result;
};

const getSingleUserIntoDB = async (id: string, user:any) => {
  console.log('user', user);
  let requestedUser;
  const result = await User.findOne({ _id: id, isDeleted: false });
    if(!result){
      throw new AppError(httpStatus.UNAUTHORIZED, 'User Not Found');
    }

  if(result.role === 'company' || result.role === 'user'){
    // if(user.id !== id){
    //   throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized to access this user data');
    // }

    requestedUser = await Job.find({userId: result._id}).select('-transportationType -jobId -userId -status -totalPrice -timeSlotCost -isDeleted -totalDistance -courierPrice -adminApproved -pickupDateInfo -deliveryDateInfo -deliveryImg -extraService -pickupAddress -items -deliveryAddress -pickupImg -updatedAt -__v');

  }

  if(result.role === 'courier'){
    // if(user.id !== id){
    //   throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized to access this user data');
    // }

      requestedUser = await Job.find({courierId: result._id}).select('-transportationType -jobId -userId -status -totalPrice -timeSlotCost -isDeleted -totalDistance -courierPrice -adminApproved -pickupDateInfo -deliveryDateInfo -deliveryImg -extraService -pickupAddress -items -deliveryAddress -pickupImg -updatedAt -__v');
  }

  if(result.role === 'superAdmin' || result.role === 'admin'){
     return { user:result  };
  }


  // const rs = await Job.find({userId: id}).select('-transportationType -jobId -userId -status -totalPrice -timeSlotCost -isDeleted -totalDistance -courierPrice -adminApproved -pickupDateInfo -deliveryDateInfo -deliveryImg -extraService -pickupAddress -items -deliveryAddress -pickupImg -updatedAt -__v');
  // console.log('rs', rs);
  return { user:result, jobs: requestedUser  };
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
    const studentQuery = new QueryBuilder(
    User.find(),
    // User.find({status: { $ne: 'blocked' }, isDeleted: false}),
    query,
  )
    .search(usersSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await studentQuery.countTotal();
  const result = await studentQuery.modelQuery;

  return {
    meta,
    result,
  };

};
const getDashboardDataFromDB = async () => {

   const allUsers = await User.countDocuments({});
   const allActiveUsers = await User.countDocuments({isBlocked: false});
   const allBlockedUsers = await User.countDocuments({isBlocked: true});
   const allIndividualUsers = await User.countDocuments({role: 'user'});
   const allCompanyUsers = await User.countDocuments({role: 'company'});
   const allCourierUsers = await User.countDocuments({role: 'courier'});
   const allCourierActiveUsers = await User.countDocuments({role: 'courier',  isBlocked: false});
   const allCourierBlockedUsers = await User.countDocuments({role: 'courier', isBlocked: true});
   const allRatinga = await Rating.countDocuments({});



  return {
    allUsers,
    allBlockedUsers,
    allActiveUsers,
    allIndividualUsers,
    allCompanyUsers,
    allCourierUsers,
    allCourierActiveUsers,
    allCourierBlockedUsers,
    allRatinga,
  };

};
// const getAllUsersForSubscriberFromDB = async (query: Record<string, unknown>, user:any) => {

//     const {  userEmail } = user;
//   const userData = await User.findOne({ email: userEmail });

// let subscriberId;


//  if(userData?.role === 'admin') {
//    subscriberId = userData?.subscriberId;
//  } else if(userData?.role === 'subscriber') {
//    subscriberId = userData?._id;
//  }else{
// //  if(userData?.role === 'superAdmin') return getAllUsersFromDB(query);
//  }


//   const studentQuery = new QueryBuilder(
//     User.find({ role: { $ne: 'superAdmin' }, subscriberId }),
//     // User.find({ role: { $ne: 'superAdmin' }, subscriberId: userData?._id }),
//     query,
//   )
//     .search(usersSearchableFields)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const meta = await studentQuery.countTotal();
//   const result = await studentQuery.modelQuery;

//   return {
//     meta,
//     result,
//   };
// };
/////////////////
// const getUsersMonthlyFromDB = async (userEmailAndRole: any) => {
//   const user = await User.isUserExistsByCustomEmail(userEmailAndRole.userEmail)
//   if(!user){
//     throw new AppError(httpStatus.UNAUTHORIZED, 'User Is Not Found!')
//   }
//   const startOfYear = new Date(new Date().getFullYear(), 0, 1); // January 1st, current year
//   const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1); // January 1st, next year
//   // console.log(role,'user');


//   const matchCondition: any = {
//     isDeleted: false,
//     createdAt: { $gte: startOfYear, $lt: endOfYear },
//   };


//   if(user.role === 'superAdmin'){
//   const result = await User.aggregate([
//     {
//       $match: {
//         isDeleted: false,
//         createdAt: { $gte: startOfYear, $lt: endOfYear }, // Filter users created in the current year
//       },
//     },
//     {
//       $group: {
//         _id: { $month: '$createdAt' }, // Group by month of 'createdAt'
//         count: { $sum: 1 }, // Count users per month
//       },
//     },
//     {
//       $sort: { _id: 1 }, // Sort by month in ascending order
//     },
//   ]);


//   // Format result to include month names (optional)
//   const formattedResult = result.map((item) => ({
//     month: new Date(0, item._id - 1).toLocaleString('default', {
//       month: 'long',
//     }),
//     count: item.count,
//   }));

//   console.log(formattedResult, 'formattedResult');

//   return formattedResult;
//   } else if(user.role === 'subscriber'){
//         // subscriber only sees their own clients
//     matchCondition.role = 'client';
//     matchCondition.subscriberId = (user as any)?._id;
//   }else {
//     return []
//   }
// const result = await User.aggregate([
//     { $match: matchCondition },
//     {
//       $group: {
//         _id: { $month: '$createdAt' },
//         count: { $sum: 1 },
//       },
//     },
//     { $sort: { _id: 1 } },
//   ]);

//   const formattedResult = result.map((item) => ({
//     month: new Date(0, item._id - 1).toLocaleString('default', {
//       month: 'long',
//     }),
//     count: item.count,
//   }));

//   return formattedResult;

// };

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  

  return result;
};

const updateUserIntoDB = async (
  id: string,
  payload: Partial<TUser>,
  files?: any,
) => {


  // Handle file upload if present
  // if (file) {
  //   payload.profileImg = file.location as string;
  // }
  if (files) {
    const document = files['document']?.map((f:any) => f.location) || [];
const img = files['img']?.map((f:any) => f.location) || [];


    if(document.length > 0){
      payload.document = document[0]; // Assuming file.location contains the S3 URL
    }
    if(img.length > 0){
      payload.profileImg = img[0]; // Assuming file.location contains the S3 URL
    }
  }

  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).select('-password');


  return result;
};
// const updateUserIntoDB = async (
//   id: string,
//   payload: Partial<TUser>,
//   file?: any,
// ) => {


//   const { name, ...userData } = payload;

//   const modifiedUpdatedData: Record<string, unknown> = { ...userData };

//   if (name && Object.keys(name).length) {
//     for (const [key, value] of Object.entries(name)) {
//       modifiedUpdatedData[`name.${key}`] = value;
//     }
//   }

//   // Handle file upload if present
//   if (file) {
//     modifiedUpdatedData.profileImg = file.location as string;
//   }

//   const result = await User.findByIdAndUpdate(id, modifiedUpdatedData, {
//     new: true,
//     runValidators: true,
//   }).select('-password');

//   return result;
// };

const deleteUserFromDB = async (id: string) => {
  const session = await mongoose.startSession(); // Start a session
  session.startTransaction(); // Start transaction

  try {
    // Step 1: Check if the user exists
    const user = await User.findById(id).session(session); // Find user with session
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
    }

    // Step 2: Delete the user
    const deletedUser = await User.findByIdAndDelete(id, { session }); // Pass session for deletion
    // Commit the transaction if all operations succeed
    await session.commitTransaction();
    session.endSession();

    return deletedUser; // Return the deleted user document
  } catch (error) {
    // Rollback the transaction if any operation fails
    await session.abortTransaction();
    session.endSession();
    throw error; // Propagate the error to be handled by the caller
  }
};

export const UserServices = {
  getSingleUserIntoDB,
  deleteUserFromDB,
  createUserIntoDB,
  getMe,
  changeStatus,
  getAllUsersFromDB,
  updateUserIntoDB,
  getDashboardDataFromDB
};
