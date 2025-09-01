/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TNotification } from './Notification.interface';
import { Notification } from './Notification.model';
import { User } from '../User/user.model';

const createNotificationIntoDB = async (
  payload: TNotification,
) => {
  const result = await Notification.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Notification');
  }
  return result;
};

const getAllUnreadNotificationsFromDB = async (user: any) => {

  const {userEmail} = user;
  const currentUser = await User.findOne({email: userEmail});
  if(!currentUser) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

//  if (currentUser.role === 'admin') {
//   // Fetch notifications for the admin's subscriberId
//   const allNotifications = await Notification.find({
//     subscriberId: currentUser.subscriberId,
//   }).sort({ createdAt: -1 }).lean().limit(20);

//   const response = allNotifications.map((notif) => ({
//     ...notif,
//     isRead: notif.readBy?.some(
//       (entry: any) => entry?.toString() === currentUser._id.toString()
//     ),
//   }));

//   return response;
// }

// if (currentUser.role === 'subscriber' || currentUser.role === 'superAdmin') {
//   // Fetch notifications for the subscriber
//   const allNotifications = await Notification.find({
//     subscriberId: currentUser._id,
//   }).sort({ createdAt: -1 }).lean().limit(20);  

//   const response = allNotifications.map((notif) => ({
//     ...notif,
//     isRead: notif.readBy?.some(
//       (entry: any) => entry?.toString() === currentUser._id.toString()
//     ),  
//   }))
//   return response;
// }

};

export const getUnreadNotifications = async () => {
  return await Notification.find({ isRead: false }).sort({ createdAt: -1 });
};

export const markNotificationsAsReadIntoDB = async (user: any) => {
  const { userEmail } = user;
  const currentUser = await User.findOne({ email: userEmail });
  if (!currentUser) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  let targetSubscriberId;
  let markAsReadId;

  // if (currentUser.role === 'admin') {
  //   targetSubscriberId = currentUser.subscriberId;
  //   markAsReadId = currentUser.subscriberId;
  // } else if (currentUser.role === 'subscriber' || currentUser.role === 'superAdmin') {
  //   targetSubscriberId = currentUser._id;
  //   markAsReadId = currentUser._id;
  // } else {
  //   throw new AppError(httpStatus.FORBIDDEN, 'Invalid user role');
  // }

  // Only add markAsReadId if not already present in readBy
  await Notification.updateMany(
    {
      subscriberId: targetSubscriberId,
      readBy: { $ne: markAsReadId },
    },
    {
      $push: { readBy: markAsReadId },
    }
  );
};

export const markNotificationAsReadIntoDB = async (id: any, user: any) => {
  // console.log('markNotificationAsReadIntoDB', id, user);
  const {userEmail} = user;
  const currentUser = await User.findOne({email: userEmail});
  if(!currentUser) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

 const notification = await Notification.findById(id);
if (!notification) {throw new AppError(404, 'Notification not found.')}



//  if(currentUser.role === 'subscriber' || currentUser.role === 'superAdmin') {
//      // Protect against cross-subscriber access
// if (notification.subscriberId.toString() !== currentUser?._id?.toString()) {
//   throw new AppError(403, 'Access denied');
// }

// if (!notification.readBy.includes(currentUser!._id)) {
//   notification.readBy.push(currentUser!._id);
//   await notification.save();
// }

//  }

 
//  if(currentUser.role === 'admin') {
//      // Protect against cross-subscriber access
// if (notification.subscriberId.toString() !== currentUser?.subscriberId?.toString()) {
//   throw new AppError(403, 'Access denied');
// }

// if (!notification.readBy.includes(currentUser!._id)) {
//   notification.readBy.push(currentUser!._id);
//   await notification.save();
// }

// }

return 'Notification marked as read.'
 }


 






export const NotificationServices = {
  createNotificationIntoDB,
  getAllUnreadNotificationsFromDB,
  getUnreadNotifications,
  markNotificationAsReadIntoDB, 
  markNotificationsAsReadIntoDB
};
