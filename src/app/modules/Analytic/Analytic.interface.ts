import { Model } from 'mongoose';

export type TAnalytic = {
  name: string;
  description?: string;
  atcCodes: string;
  isDeleted: boolean;
};

export interface AnalyticModel extends Model<TAnalytic> {
  isAnalyticExists(id: string): Promise<TAnalytic | null>;
}
