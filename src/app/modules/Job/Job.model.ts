import { Schema, model } from 'mongoose';
import { TJob, JobModel } from './Job.interface';

const JobSchema = new Schema<TJob, JobModel>({

  jobId: { type: String, required: true },
    userId: {
    type: Schema.Types.ObjectId, // Use Types.ObjectId for ObjectId
    ref: 'User', // This links to the User model (if applicable)
    required: true, // Optional, depending on your use case
  },
  courierId: {
    type: Schema.Types.ObjectId, // Use Types.ObjectId for ObjectId
    ref: 'User', // This links to the Courier model (if applicable)
    // required: true, // Optional, depending on your use case
  },
  from: { type: String, required: true },
  to: { type: String, required: true },
  transportationType: {
    name: { type: String, required: true },
    options: { type: String },
  },
  items: [
    {
      name: { type: String, required: true },
      img: { type: String, required: true },
      quantity: { type: Number, required: true },
      dimensions: { type: String, required: true },
      materialContent: {
        type: String,
        // enum: ['glass', 'wood', 'metal', 'food', 'plants', 'animals', 'others'],
        // required: true,
      },
      price: { type: Number, required: true },
      length: { type: String, required: true },
      width: { type: String, required: true },
      height: { type: String, required: true },
    },
  ],
  pickupDateInfo: {
    date: { type: Date, required: true },
    timeSlot: { type: String,  },
  },
  deliveryDateInfo: {
    date: { type: Date, required: true },
    timeSlot: { type: String,  },
  },
  extraService: {
    service: {
      options: { type: String, required: true },
      price: { type: Number, default: 0 },
    },
    floor: {
      options: { type: String,  required: true},
      price: { type: Number, default: 0 },
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
  adminApproved: {  type: Boolean, default: false },
  courierPrice: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'accepted', 'completed', 'in-progress', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
  totalDistance: { type: String, required: true },
  pickupImg:{ type: String},
  deliveryImg:{ type: String},
  totalPrice: { type: Number, required: true },
  timeSlotCost: { type: Number, default : 0 },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

JobSchema.statics.isJobExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const Job = model<TJob, JobModel>('Job', JobSchema);
