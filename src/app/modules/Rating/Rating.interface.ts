/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TRating = {
  userId: Types.ObjectId,
  courierId: Types.ObjectId,
  jobId: Types.ObjectId,
  professionalism: number;
  communication: number;
  friendliness: number;
  averageRatings: number;
  comment: string;
  status: 'active' | 'blocked';
  isDeleted: boolean;
};

export interface RatingModel extends Model<TRating> {
  isRatingExists(id: string): Promise<TRating | null>;
}
