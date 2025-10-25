/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  _id: any;
  name: {
    firstName: string;
    lastName: string
  };
  email: string;
  phone: string;
  password: string;
  address?: string;
  otpVerified: boolean;
  passwordChangedAt?: Date;
  profileImg?: string;
  role: 'superAdmin' | 'admin'   | 'courier' | 'user' | 'company';
  status: 'active' | 'blocked';
  emailStatus: 'verified' | 'unverified';
  jobPosted?: boolean;
  userType?: 'user' | 'company';
  companyName?: string;
  companyLocation?: string;
  approvalStatus?: boolean;
  communicationMode?: 'whatsapp' | 'textMessage';
  howKnow?: 'google' | 'socialMedia' | 'website';
  courierExperience?: string;
  profileVerified?: 'verified' | 'unverified';
  document?: string;
  legalForm?: string;
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
