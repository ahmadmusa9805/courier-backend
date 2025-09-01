import { Schema, model } from 'mongoose';
import { TNotification, NotificationModel } from './Notification.interface';

const NotificationSchema = new Schema<TNotification, NotificationModel>({
  type: { type: String, enum: ['quote', 'callBooking'], required: true },
  message: { type: String, required: true },
//  readBy: [
//     {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         default: [],
//     },
//   ],
 readBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  subscriberId: {
    type: Schema.Types.ObjectId,
    required: [true, 'User id is required'],
    ref: 'User',
  },
}, { timestamps: true });

NotificationSchema.statics.isNotificationExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const Notification = model<TNotification, NotificationModel>(
  'Notification',
  NotificationSchema,
);
