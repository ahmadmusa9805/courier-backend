/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TAddRoute = {
  jobId?: string;
  userId?: Types.ObjectId;
  courierId?: Types.ObjectId;
  from?: string;
  pickupMinute:number;
  deliveryMinute:number;
  pickupExtraText:string;
  deliveryExtraText:string;
  pickupExtraAdress:string;
  deliveryExtraAdress:string;
  to?: string;
  transportationType?: {
    name: string;
    options: string;
  };

  items?: [
    {
      name: string;
      img: string;
      quantity: number;
      dimensions: string;
      materialContent: 'glass | wood | metal | food | plants | animals | others';
      price: number;
      length: string;
      width: string;
      height: string;
    },
  ];
  pickupDateInfo?: {
    date: Date;
    timeSlot: string;
  };

  deliveryDateInfo?: {
    date: Date;
    timeSlot: string;
  };

  extraService?: {
    service: {
      options: string;
    };

    floor: {
      options: string;
      price: number;
    };
  };

  pickupAddress?: {
    streetAddress: string;
    cityOrState: string;
    zipCode: string;
    country: string;
    description: string;
  };

  deliveryAddress?: {
    streetAddress: string;
    cityOrState: string;
    zipCode: string;
    country: string;
    description: string;
  };
  status?: 'pending' | 'accepted' | 'completed' | 'in-progress' | 'cancelled';
  adminApproved?: boolean;
  courierPrice?: number;
  totalDistance?: string;
  totalPrice?: number;
  isDeleted?: boolean;
};

export interface AddRouteModel extends Model<TAddRoute> {
  isAddRouteExists(id: string): Promise<TAddRoute | null>;
}
