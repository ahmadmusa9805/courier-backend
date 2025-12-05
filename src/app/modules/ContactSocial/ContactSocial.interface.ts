import { Model } from 'mongoose';

export type TContactSocial = {
  phone?: string;
  whatsapp?: string;
  officeAdress?: string;
  emailAdress?: string;
  fax?: string;
  facebook?: string;
  instagram?: string;
  linkedIn?: string;
  isDeleted: boolean;
};

export interface ContactSocialModel extends Model<TContactSocial> {
  isContactSocialExists(id: string): Promise<TContactSocial | null>;
}
