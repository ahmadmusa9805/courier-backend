import mongoose, {  Schema } from 'mongoose';
import { TOtp } from './otp.interface';



const otpSchema = new Schema<TOtp>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Otp = mongoose.model<TOtp>('Otp', otpSchema);
