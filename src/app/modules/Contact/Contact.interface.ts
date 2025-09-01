/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TContact = {
  phone?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  isDeleted: boolean;
};

export interface ContactModel extends Model<TContact> {
  isContactExists(id: string): Promise<TContact | null>;
}
