/* eslint-disable no-undef */
import { Schema, model } from 'mongoose';
import { TDailyRoute, DailyRouteModel, IRouteItem } from './dailyRoute.interface';


// Create a Schema for the array items
const routeItemSchema = new Schema<IRouteItem>({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',  // Links to the Job model

  },
  addRouteId: {
    type: Schema.Types.ObjectId,
    ref: 'AddRoute',  // Links to the AddRoute model

  },
  address: {
    type: String,

  },
  dateTimeSlot: {
    date: {
      type: Date,

    },
    timeSlot: {
      type: String,

    },
  },
  deliveryMode: {
    type: String,
    enum: ['pickup', 'delivery'],

  },
  dataSource: {
    type: String,
    enum: ['job', 'addroute'],

  },
});



const dailyRouteSchema = new Schema<TDailyRoute, DailyRouteModel>(
  {
    date: { type: Date, required: true },  
    routeContainer: {
      type: [routeItemSchema],  
      required: true,
    }, 
    // routeContainer: { type: [Schema.Types.Mixed], required: true },  // Mixed type allows any type of data
  },
  { timestamps: true },
);

dailyRouteSchema.statics.isDailyRouteExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const DailyRoute = model<TDailyRoute, DailyRouteModel>(
  'DailyRoute',
  dailyRouteSchema,
);

    // jobId: {
    //   type: Schema.Types.ObjectId, // Use Types.ObjectId for ObjectId
    //   ref: 'Job', // This links to the User model (if applicable)
    //   // Optional, depending on your use case
    // },
    // addRouteId: {
    //   type: Schema.Types.ObjectId, // Use Types.ObjectId for ObjectId
    //   ref: 'AddRoute', // This links to the User model (if applicable)
    //   // Optional, depending on your use case
    // },
    // address: { type: String },
    // dateTimeSlot: {
    //   date: { type: Date, required: true },
    //   timeSlot: { type: String, required: true },
    // },
    // deliveryMode: {
    //   type: String,
    //   enum: ['pickup', 'delivery'],
    //   required: true,
    // },
    // dataSource: {
    //   type: String,
    //   enum: ['job', 'addroute'],
    //   required: true,
    // },
    // date: { type: Date, required: true },