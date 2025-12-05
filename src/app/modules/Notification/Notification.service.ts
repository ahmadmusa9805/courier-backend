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
    const { userEmail } = user;
    const currentUser = await User.findOne({ email: userEmail });
    if (!currentUser) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

    let allNotifications;
    const currentUserId = currentUser._id.toString();

    // 1. Fetch relevant notifications (last 20) based on the user's role.
    if (currentUser.role === 'admin' || currentUser.role === 'superAdmin') {
        // Admins see all notifications
        allNotifications = await Notification.find({})
            .sort({ createdAt: -1 })
            .lean()
            .limit(20);

    } else if (currentUser.role === 'courier') {
        // Couriers see notifications specifically for them
        allNotifications = await Notification.find({ courierId: currentUser._id })
            .sort({ createdAt: -1 })
            .lean()
            .limit(20);

    } else if (currentUser.role === 'user' || currentUser.role === 'company') {
        // Users/Companies see notifications specifically for them
        allNotifications = await Notification.find({ userId: currentUser._id })
             .sort({ createdAt: -1 })
             .lean()
             .limit(20);
    }
    
    // Ensure allNotifications is an array
    const notifications = allNotifications ?? [];

    // 2. Map the notifications to correctly calculate 'isRead' for the *current user*.
    const notificationsWithReadStatus = notifications.map((notif: any) => {
        // Check if the current user's ID exists in the readBy array
        const isReadByUser = notif.readBy?.some(
            (entry: any) => entry?.toString() === currentUserId
        );
        
        return {
            ...notif,
            isRead: isReadByUser, // Calculated status for the current user
        };
    });

    // 3. Filter the array to keep only the UNREAD notifications for the current user.
    const unreadNotifications = notificationsWithReadStatus.filter((notif: any) => !notif.isRead);

    return unreadNotifications;
};

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






// };
// const getAllUnreadNotificationsFromDB = async (user: any) => {
//   const { userEmail } = user;
//   const currentUser = await User.findOne({ email: userEmail });
//   if (!currentUser) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  
//   if (currentUser.role === 'admin' || currentUser.role === 'superAdmin') {
//     // Fetch notifications for the admin's subscriberId
//     const allNotifications = await Notification.find({}).sort({ createdAt: -1 }).lean().limit(20);

//     const response = allNotifications.map((notif) => ({
//       ...notif,
//       isRead: notif.readBy?.some(
//         (entry: any) => entry?.toString() === currentUser._id.toString()
//       ),
//     }));

//     return response;
//   }
//   if (currentUser.role === 'courier') {
//     // Fetch notifications for the admin's subscriberId
//     const allNotifications = await Notification.find({ courierId: currentUser._id }).sort({ createdAt: -1 }).lean().limit(20);

//     const response = allNotifications.map((notif) => ({
//       ...notif,
//       isRead: notif.readBy?.some(
//         (entry: any) => entry?.toString() === currentUser._id.toString()
//       ),
//     }));

//     return response;
//   }
//   if (currentUser.role === 'user' || currentUser.role === 'company') {
//     // Fetch notifications for the admin's subscriberId
//     const allNotifications = await Notification.find({ userId: currentUser._id, isRead: false }).sort({ createdAt: -1 }).lean().limit(20);

//     const response = allNotifications.map((notif) => ({
//       ...notif,
//       isRead: notif.readBy?.some(
//         (entry: any) => entry?.toString() === currentUser._id.toString()
//       ),
//     }));

//     return response;
//   }

//   // if (currentUser.role === 'subscriber' || currentUser.role === 'superAdmin') {
//   //   // Fetch notifications for the subscriber
//   //   const allNotifications = await Notification.find({
//   //     subscriberId: currentUser._id,
//   //   }).sort({ createdAt: -1 }).lean().limit(20);  

//   //   const response = allNotifications.map((notif) => ({
//   //     ...notif,
//   //     isRead: notif.readBy?.some(
//   //       (entry: any) => entry?.toString() === currentUser._id.toString()
//   //     ),  
//   //   }))
//   //   return response;
//   // }

// };

// export const getUnreadNotifications = async () => {
//   return await Notification.find({ isRead: false }).sort({ createdAt: -1 });
// };

export const markNotificationsAsReadIntoDB = async (user: any) => {
  const { userEmail } = user;
    const currentUser = await User.findOne({ email: userEmail });
    if (!currentUser) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

    const currentUserId: any = currentUser._id;
    let query: any = {};

    // 1. Determine the query to find all relevant notifications for the user's role
    if (currentUser.role === 'admin' || currentUser.role === 'superAdmin') {
        // Admins should see all notifications, but we only want to update those they haven't read.
        query = {}; // No additional filter needed for content, just by read status below.
    } else if (currentUser.role === 'courier') {
        // Couriers only read notifications related to them.
        query = { courierId: currentUserId };
    } else if (currentUser.role === 'user' || currentUser.role === 'company') {
        // Users/Companies only read notifications related to them.
        query = { userId: currentUserId };
    } else {
        // Handle un-supported roles or just return
        return 'No relevant notifications to mark as read.';
    }

    // 2. Add the condition to filter only UNREAD notifications for the current user.
    // The $nin (not in) operator ensures we only update documents where the currentUserId
    // is NOT already present in the 'readBy' array.
    query.readBy = { $nin: [currentUserId] };


    // 3. Perform a bulk update operation.
    // $addToSet ensures the user's ID is added to the 'readBy' array ONLY IF it's not already there.
    const updateResult = await Notification.updateMany(
        query,
        { $addToSet: { readBy: currentUserId } }
    );

    // 4. Return the result of the bulk update.
    return {
        message: 'All unread notifications marked as read.',
        modifiedCount: updateResult.modifiedCount,
    };
};

export const markNotificationAsReadIntoDB = async (id: any, user: any) => {

  const { userEmail } = user;
  const currentUser = await User.findOne({ email: userEmail });
  if (!currentUser) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const notification = await Notification.findById(id);
  if (!notification) { throw new AppError(404, 'Notification not found.') }



  if (currentUser.role === 'admin' || currentUser.role === 'superAdmin') {

    if (!notification.readBy.includes(currentUser!._id)) {
      notification.readBy.push(currentUser!._id);
      await notification.save();
    }
  }

  if (currentUser.role === 'courier' && notification.courierId) {
    // Protect against cross-subscriber access
    if (notification.courierId.toString() !== currentUser?._id?.toString()) {
      throw new AppError(403, 'Access denied');
    }

    if (!notification.readBy.includes(currentUser!._id)) {
      notification.readBy.push(currentUser!._id);
      await notification.save();
    }
  }


  if ((currentUser.role === 'user' || currentUser.role === 'company') && notification.userId) {
    // Protect against cross-subscriber access
    if (notification.userId.toString() !== currentUser?._id?.toString()) {
      throw new AppError(403, 'Access denied');
    }

    if (!notification.readBy.includes(currentUser._id)) {
      notification.readBy.push(currentUser._id);
      await notification.save();
    }
    // if (!notification.readBy.includes(currentUser!._id)) {
    //   notification.readBy.push(currentUser!._id);
    //   await notification.save();
    // }

  }

  return 'Notification marked as read.'
}









export const NotificationServices = {
  createNotificationIntoDB,
  getAllUnreadNotificationsFromDB,
  // getUnreadNotifications,
  markNotificationAsReadIntoDB,
  markNotificationsAsReadIntoDB
};
