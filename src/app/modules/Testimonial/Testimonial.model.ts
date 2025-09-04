import { Schema, model } from 'mongoose';
import { TTestimonial, TestimonialModel } from './Testimonial.interface';

const TestimonialSchema = new Schema<TTestimonial, TestimonialModel>({
  name: { type: String, required: true },
  subTitle: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['active', 'inactive'], // Directly specifying possible values for the status
    default: 'active',
  },
  createdDate: { type: String },
  isDeleted: { type: Boolean, default: false },
});

TestimonialSchema.statics.isTestimonialExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const Testimonial = model<TTestimonial, TestimonialModel>(
  'Testimonial',
  TestimonialSchema,
);
