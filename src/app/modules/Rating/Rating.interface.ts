/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TRating = {
  userId: string;
  courierId: string;
  professionalism: number;
  communication: number;
  friendliness: number;
  jobId: string;
  comment: string;
  averageRatings: number;
  status: 'active' | 'blocked';
  isDeleted: boolean;
};

export interface RatingModel extends Model<TRating> {
  isRatingExists(id: string): Promise<TRating | null>;
}
