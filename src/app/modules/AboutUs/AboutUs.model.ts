import { Schema, model } from 'mongoose';
      import { TAboutUs, AboutUsModel } from './AboutUs.interface';
      
      const AboutUsSchema = new Schema<TAboutUs, AboutUsModel>({
        description: { type: String },
        isDeleted: { type: Boolean, default: false },
      });
      
      AboutUsSchema.statics.isAboutUsExists = async function (id: string) {
        return await this.findOne({ _id: id, isDeleted: false });
      };
      
      export const AboutUs = model<TAboutUs, AboutUsModel>('AboutUs', AboutUsSchema);
      