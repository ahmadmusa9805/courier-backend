/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TAboutUs = {
  description?: string;
  isDeleted: boolean;
};

export interface AboutUsModel extends Model<TAboutUs> {
  isAboutUsExists(id: string): Promise<TAboutUs | null>;
}
