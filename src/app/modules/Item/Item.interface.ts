/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TItem = {
  name: string;
  containMaterials: 'glass' | 'wood' | 'metal' | 'food' | 'plants' | 'plastic' | 'ceramic';
  length: number;
  width: number;
  height: number;
  price: number;
  quantity : number;
  status: 'active' | 'inactive'; // You might want to change this to an enum if you have defined status types
  description: string;
  img: string; // Assuming this is a URL or path to the image
  isDeleted: boolean;
};

export interface ItemModel extends Model<TItem> {
  isItemExists(id: string): Promise<TItem | null>;
}
