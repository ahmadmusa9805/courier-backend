/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TNotification = {
  type: 'jobCreated' | 'jobAccepted' | 'jobApproved' | 'payment';
  message: string;
  readBy: Types.ObjectId[];
  // subscriberId: Types.ObjectId;
};

export interface NotificationModel extends Model<TNotification> {
  isNotificationExists(id: string): Promise<TNotification | null>;
}
