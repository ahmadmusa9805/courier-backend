import { Schema, model } from 'mongoose';
      import { TContact, ContactModel } from './Contact.interface';

      const ContactSchema = new Schema<TContact, ContactModel>({
        phone: { type: String },
        email: { type: String },
        facebook: { type: String },
        instagram: { type: String },
        twitter: { type: String },
        isDeleted: { type: Boolean, default: false },
      });
      
      ContactSchema.statics.isContactExists = async function (id: string) {
        return await this.findOne({ _id: id, isDeleted: false });
      };
      
      export const Contact = model<TContact, ContactModel>('Contact', ContactSchema);
      