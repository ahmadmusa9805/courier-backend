import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotificationServices } from './Notification.service';

const createNotification = catchAsync(async (req, res) => {
  const notification = req.body;
  const result = await NotificationServices.createNotificationIntoDB(notification);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification is created successfully',
    data: result,
  });
});
const getAllUnreadNotifications = catchAsync(async (req, res) => {

  const result = await NotificationServices.getAllUnreadNotificationsFromDB(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications are retrieved successfully',
    // meta: result.meta,
    data: result,
  });
});
const markNotificationAsRead = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await NotificationServices.markNotificationAsReadIntoDB(id, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification marked as read.',
    data: result,
  });
});
const markNotificationsAsRead = catchAsync(async (req, res) => {

  const result = await NotificationServices.markNotificationsAsReadIntoDB(req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification marked as read.',
    data: result,
  });
});


export const NotificationControllers = {
  createNotification,
  getAllUnreadNotifications,
  markNotificationsAsRead,
  markNotificationAsRead
};
