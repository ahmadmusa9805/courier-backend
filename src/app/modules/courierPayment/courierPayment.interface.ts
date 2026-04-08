import { Model } from 'mongoose';

export type TCourierPayment = {
  name: string;
  description?: string;
  atcCodes: string;
  isDeleted: boolean;
};

export interface CourierPaymentModel extends Model<TCourierPayment> {
  isCourierPaymentExists(id: string): Promise<TCourierPayment | null>;
}
