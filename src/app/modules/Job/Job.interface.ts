/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TJob = {
  jobId: string
  userId: Types.ObjectId
  courierId?: Types.ObjectId
  from: string;
  to: string;
  transportationType: {
    name: string;
    options: string;
  };

  items: [{
    name: string;
    img: string;
    quantity: number;
    dimensions: string;
    // materialContent: 'glass | wood | metal | food | plants | animals | others';
    price: number;
    length: string;
    width: string;
    height: string;
  }]
  pickupDateInfo: {
    date: Date;
    timeSlot?: string;
  };

  deliveryDateInfo: {
    date: Date;
    timeSlot?: string;
  };

  extraService: {
     service: {
      options: string
      price: number,
     };

     floor: {
      options: string;
      price: number;
     };
  };

  pickupAddress: {
    streetAddress: string;
    cityOrState: string;
    zipCode: string;
    country: string;
    description: string;

  };

  deliveryAddress: {
    streetAddress: string;
    cityOrState: string;
    zipCode: string;
    country: string;
    description: string;

  };
  status: 'pending' | 'accepted' | 'completed' | 'in-progress' | 'cancelled';
  paymentStatus: 'pending' | 'accepted' | 'paid' | 'in-progress' | 'cancelled';
  adminApproved: boolean;
  courierPrice: number;
  totalDistance: string;
  totalPrice: number;
  timeSlotCost: number;
  pickupImg: string;
  deliveryImg: string;
  isDeleted: boolean;
};

export interface JobModel extends Model<TJob> {
  isJobExists(id: string): Promise<TJob | null>;
}

