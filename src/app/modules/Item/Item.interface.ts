/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TItem = {
   name: string;
  length: number;
  width: number;
  height: number;
  price: number;
  status: 'active' | 'inactive'; // You might want to change this to an enum if you have defined status types
  description: string;
  img: string; // Assuming this is a URL or path to the image
  isDeleted: boolean;
};

export interface ItemModel extends Model<TItem> {
  isItemExists(id: string): Promise<TItem | null>;
}
