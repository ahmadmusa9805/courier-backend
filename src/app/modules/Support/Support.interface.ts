import { Model } from 'mongoose';

export type TSupport = {
  name: string;
  description?: string;
  atcCodes: string;
  isDeleted: boolean;
};

export interface SupportModel extends Model<TSupport> {
  isSupportExists(id: string): Promise<TSupport | null>;
}
