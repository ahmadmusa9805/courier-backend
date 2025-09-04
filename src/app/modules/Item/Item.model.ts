import { Schema, model } from 'mongoose';
import { TItem, ItemModel } from './Item.interface';

const ItemSchema = new Schema<TItem, ItemModel>({
  name: { type: String, required: true },
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
    status: {
    type: String,
    enum: ['active', 'inactive'], // Directly specifying possible values for the status
    default: 'active',
  }, // You can use an enum for status if needed
    containMaterials: {
    type: String,
    enum: ['glass', 'wood', 'metal', 'food', 'plants', 'plastic','ceramic'], // Directly specifying possible values for the status
  }, // You can use an enum for status if needed
  description: { type: String, required: true },
  img: { type: String, required: true }, // Image URL or path
});

ItemSchema.statics.isItemExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const Item = model<TItem, ItemModel>('Item', ItemSchema);
