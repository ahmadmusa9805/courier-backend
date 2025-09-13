import { Schema, model } from 'mongoose';
      import { TSupport, SupportModel } from './Support.interface';
      
      const SupportSchema = new Schema<TSupport, SupportModel>({
        name: { type: String, required: true },
        description: { type: String },
        atcCodes: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
      });
      
      SupportSchema.statics.isSupportExists = async function (id: string) {
        return await this.findOne({ _id: id, isDeleted: false });
      };
      
      export const Support = model<TSupport, SupportModel>('Support', SupportSchema);
      