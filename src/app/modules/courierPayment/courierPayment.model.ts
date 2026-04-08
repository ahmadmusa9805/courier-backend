import { Schema, model } from 'mongoose';
      import { TCourierPayment, CourierPaymentModel } from './courierPayment.interface';
      
      const courierPaymentSchema = new Schema<TCourierPayment, CourierPaymentModel>({
        name: { type: String, required: true },
        description: { type: String },
        atcCodes: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
      });
      
      courierPaymentSchema.statics.isCourierPaymentExists = async function (id: string) {
        return await this.findOne({ _id: id, isDeleted: false });
      };
      
      export const CourierPayment = model<TCourierPayment, CourierPaymentModel>('CourierPayment', courierPaymentSchema);
      