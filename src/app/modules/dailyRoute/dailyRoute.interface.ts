/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { Model , Types } from 'mongoose';

export interface IRouteItem {
  jobId?:Types.ObjectId;
  addRouteId?: Types.ObjectId;
  address: string;
  dateTimeSlot: {
    date: Date;
    timeSlot: string;
  };
  deliveryMode: 'pickup' | 'delivery';
  dataSource: 'job' | 'addroute';
}



export type TDailyRoute = {
  date: Date;
  routeContainer: IRouteItem[];
  // routeContainer: any[];
};

export interface DailyRouteModel extends Model<TDailyRoute> {
  isDailyRouteExists(id: string): Promise<TDailyRoute | null>;
}
  // jobId?: Types.ObjectId;
  // addRouteId?: Types.ObjectId;
  // address?: string;
  // dateTimeSlot?: string;
  // deliveryMode?: 'pickup' | 'delivery';
  // dataSource?: 'job' | 'addroute';
  // date: Date;
