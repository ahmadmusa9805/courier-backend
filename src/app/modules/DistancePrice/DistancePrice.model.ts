import { Schema, model } from 'mongoose';
import { TDistancePrice, DistancePriceModel } from './DistancePrice.interface';
      
const DistancePriceSchema = new Schema<TDistancePrice, DistancePriceModel>({
  distancePrice: { type: Number, required: true },
});
      
DistancePriceSchema.statics.isDistancePriceExists = async function (id: string) {
        return await this.findOne({ _id: id, isDeleted: false });
};
      
      export const DistancePrice = model<TDistancePrice, DistancePriceModel>('DistancePrice', DistancePriceSchema);
      