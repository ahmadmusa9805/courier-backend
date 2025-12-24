/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TDistancePrice = {
  distancePrice: number;
};

export interface DistancePriceModel extends Model<TDistancePrice> {
  isDistancePriceExists(id: string): Promise<TDistancePrice | null>;
}
