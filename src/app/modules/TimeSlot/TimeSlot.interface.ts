/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TTimeSlot = {
  startTime: string;
  endTime: string;
  type: 'delivery' | 'pickup' ;
  price: number;
  isDeleted: boolean;
};

export interface TimeSlotModel extends Model<TTimeSlot> {
  isTimeSlotExists(id: string): Promise<TTimeSlot | null>;
}
