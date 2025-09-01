/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser { 
  name: string;
  email: string;
  contactNo: string;
  password: string;
  otpVerified: boolean;
  passwordChangedAt?: Date;
  profileImg?: string;
  project?: Types.ObjectId;
  address?: string;
  postCode?: string;
  role: 'client' | 'superAdmin' | 'basicAdmin' | 'primeAdmin';
  status?: 'active' | 'blocked';
  isDeleted: boolean;
}
export interface UserModel extends Model<TUser> {
  // Static methods for checking if the user exists
    // isUserExistsByCustomEmail(email: string): Promise<TUser>;
  isUserExistsByCustomEmail(email: string): Promise<TUser | null>;

  // Static method for password comparison
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  // Static method to check JWT issuance timing
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
export type TUserRole = keyof typeof USER_ROLE;
