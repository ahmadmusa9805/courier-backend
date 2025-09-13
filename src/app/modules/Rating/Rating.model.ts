import { Schema, model } from 'mongoose';
import { TRating, RatingModel } from './Rating.interface';


const RatingSchema = new Schema<TRating, RatingModel>(
  {
    userId: { type: String, required: true },
    courierId: { type: String },
    jobId: { type: String, required: true },
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
