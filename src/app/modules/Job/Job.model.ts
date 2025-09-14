import { Schema, model } from 'mongoose';
import { TJob, JobModel } from './Job.interface';

const JobSchema = new Schema<TJob, JobModel>({
  from: { type: String, required: true },
  to: { type: String, required: true },
  transportationType: {
    name: { type: String, required: true },
    options: { type: String, required: true },
  },
  items: [
    {
      name: { type: String, required: true },
      img: { type: String, required: true },
      quantity: { type: Number, required: true },
      dimensions: { type: String, required: true },
      materialContent: {
        type: String,
        enum: ['glass', 'wood', 'metal', 'food', 'plants', 'animals', 'others'],
        required: true,
      },
      price: { type: Number, required: true },
      length: { type: String, required: true },
      width: { type: String, required: true },
      height: { type: String, required: true },
    },
  ],
  pickupDateInfo: {
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
  },
  deliveryDateInfo: {
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
  },
  extraService: {
    service: {
      carWithLift: { type: Number, required: true },
      noNeed: { type: Number, required: true },
      extraHelp: { type: Number, required: true },
    },
    floor: {
      groundFloor: { type: Boolean, required: true },
      elevator: { type: Boolean, required: true },
      level: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  },
  pickupAddress: {
    streetAddress: { type: String, required: true },
    cityOrState: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
  },
  deliveryAddress: {
    streetAddress: { type: String, required: true },
    cityOrState: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    name: {
      firstName: { type: String, required: true },
      instagram: { type: String, required: true },
    },
    userType: { type: String, enum: ['individual', 'company'], required: true },
  },
  status: { type: String, enum: ['active', 'inactive'], required: true },
  totalDistance: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false },
});

JobSchema.statics.isJobExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const Job = model<TJob, JobModel>('Job', JobSchema);
