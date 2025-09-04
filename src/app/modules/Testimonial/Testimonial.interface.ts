/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TTestimonial = {
  name: string;
  subTitle: string;
  description?: string;
  createdDate: string;
  rating: number;
  status: 'active' | 'inactive';
  isDeleted: boolean;
};

export interface TestimonialModel extends Model<TTestimonial> {
  isTestimonialExists(id: string): Promise<TTestimonial | null>;
}
