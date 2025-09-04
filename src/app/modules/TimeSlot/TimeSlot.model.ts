import { Schema, model } from 'mongoose';
import { TTimeSlot, TimeSlotModel } from './TimeSlot.interface';

const TimeSlotSchema = new Schema<TTimeSlot, TimeSlotModel>({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  type: {
    type: String,
    enum: ['delivery', 'pickup'], // Directly specifying possible values for the status
    default: 'delivery',
  },
  price: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false },
});

TimeSlotSchema.statics.isTimeSlotExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const TimeSlot = model<TTimeSlot, TimeSlotModel>(
  'TimeSlot',
  TimeSlotSchema,
);
