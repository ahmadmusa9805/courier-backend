import { Schema, model } from 'mongoose';
import { TRating, RatingModel } from './Rating.interface';


const RatingSchema = new Schema<TRating, RatingModel>(
  {
    userId: {
    type: Schema.Types.ObjectId,
    required: [true, 'User id is required'],
    ref: 'User',
  },
    courierId: {
    type: Schema.Types.ObjectId,
    required: [true, 'User id is required'],
    ref: 'User',
  },
    jobId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Job id is required'],
    ref: 'Job',
  },
    comment: { type: String, required: true },
    professionalism: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    friendliness: { type: Number, default: 0 },
    averageRatings: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

RatingSchema.statics.isRatingExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const Rating = model<TRating, RatingModel>('Rating', RatingSchema);
