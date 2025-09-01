import { Schema, model } from 'mongoose';
      import { TAnalytic, AnalyticModel } from './Analytic.interface';
      
      const AnalyticSchema = new Schema<TAnalytic, AnalyticModel>({
        name: { type: String, required: true },
        description: { type: String },
        atcCodes: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
      });
      
      AnalyticSchema.statics.isAnalyticExists = async function (id: string) {
        return await this.findOne({ _id: id, isDeleted: false });
      };
      
      export const Analytic = model<TAnalytic, AnalyticModel>('Analytic', AnalyticSchema);
      