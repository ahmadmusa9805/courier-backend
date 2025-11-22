import { Schema, model } from 'mongoose';
      import { TContactSocial, ContactSocialModel } from './ContactSocial.interface';

      const ContactSocialSchema = new Schema<TContactSocial, ContactSocialModel>({
        phone: { type: String,  },
        whatsapp: { type: String },
        officeAdress: { type: String,  },
        emailAdress: { type: String,  },
        fax: { type: String, },
        facebook: { type: String,  },
        instagram: { type: String },
        linkedIn: { type: String,  },
        isDeleted: { type: Boolean, default: false },
      });
      
      ContactSocialSchema.statics.isContactSocialExists = async function (id: string) {
        return await this.findOne({ _id: id, isDeleted: false });
      };
      
      export const ContactSocial = model<TContactSocial, ContactSocialModel>('ContactSocial', ContactSocialSchema);
      