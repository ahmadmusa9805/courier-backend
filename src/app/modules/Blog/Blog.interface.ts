/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TBlog = {
  title: string;
  description?: string;
  status: 'active' | 'inactive';
  img: string;
  isDeisBlocked: boolean;
  isDeleted: boolean;
};

export interface BlogModel extends Model<TBlog> {
  isBlogExists(id: string): Promise<TBlog | null>;
}
