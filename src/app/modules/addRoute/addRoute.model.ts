import { model, Schema } from "mongoose";
import { AddRouteModel, TAddRoute } from "./addRoute.interface";


const AddRouteSchema = new Schema<TAddRoute, AddRouteModel>(
  {
    jobId: { type: String },
    userId: {
      type: Schema.Types.ObjectId, // Use Types.ObjectId for ObjectId
      ref: 'User', // This links to the User model (if applicable)
      // Optional, depending on your use case
    },
    courierId: {
      type: Schema.Types.ObjectId, // Use Types.ObjectId for ObjectId
      ref: 'User', // This links to the Courier model (if applicable)
      // required: true, // Optional, depending on your use case
    },
    from: { type: String },
    to: { type: String },
    transportationType: {
      name: { type: String,  },
      options: { type: String},
    },
    items: [
      {
        name: { type: String, },
        img: { type: String, },
        quantity: { type: Number,  },
        dimensions: { type: String,  },
        materialContent: {
          type: String,
          enum: ['glass', 'wood', 'metal', 'food', 'plants', 'animals', 'others'],
        },
        price: { type: Number,  },
        length: { type: String,  },
        width: { type: String, },
        height: { type: String,  },
      },
    ],
    pickupDateInfo: {
      date: { type: Date, },
      timeSlot: { type: String,  },
    },
    deliveryDateInfo: {
      date: { type: Date, },
      timeSlot: { type: String,  },
    },
    extraService: {
      service: {
        options: { type: String,  },
      },
      floor: {
        options: { type: String,  },
        price: { type: Number, default: 0 },
      },
    },
    pickupAddress: {
      streetAddress: { type: String,  },
      cityOrState: { type: String,  },
      zipCode: { type: String, },
      country: { type: String, },
      description: { type: String,  },
    },
    deliveryAddress: {
      streetAddress: { type: String,  },
      cityOrState: { type: String, },
      zipCode: { type: String,  },
      country: { type: String,  },
      description: { type: String,  },
    },
    adminApproved: { type: Boolean, default: false },
    courierPrice: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'completed', 'in-progress', 'cancelled'],
      default: 'pending',
    },
    totalDistance: { type: String,  },
    totalPrice: { type: Number,  },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

AddRouteSchema.statics.isAddRouteExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const AddRoute = model<TAddRoute, AddRouteModel>(
  'AddRoute',
  AddRouteSchema,
);
